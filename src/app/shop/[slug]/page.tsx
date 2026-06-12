import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { WishlistButton } from "@/components/customer/wishlist-button";
import { ReviewForm } from "@/components/customer/review-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  return { title: product?.name ?? "Product", description: product?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.active) notFound();
  const reviews = await prisma.review.findMany({
    where: { productId: product.id, approved: true },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 6
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
        </div>
        <div>
          <Badge variant="outline">{product.category}</Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-normal">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold">{formatMoney(product.priceCents)}</p>
          <p className="mt-5 text-muted-foreground">{product.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">{product.stock} units available</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton item={{ kind: "product", productId: product.id, name: product.name, priceCents: product.priceCents, image: product.images[0], quantity: 1 }} />
            <WishlistButton productId={product.id} />
          </div>
          <Card className="mt-6">
            <CardContent className="p-4">
              <p className="font-semibold">Frequently bought together</p>
              <p className="mt-1 text-sm text-muted-foreground">Pair this item with event tickets during checkout for bundle-style cart building.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {reviews.length === 0 ? <p className="text-sm text-muted-foreground">No reviews yet.</p> : null}
            {reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-3">
                <p className="font-medium">{review.rating}/5 · {review.user.name}</p>
                {review.comment ? <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p> : null}
              </div>
            ))}
          </CardContent>
        </Card>
        <ReviewForm productId={product.id} />
      </section>
    </main>
  );
}
