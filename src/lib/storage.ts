import { v2 as cloudinary } from "cloudinary";

export function hasCloudinaryCredentials() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function configureCloudinary() {
  if (!hasCloudinaryCredentials()) {
    throw new Error("Cloudinary credentials are not configured");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadFileToCloudinary(
  file: File,
  folder = "lemo-fest",
): Promise<string> {
  configureCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());

  return await new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url) {
          reject(new Error("Cloudinary upload did not return a secure URL"));
          return;
        }

        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });
}

export async function resolveImageUrl(input: {
  file?: File | null;
  fallbackUrl?: string | null;
  folder?: string;
}) {
  if (input.file && input.file.size > 0) {
    if (!hasCloudinaryCredentials()) {
      throw new Error(
        "Image upload requires Cloudinary credentials. Provide an image URL or configure storage.",
      );
    }

    return uploadFileToCloudinary(input.file, input.folder);
  }

  return input.fallbackUrl?.trim() ?? "";
}

