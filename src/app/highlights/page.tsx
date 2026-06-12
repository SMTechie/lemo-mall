import Image from "next/image";
import Link from "next/link";
import { festivalImages, patronQuotes } from "@/lib/lemofest";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Highlights",
  description: "Lemo Fest highlights, patron moments and crowd energy."
};

export default function HighlightsPage() {
  return (
    <main>
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary">Highlights</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal">Lemo Fest crowd moments</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            A visual home for festival memories, stage moments, style, food, music and the patrons who make Lemo Fest move.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {festivalImages.map((image, index) => (
            <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-lg border">
              <Image src={image} alt={`Lemo Fest highlight ${index + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-primary">Patrons</p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal">From the community</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {patronQuotes.map((quote) => (
              <Card key={quote.name}>
                <CardContent className="p-6">
                  <p className="text-xl font-medium">&ldquo;{quote.quote}&rdquo;</p>
                  <p className="mt-4 text-sm text-muted-foreground">{quote.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button asChild className="mt-8">
            <Link href="/events">Get tickets</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
