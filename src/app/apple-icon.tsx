import { getLogoDataUrl } from "@/lib/logo";

export default async function AppleIcon() {
  const logo = await getLogoDataUrl();
  const svg = `
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lemofest-apple-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111111" />
          <stop offset="100%" stop-color="#050505" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="180" height="180" rx="42" fill="url(#lemofest-apple-bg)" />
      <circle cx="90" cy="90" r="58" fill="#ffff00" fill-opacity="0.09" />
      <image href="${logo}" x="28" y="64" width="124" height="52" preserveAspectRatio="xMidYMid meet" />
    </svg>
  `;

  return new Response(svg.trim(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
