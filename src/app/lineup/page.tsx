import Image from "next/image";
import Link from "next/link";
import { Mic2, Music2, Sparkles } from "lucide-react";
import { festivalProgramme, lineupHighlights } from "@/lib/lemofest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Line-up",
  description: "Lemo Fest stage and artist announcement hub."
};

export default function LineupPage() {
  return (
    <main>
      <section className="border-b bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Badge variant="secondary">Artists loading</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-normal sm:text-5xl">Line-up announcements are coming to the stage.</h1>
          <p className="mt-4 max-w-2xl text-background/75">
            Follow the Lemo Fest line-up hub for artist drops, hosts, DJs, stage times and special guests as they are announced.
          </p>
          <Button asChild className="mt-7">
            <Link href="/events">Book tickets</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">Stages</p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal">Featured stage lanes</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {lineupHighlights.map((item) => (
            <Card key={item.title} className="overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              </div>
              <CardContent className="p-5">
                <Music2 className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm font-semibold text-muted-foreground">{item.stage}</p>
                <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-primary">Programme links</p>
            <h2 className="mt-2 text-3xl font-bold tracking-normal">Where the line-up will land</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {festivalProgramme.map((item) => (
              <Link key={`${item.date}-${item.title}`} href={item.href} className="rounded-lg border bg-background p-4 transition-colors hover:bg-muted">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.date} - {item.venue}</p>
                  </div>
                  <Badge variant={item.status === "Opening soon" ? "outline" : "secondary"}>{item.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          ["Artists", Mic2, "Performer cards and announcement dates should be added as confirmations come in."],
          ["Stage Times", Sparkles, "A timetable view will help patrons plan their festival day."],
          ["Hosts and DJs", Music2, "Support acts, hosts and DJs add the festival texture people expect."]
        ].map(([title, Icon, copy]) => (
          <Card key={String(title)}>
            <CardContent className="p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold">{String(title)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{String(copy)}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
