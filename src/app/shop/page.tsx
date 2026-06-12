import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Merch" };
export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const take = 12;
  const where = {
    active: true,
    ...(params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: "insensitive" as const } },
            { description: { contains: params.q, mode: "insensitive" as const } }
          ]
        }
      : {}),
    ...(params.category ? { category: params.category } : {})
  };
  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({ where, skip: (page - 1) * take, take, orderBy: { createdAt: "desc" } }),
    prisma.product.count({ where }),
    prisma.product.findMany({ where: { active: true }, distinct: ["category"], select: { category: true } })
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Merch</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal">Official Lemo Fest merch</h1>
          <p className="mt-3 text-muted-foreground">Search, filter and buy festival merchandise in ZAR.</p>
        </div>
        <form className="flex w-full gap-2 md:w-[440px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input name="q" defaultValue={params.q} className="pl-9" placeholder="Search merch" />
          </div>
        </form>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link key={category.category} href={`/shop?category=${encodeURIComponent(category.category)}`}>
            <Badge variant={params.category === category.category ? "default" : "outline"}>{category.category}</Badge>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/3]">
              <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </Link>
            <CardContent className="p-4">
              <div className="mb-3">
                <h2 className="font-semibold">{product.name}</h2>
                <p className="text-sm text-muted-foreground">{formatMoney(product.priceCents)} · {product.stock} left</p>
              </div>
              <AddToCartButton item={{ kind: "product", productId: product.id, name: product.name, priceCents: product.priceCents, image: product.images[0], quantity: 1 }} />
            </CardContent>
          </Card>
        ))}
        {products.length === 0 ? (
          <Card className="sm:col-span-2 lg:col-span-4">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold">Merch drop coming soon</h2>
              <p className="mt-2 text-sm text-muted-foreground">New Lemo Fest stock will appear here once it is published.</p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">Showing {products.length} of {total} products.</p>
    </main>
  );
}
