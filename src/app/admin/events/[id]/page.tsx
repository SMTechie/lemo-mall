import { notFound } from "next/navigation";
import { saveEventAction } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { AdminImageUpload } from "@/components/admin/admin-image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id }, include: { ticketTypes: true } });
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Edit event</CardTitle></CardHeader>
        <CardContent>
          <form action={saveEventAction} className="grid gap-4">
            <input type="hidden" name="id" value={event.id} />
            <div className="grid gap-2"><Label>Title</Label><Input name="title" defaultValue={event.title} required /></div>
            <div className="grid gap-2"><Label>Description</Label><Textarea name="description" defaultValue={event.description} required /></div>
            <div className="grid gap-2">
              <Label>Date and time</Label>
              <Input name="startsAt" type="datetime-local" defaultValue={event.startsAt.toISOString().slice(0, 16)} required />
            </div>
            <div className="grid gap-2"><Label>Location</Label><Input name="location" defaultValue={event.location} required /></div>
            <div className="grid gap-2">
              <Label>Banner image</Label>
              <AdminImageUpload name="bannerImage" initialImages={[event.bannerImage]} />
            </div>
            <div className="rounded-md border p-3">
              <p className="mb-3 text-sm font-medium">Ticket types</p>
              {event.ticketTypes.map((ticket) => (
                <div key={ticket.id} className="mb-3 grid gap-2 sm:grid-cols-3">
                  <Input name="ticketName" defaultValue={ticket.name} />
                  <Input name="ticketPriceCents" type="number" defaultValue={ticket.priceCents} />
                  <Input name="ticketQuantity" type="number" defaultValue={ticket.quantity} />
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={event.featured} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={event.published} /> Published</label>
            <Button>Update event</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
