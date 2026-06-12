import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));
    await prisma.visit.create({
      data: {
        path: String(body.path ?? "/").slice(0, 200),
        sessionKey: body.sessionKey ? String(body.sessionKey).slice(0, 100) : undefined,
        userId: session?.user?.id
      }
    });
  } catch {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
