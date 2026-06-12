export function whatsappNumber() {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27821234567";
}

export function whatsappUrl(message = "Hi Lemo Mall, I need help with an order or ticket.") {
  return `https://wa.me/${whatsappNumber()}?text=${encodeURIComponent(message)}`;
}
