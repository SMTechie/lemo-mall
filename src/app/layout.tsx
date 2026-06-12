import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { auth } from "@/auth";
import { siteUrl } from "@/lib/utils";
import { SiteShell } from "@/components/site/site-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Lemo Fest",
    template: "%s | Lemo Fest"
  },
  description: "Lemo Fest tickets, official merch, visitor support and bar-card refund information.",
  metadataBase: new URL(siteUrl()),
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers permissions={session?.user?.permissions ?? []} roles={session?.user?.roles ?? []}>
          <SiteShell hasSession={Boolean(session?.user)} hasStaffAccess={Boolean(session?.user?.permissions?.length)}>
            {children}
          </SiteShell>
        </Providers>
      </body>
    </html>
  );
}
