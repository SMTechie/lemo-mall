import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const image = await prisma.imageAsset.findUnique({
    where: { id },
    select: {
      data: true,
      filename: true,
      mimeType: true,
      size: true,
      updatedAt: true
    }
  });

  if (!image) return NextResponse.json({ error: "Image not found" }, { status: 404 });

  return new NextResponse(image.data, {
    headers: {
      "Content-Type": image.mimeType,
      "Content-Length": String(image.size),
      "Content-Disposition": `inline; filename="${image.filename.replaceAll('"', "")}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Last-Modified": image.updatedAt.toUTCString(),
      "X-Content-Type-Options": "nosniff"
    }
  });
}
