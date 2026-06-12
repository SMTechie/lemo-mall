CREATE TABLE "ImageAsset" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "uploadedById" TEXT,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageAsset_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ImageAsset_tenantId_idx" ON "ImageAsset"("tenantId");
CREATE INDEX "ImageAsset_uploadedById_idx" ON "ImageAsset"("uploadedById");
CREATE INDEX "ImageAsset_createdAt_idx" ON "ImageAsset"("createdAt");

ALTER TABLE "ImageAsset" ADD CONSTRAINT "ImageAsset_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ImageAsset" ADD CONSTRAINT "ImageAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
