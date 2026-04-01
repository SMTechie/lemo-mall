import QRCode from "qrcode";

export function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000"
  );
}

export function createTicketQrPayload(ticketCode: string) {
  return `${getAppUrl()}/tickets/${ticketCode}`;
}

export async function createQrDataUrl(value: string) {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 8,
    color: {
      dark: "#F8F4E8",
      light: "#0B1020",
    },
  });
}

export function parseTicketCodeFromQrValue(value: string) {
  try {
    const url = new URL(value);
    const parts = url.pathname.split("/").filter(Boolean);
    const maybeCode = parts[parts.length - 1];
    if (maybeCode) return maybeCode;
  } catch {
    const parts = value.split(":").filter(Boolean);
    return parts[parts.length - 1] ?? value;
  }

  return value;
}

