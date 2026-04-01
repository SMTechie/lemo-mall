import Link from "next/link";
import { Download } from "lucide-react";
import { BackdropPanel } from "@/components/site/backdrop-panel";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GalleryCard } from "@/components/site/gallery-card";
import { getFeaturedGallery } from "@/lib/site-data";

export const metadata = {
  title: "Gallery",
  description: "Browse and download past Lemo Fest event photography.",
};

export default async function GalleryPage() {
  const gallery = await getFeaturedGallery();

  return (
    <div className="py-16">
      <Container>
        <BackdropPanel image="/lemofest/blog11.jpg" alt="Lemo Fest gallery crowd" contentClassName="p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Gallery</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8] sm:text-5xl">
            Real photos from nights people remember.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            The gallery gives guests something real to browse before they buy, and it gives the
            team images they can reuse for the next launch.
          </p>
          <div className="mt-6">
            <Link
              href="/news"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
            >
              <Download className="h-4 w-4 text-[#0b0b0b]" />
              News feed
            </Link>
          </div>
        </BackdropPanel>
      </Container>

      <section className="mt-14">
        <Container>
          <SectionHeading
            eyebrow="Photo grid"
            title="Easy browsing, easy downloads"
            description="Use the grid for event photos, promo stills, and archive highlights that feel useful rather than filler."
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {gallery.map((image) => (
              <GalleryCard key={image.id} image={image} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
