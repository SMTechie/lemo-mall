import Link from "next/link";
import { BackdropPanel } from "@/components/site/backdrop-panel";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/site/product-card";
import { getFeaturedProducts } from "@/lib/site-data";

export const metadata = {
  title: "Shop",
  description: "Browse Lemo Fest merchandise, apparel, and accessories.",
};

export default async function ShopPage() {
  const products = await getFeaturedProducts();

  return (
    <div className="py-16">
      <Container>
        <BackdropPanel
          image="https://images.pexels.com/photos/28701952/pexels-photo-28701952.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Festival hoodie and apparel"
          contentClassName="p-8"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Apparel store</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8] sm:text-5xl">
            Festival clothing people will wear again.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            Sample tees, hoodies, caps, and tote bags share the same cart and PayGate checkout
            path as tickets, so a guest can buy everything in one order.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-white/55">
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2">Heavyweight tee</span>
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2">Oversized hoodie</span>
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2">Logo cap</span>
            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2">Canvas tote</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b]"
            >
              Buy tickets
            </Link>
            <Link
              href="/checkout"
              className="inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
            >
              View cart
            </Link>
          </div>
        </BackdropPanel>
      </Container>

      <section className="mt-14">
        <Container>
          <SectionHeading
            eyebrow="Featured products"
            title="A clean store grid for apparel drops"
            description="Use categories, practical product photos, and simple pricing so the store feels easy to trust."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
