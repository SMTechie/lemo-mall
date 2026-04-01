import { readFile } from "node:fs/promises";
import { join } from "node:path";

const logoPath = join(process.cwd(), "public", "lemofest", "dugem-logos.png");

export async function getLogoDataUrl() {
  const file = await readFile(logoPath);
  return `data:image/png;base64,${file.toString("base64")}`;
}
