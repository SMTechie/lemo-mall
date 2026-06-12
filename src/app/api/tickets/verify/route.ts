import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { logActivity } from "@/lib/permissions";
import { publicTicket } from "@/services/tickets";

export const runtime = "nodejs";

function ticketCodeFromPayload(payload: string) {
  const trimmed = payload.trim();
  if (!trimmed) return null;

  try {
    if (trimmed.includes("://")) {
      const url = new URL(trimmed);
      const queryCode = url.searchParams.get("code");
      if (queryCode) return queryCode;
      const ticketPathMatch = url.pathname.match(/\/tickets\/([^/?#]+)/);
      return ticketPathMatch?.[1] ? decodeURIComponent(ticketPathMatch[1]) : trimmed;
    }
    const ticketPathMatch = trimmed.match(/\/tickets\/([^/?#]+)/);
    if (ticketPathMatch?.[1]) return decodeURIComponent(ticketPathMatch[1]);
    if (trimmed.startsWith("?")) return new URLSearchParams(trimmed).get("code") ?? trimmed;
    if (trimmed.includes("=")) return new URLSearchParams(trimmed).get("code") ?? trimmed;
  } catch {
    return trimmed;
  }

  return trimmed;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const ticket = await prisma.ticket.findUnique({
    where: { code },
    include: { event: true, ticketType: true }
  });

  if (!ticket) return NextResponse.json({ valid: false, error: "Ticket not found" }, { status: 404 });

  return NextResponse.json({
    valid: ticket.status === "VALID",
    ticket: publicTicket(ticket),
    code: ticket.code,
    status: ticket.status,
    event: ticket.event.title,
    ticketType: ticket.ticketType.name,
    holderName: ticket.holderName
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user.permissions?.includes("scan_tickets")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const key = req.headers.get("x-forwarded-for") ?? "scanner";
  if (!rateLimit(key, 90, 60_000).ok) {
    return NextResponse.json({ error: "Too many scans" }, { status: 429 });
  }

  const body = await req.json();
  const payload = String(body.payload ?? "");
  const code = ticketCodeFromPayload(payload);
  if (!code) return NextResponse.json({ error: "Missing ticket code" }, { status: 400 });

  const ticket = await prisma.ticket.findUnique({
    where: { code },
    include: { event: true, ticketType: true }
  });

  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  if (ticket.status !== "VALID") {
    return NextResponse.json({ error: "Ticket already used or void", ticket: publicTicket(ticket) }, { status: 409 });
  }

  const claimed = await prisma.ticket.updateMany({
    where: { id: ticket.id, status: "VALID" },
    data: { status: "USED", usedAt: new Date() }
  });

  if (claimed.count !== 1) {
    const latest = await prisma.ticket.findUnique({ where: { id: ticket.id }, include: { event: true, ticketType: true } });
    return NextResponse.json({ error: "Ticket already used or void", ticket: latest ? publicTicket(latest) : null }, { status: 409 });
  }

  const updated = await prisma.ticket.findUnique({
    where: { id: ticket.id },
    include: { event: true, ticketType: true }
  });
  if (!updated) return NextResponse.json({ error: "Ticket not found after update" }, { status: 404 });

  const total = await prisma.ticket.count({ where: { eventId: ticket.eventId } });
  const checkedIn = await prisma.ticket.count({ where: { eventId: ticket.eventId, status: "USED" } });
  await logActivity({ action: "ticket.checked_in", entityType: "Ticket", entityId: ticket.id, metadata: { code: ticket.code } });

  return NextResponse.json({ ok: true, ticket: publicTicket(updated), checkIn: { total, checkedIn } });
}
