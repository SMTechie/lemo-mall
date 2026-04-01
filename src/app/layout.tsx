import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import type { CSSProperties, ReactNode } from "react";

const fontVariables = {
  "--font-display-face": '"Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif',
  "--font-body-face": '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
} as CSSProperties;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Lemo Fest",
    template: "%s | Lemo Fest",
  },
  description:
    "Lemo Fest - Now or Never. Tickets, events, shop, gallery, and scanner tools in one platform.",
  applicationName: "Lemo Fest",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Lemo Fest",
    description:
      "Lemo Fest - Now or Never. Tickets, events, shop, gallery, and scanner tools in one platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lemo Fest",
    description:
      "Lemo Fest - Now or Never. Tickets, events, shop, gallery, and scanner tools in one platform.",
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" style={fontVariables}>
      <body className="min-h-screen bg-[#0b0b0b] text-[#f8f4e8] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
