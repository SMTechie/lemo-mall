import { getLogoDataUrl } from "@/lib/logo";

export default async function Icon() {
  const logo = await getLogoDataUrl();
  const svg = `
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lemofest-icon-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#120c0f" />
          <stop offset="100%" stop-color="#050505" />
        </linearGradient>
        <linearGradient id="lemofest-icon-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffff00" stop-opacity="0.36" />
          <stop offset="100%" stop-color="#ff2c55" stop-opacity="0.18" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="180" height="180" rx="42" fill="url(#lemofest-icon-bg)" />
      <rect x="12" y="12" width="156" height="156" rx="34" fill="url(#lemofest-icon-glow)" />
      <circle cx="90" cy="90" r="54" fill="#0b0b0b" fill-opacity="0.62" />
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
