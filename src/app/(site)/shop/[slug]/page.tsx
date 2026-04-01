import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Package, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { PurchasePanel } from "@/components/cart/purchase-panel";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedProducts, getProductBySlug } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getFeaturedProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Merch item not found" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = (await getFeaturedProducts()).filter((entry) => entry.slug !== product.slug).slice(0, 3);

  return (
    <div className="py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/6 p-4 backdrop-blur">
            <div className="relative overflow-hidden rounded-[26px]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={960}
                height={800}
                className="h-[28rem] w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <Badge>{product.category}</Badge>
            <div className="space-y-4">
              <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8] sm:text-5xl">
                {product.name}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                {product.description}
              </p>
            </div>

            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-semibold text-[#f8f4e8]">
                  {formatCurrency(product.priceCents)}
                </p>
                {product.compareAtPriceCents ? (
                  <p className="text-sm text-white/45 line-through">
                    {formatCurrency(product.compareAtPriceCents)}
                  </p>
                ) : null}
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/65">
                {product.inventory === 0
                  ? "Sold out"
                  : product.inventory <= 10
                    ? `Low stock · ${product.inventory} left`
                    : `${product.inventory} in stock`}
              </div>
            </div>

            <div className="space-y-3">
              <PurchasePanel
                item={{
                  id: product.id,
                  kind: "PRODUCT",
                  slug: product.slug,
                  name: product.name,
                  unitPriceCents: product.priceCents,
                  imageUrl: product.imageUrl,
                  productId: product.id,
                }}
                label="Add item"
                maxQuantity={product.inventory}
              />
              <Link
                href="/checkout"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ffff00] px-6 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
              >
                <ShoppingBag className="h-4 w-4" />
                Checkout
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                <Package className="h-5 w-5 text-[#ffcc66]" />
                <p className="mt-3 text-sm font-medium text-[#f8f4e8]">Premium fabric</p>
                <p className="mt-1 text-xs leading-6 text-white/55">
                  Built for durable festival wear with a polished finish.
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                <ShieldCheck className="h-5 w-5 text-[#91e4ff]" />
                <p className="mt-3 text-sm font-medium text-[#f8f4e8]">Secure checkout</p>
                <p className="mt-1 text-xs leading-6 text-white/55">
                  Orders move through the same PayGate integration as ticket sales.
                </p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                <Truck className="h-5 w-5 text-[#ff8f5c]" />
                <p className="mt-3 text-sm font-medium text-[#f8f4e8]">Stock and delivery</p>
                <p className="mt-1 text-xs leading-6 text-white/55">
                  Admin can manage fulfillment, stock, and image assets from one dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {related.length ? (
          <section className="mt-14">
            <SectionHeading
              eyebrow="More pieces"
              title="Complete the look"
              description="Related drops that help boost basket size."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur"
                >
                  <h3 className="text-lg font-semibold text-[#f8f4e8]">{entry.name}</h3>
                  <p className="mt-2 text-sm text-white/65">{entry.category}</p>
                  <Link
                    href={`/shop/${entry.slug}`}
                    className="mt-4 inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
                  >
                    View item
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </div>
  );
}
