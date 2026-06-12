import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { imageAssetPath } from "@/lib/images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const maxFileSize = 5 * 1024 * 1024;
const maxFiles = 8;

export async function POST(req: Request) {
  const session = await auth();
  const permissions = session?.user.permissions ?? [];
  if (!session?.user || (!permissions.includes("manage_products") && !permissions.includes("manage_events"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, maxFiles);

  if (files.length === 0) {
    return NextResponse.json({ error: "Attach at least one image." }, { status: 400 });
  }

  const tenantId = session.user.tenantId;
  const images = [];

  for (const file of files) {
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: `${file.name} is not a supported image type.` }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: `${file.name} is larger than 5MB.` }, { status: 400 });
    }

    const image = await prisma.imageAsset.create({
      data: {
        tenantId,
        uploadedById: session.user.id,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        data: Buffer.from(await file.arrayBuffer())
      },
      select: {
        id: true,
        filename: true,
        mimeType: true,
        size: true
      }
    });

    images.push({
      ...image,
      url: imageAssetPath(image.id)
    });
  }

  return NextResponse.json({ images });
}
