import type { Metadata } from "next";
import SiteHomePage from "@/app/(site)/page";
import SiteLayout from "@/app/(site)/layout";

export const metadata: Metadata = {
  title: "Home",
  description: "Lemo Fest ticketing, merch, gallery, and verification platform.",
};

export default function Home() {
  return (
    <SiteLayout>
      <SiteHomePage />
    </SiteLayout>
  );
}
