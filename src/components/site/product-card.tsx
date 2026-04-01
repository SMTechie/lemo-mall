import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

type ProductCardProps = {
  product: {
    slug: string;
    name: string;
    description: string;
    priceCents: number;
    compareAtPriceCents?: number | null;
    category: string;
    imageUrl: string;
    inventory?: number;
    featured?: boolean;
  };
};

function getStockLabel(inventory?: number) {
  if (typeof inventory !== "number") {
    return null;
  }

  if (inventory <= 0) {
    return "Sold out";
  }

  if (inventory <= 10) {
    return `Low stock · ${inventory} left`;
  }

  return null;
}

export function ProductCard({ product }: ProductCardProps) {
  const stockLabel = getStockLabel(product.inventory);

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/6 p-3 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/20 animate-fade-up motion-reduce:animate-none">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050913] via-transparent to-transparent" />
        <Badge className="absolute left-4 top-4">{product.category}</Badge>
        {stockLabel ? (
          <Badge className="absolute left-4 top-14 bg-black/70 text-white">{stockLabel}</Badge>
        ) : null}
        {product.featured ? (
          <Badge className="absolute right-4 top-4 bg-black/70 text-[#ffff00]">Featured</Badge>
        ) : null}
      </div>
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[#f8f4e8]">{product.name}</h3>
          <p className="line-clamp-2 text-sm leading-7 text-white/68">{product.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-lg font-semibold text-[#f8f4e8]">
              {formatCurrency(product.priceCents)}
            </p>
            {product.compareAtPriceCents ? (
              <p className="text-xs text-white/45 line-through">
                {formatCurrency(product.compareAtPriceCents)}
              </p>
            ) : null}
          </div>
          <div className="ml-auto">
            <Link
              href={`/shop/${product.slug}`}
              className="inline-flex h-11 items-center rounded-full bg-[#ffff00] px-4 text-sm font-semibold text-[#0b0b0b] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition hover:brightness-95"
            >
              View item
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
