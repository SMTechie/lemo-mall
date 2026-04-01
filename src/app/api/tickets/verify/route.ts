import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAndConsumeTicket } from "@/lib/tickets";
import { ticketVerificationSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || !["ADMIN", "STAFF"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = ticketVerificationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid ticket code",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const result = await verifyAndConsumeTicket({
    code: parsed.data.code,
    scannerUserId: session.user.id,
  });

  return NextResponse.json(result);
}

