import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,44,85,0.18),transparent_46%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[20rem] bg-[linear-gradient(180deg,rgba(11,11,11,0.94),transparent)]" />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
