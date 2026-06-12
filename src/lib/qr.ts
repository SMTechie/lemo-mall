import "server-only";

import QRCode from "qrcode";
import { absoluteUrl } from "@/lib/utils";

export function ticketPayload(code: string) {
  return `${absoluteUrl("/api/tickets/verify")}?code=${encodeURIComponent(code)}`;
}

export async function ticketQrDataUrl(code: string) {
  return QRCode.toDataURL(ticketPayload(code), {
    margin: 2,
    scale: 8,
    errorCorrectionLevel: "M"
  });
}
