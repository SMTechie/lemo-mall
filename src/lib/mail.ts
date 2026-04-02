import nodemailer, { type Transporter } from "nodemailer";
import { escapeHtml } from "./utils";

type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

let cachedTransport: Transporter | null = null;

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    if (!host) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth:
      user && pass
        ? {
            user,
            pass,
          }
        : undefined,
  });
}

export function getMailTransport() {
  if (cachedTransport !== null) return cachedTransport;
  cachedTransport = createTransport();
  return cachedTransport;
}

export function getMailFrom() {
  return process.env.MAIL_FROM ?? "Lemo Fest <tickets@lemofest.co.za>";
}

export async function sendMail(message: MailMessage) {
  const transport = getMailTransport();
  const from = getMailFrom();

  if (!transport) {
    console.info("[mail:mock]", {
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
    return;
  }

  await transport.sendMail({
    from,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });
}

export async function sendMagicLinkEmail(input: {
  to: string;
  url: string;
  host: string;
}) {
  const subject = `Sign in to ${input.host}`;
  const html = `
    <div style="font-family:Arial,sans-serif;background:#0b1020;color:#f8f4e8;padding:32px">
      <div style="max-width:560px;margin:0 auto;background:#121a33;border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:32px">
        <p style="text-transform:uppercase;letter-spacing:.24em;color:#ffcc66;font-size:12px;margin:0 0 12px">Lemo Fest Access</p>
        <h1 style="font-size:32px;line-height:1.1;margin:0 0 16px">Your sign-in link is ready</h1>
        <p style="font-size:16px;line-height:1.7;color:#d6d9e7;margin:0 0 24px">
          Use the button below to sign in securely. The link expires shortly, so use it from the same device if possible.
        </p>
        <a href="${input.url}" style="display:inline-block;background:#ff6b4a;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700">Sign in now</a>
        <p style="font-size:12px;color:#a5acc1;margin:24px 0 0;word-break:break-all">${escapeHtml(input.url)}</p>
      </div>
    </div>
  `;

  await sendMail({
    to: input.to,
    subject,
    html,
    text: `Sign in to ${input.host}: ${input.url}`,
  });
}

export async function sendTicketEmail(input: {
  to: string;
  customerName: string;
  orderNumber: string;
  tickets: Array<{
    code: string;
    eventTitle: string;
    ticketUrl: string;
    qrDataUrl?: string;
  }>;
}) {
  const cards = input.tickets
    .map(
      (ticket) => `
        <div style="background:#11182f;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:18px;margin-bottom:16px">
          <p style="margin:0 0 8px;color:#ffcc66;font-size:12px;text-transform:uppercase;letter-spacing:.18em">Ticket ${escapeHtml(ticket.code)}</p>
          <h2 style="margin:0 0 8px;font-size:20px">${escapeHtml(ticket.eventTitle)}</h2>
          <p style="margin:0 0 16px;color:#d6d9e7">Present this QR code at the gate. Status will update automatically after scan.</p>
          ${ticket.qrDataUrl ? `<img src="${ticket.qrDataUrl}" alt="QR code for ${escapeHtml(ticket.code)}" style="width:180px;height:180px;border-radius:16px;display:block;background:#0b1020;padding:10px" />` : ""}
          <p style="margin:16px 0 0"><a href="${ticket.ticketUrl}" style="color:#91e4ff">Open printable ticket</a></p>
        </div>
      `,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;background:#0b1020;color:#f8f4e8;padding:32px">
      <div style="max-width:640px;margin:0 auto;background:#121a33;border:1px solid rgba(255,255,255,.08);border-radius:24px;padding:32px">
        <p style="text-transform:uppercase;letter-spacing:.24em;color:#ffcc66;font-size:12px;margin:0 0 12px">Lemo Fest Ticket Delivery</p>
        <h1 style="font-size:34px;line-height:1.1;margin:0 0 10px">Your tickets are ready</h1>
        <p style="font-size:16px;line-height:1.7;color:#d6d9e7;margin:0 0 24px">
          Hi ${escapeHtml(input.customerName)}, your order ${escapeHtml(input.orderNumber)} has been confirmed. Save this email and keep the QR codes safe.
        </p>
        ${cards}
      </div>
    </div>
  `;

  const text = [
    `Your tickets for order ${input.orderNumber} are ready.`,
    ...input.tickets.map((ticket) => `${ticket.eventTitle} - ${ticket.code}: ${ticket.ticketUrl}`),
  ].join("\n");

  await sendMail({
    to: input.to,
    subject: `Your Lemo Fest tickets (${input.orderNumber})`,
    html,
    text,
  });
}
