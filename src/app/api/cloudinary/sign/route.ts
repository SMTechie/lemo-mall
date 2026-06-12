import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cloudinaryUploadSignature } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user.permissions?.includes("manage_products")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(cloudinaryUploadSignature());
}
