import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Wishlist" };

export default async function WishlistPage() {
  const session = await requireUser();
  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true, event: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-normal">Saved items</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const title = item.product?.name ?? item.event?.title ?? "Saved item";
          const href = item.product ? `/shop/${item.product.slug}` : `/events/${item.event?.slug}`;
          const image = item.product?.images[0] ?? item.event?.bannerImage;
          return (
            <Card key={item.id} className="overflow-hidden">
              {image ? (
                <div className="relative aspect-[4/3]">
                  <Image src={image} alt={title} fill sizes="80px" className="object-cover" />
                </div>
              ) : null}
              <CardContent className="p-4">
                <h2 className="font-semibold">{title}</h2>
                <Button asChild className="mt-4" variant="outline"><Link href={href}>View</Link></Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
