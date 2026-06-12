import Image from "next/image";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { saveEventAction, deleteEventAction, duplicateEventAction } from "@/actions/admin";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";
import { AdminImageUpload } from "@/components/admin/admin-image-upload";
import { AdminModal } from "@/components/admin/admin-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminEventsPage({ searchParams }: { searchParams?: Promise<{ create?: string }> }) {
  const params = await searchParams;
  const session = await auth();
  const canManageEvents = session?.user.permissions.includes("manage_events");
  const showCreateForm = canManageEvents && params?.create === "1";
  const events = await prisma.event.findMany({ include: { ticketTypes: true }, orderBy: { startsAt: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Events</h1>
          <p className="text-muted-foreground">Manage event pages, ticket inventory and publishing status.</p>
        </div>
        {canManageEvents ? (
          <Button asChild>
            <Link href={showCreateForm ? "/admin/events" : "/admin/events?create=1"}>
              {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showCreateForm ? "Close form" : "Add event"}
            </Link>
          </Button>
        ) : null}
      </div>

      {showCreateForm ? (
        <AdminModal closeHref="/admin/events" title="Create event" description="Add the event details and starting ticket types.">
              <form action={saveEventAction} className="grid gap-5">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="grid gap-2"><Label>Title</Label><Input name="title" required /></div>
                  <div className="grid gap-2"><Label>Date and time</Label><Input name="startsAt" type="datetime-local" required /></div>
                  <div className="grid gap-2"><Label>Location</Label><Input name="location" required /></div>
                  <div className="grid gap-2">
                    <Label>Banner image</Label>
                    <AdminImageUpload name="bannerImage" />
                  </div>
                  <div className="grid gap-2 lg:col-span-2"><Label>Description</Label><Textarea name="description" className="min-h-28" required /></div>
                </div>
                <div className="rounded-md border p-4">
                  <div className="mb-3">
                    <p className="text-sm font-medium">Ticket types</p>
                    <p className="text-xs text-muted-foreground">Set the initial price in cents and available quantity.</p>
                  </div>
                  <div className="grid gap-3">
                    {["General", "VIP", "Early Bird"].map((name, index) => (
                      <div key={name} className="grid gap-2 md:grid-cols-3">
                        <Input name="ticketName" defaultValue={name} aria-label={`${name} ticket name`} />
                        <Input name="ticketPriceCents" type="number" defaultValue={index === 1 ? 45000 : 18000} aria-label={`${name} price cents`} />
                        <Input name="ticketQuantity" type="number" defaultValue={index === 1 ? 80 : 300} aria-label={`${name} quantity`} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" /> Featured event</label>
                  <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href="/admin/events">Cancel</Link></Button>
                    <Button>Save event</Button>
                  </div>
                </div>
              </form>
        </AdminModal>
      ) : null}

      <Card className="rounded-md border-border/80 bg-background shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All events</CardTitle>
              <CardDescription>{events.length} event{events.length === 1 ? "" : "s"} in this workspace.</CardDescription>
            </div>
            {canManageEvents && !showCreateForm ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/events?create=1"><Plus className="h-4 w-4" />Add event</Link>
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Date</TableHead><TableHead>Tickets</TableHead><TableHead>Revenue</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {events.map((event) => {
                const sold = event.ticketTypes.reduce((sum, type) => sum + type.sold, 0);
                const revenue = event.ticketTypes.reduce((sum, type) => sum + type.sold * type.priceCents, 0);
                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-16 overflow-hidden rounded-md border">
                          <Image src={event.bannerImage} alt={event.title} fill sizes="64px" className="object-cover" />
                        </div>
                        <span className="font-medium">{event.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{event.startsAt.toLocaleDateString("en-ZA")}</TableCell>
                    <TableCell>{sold}</TableCell>
                    <TableCell>{formatMoney(revenue)}</TableCell>
                    <TableCell>
                      {canManageEvents ? (
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/events/${event.id}`}>Edit</Link>
                          </Button>
                          <form action={deleteEventAction.bind(null, event.id)}>
                            <Button variant="ghost" size="sm">Unpublish</Button>
                          </form>
                          <form action={duplicateEventAction.bind(null, event.id)}>
                            <Button variant="ghost" size="sm">Duplicate</Button>
                          </form>
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No events yet. Use Add event to create your first listing.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
