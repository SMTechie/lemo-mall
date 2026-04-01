import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getAdminEvents } from "@/lib/site-data";
import { deleteEventAction, upsertEventAction } from "@/actions/admin";
import { formatDateTime } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<{ edit?: string; success?: string; deleted?: string }>;
};

function toLocalDateTime(value?: Date | string | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 16);
}

export const metadata = {
  title: "Manage events",
  description: "Create, edit, and delete Lemo Fest events.",
};

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const { edit } = await searchParams;
  const events = await getAdminEvents();
  const current = edit ? events.find((event) => event.id === edit) : null;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Events</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f8f4e8]">Manage line-ups and schedules</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Edit the public event catalog and keep the ticket storefront current.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <form action={upsertEventAction} className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow={current ? "Edit event" : "New event"}
            title={current ? "Update the selected event" : "Create a new event"}
            description="Use image URLs or upload a file to Cloudinary if credentials are configured."
            className="mb-6"
          />
          <input type="hidden" name="id" defaultValue={current?.id ?? ""} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="title" defaultValue={current?.title ?? ""} placeholder="Event title" required />
            <Input name="slug" defaultValue={current?.slug ?? ""} placeholder="event-slug" required />
            <Input name="location" defaultValue={current?.location ?? ""} placeholder="Location" required />
            <Input name="venue" defaultValue={current?.venue ?? ""} placeholder="Venue" />
            <Input name="address" defaultValue={current?.address ?? ""} placeholder="Address" className="sm:col-span-2" />
            <Input
              name="startsAt"
              type="datetime-local"
              defaultValue={toLocalDateTime(current?.startsAt)}
              required
            />
            <Input
              name="endsAt"
              type="datetime-local"
              defaultValue={toLocalDateTime(current?.endsAt)}
            />
            <Input
              name="ticketPriceCents"
              type="number"
              min="0"
              defaultValue={current?.ticketPriceCents ?? 0}
              placeholder="Ticket price in cents"
              required
            />
            <Input
              name="capacity"
              type="number"
              min="1"
              defaultValue={current?.capacity ?? ""}
              placeholder="Capacity"
            />
            <Input
              name="imageUrl"
              defaultValue={current?.imageUrl ?? "/images/event-sunset.svg"}
              placeholder="Image URL"
              className="sm:col-span-2"
            />
            <Input
              type="file"
              name="imageFile"
              accept="image/*"
              className="sm:col-span-2"
            />
            <Input
              name="galleryUrls"
              defaultValue={current?.galleryUrls.join(", ") ?? ""}
              placeholder="Gallery URLs separated by commas"
              className="sm:col-span-2"
            />
            <Input
              name="tags"
              defaultValue={current?.tags.join(", ") ?? ""}
              placeholder="Tags separated by commas"
              className="sm:col-span-2"
            />
            <div className="flex items-center gap-3">
              <input type="checkbox" name="featured" defaultChecked={current?.featured ?? false} />
              <span className="text-sm text-white/70">Featured</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="published" defaultChecked={current?.published ?? true} />
              <span className="text-sm text-white/70">Published</span>
            </div>
          </div>
          <Textarea
            name="description"
            defaultValue={current?.description ?? ""}
            placeholder="Event description"
            className="mt-4"
            required
          />
          <Button type="submit" className="mt-4 w-full">
            {current ? "Update event" : "Create event"}
          </Button>
        </form>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow="Existing events"
            title="Public lineup"
            description="Use the edit link to preload the form with existing values."
            className="mb-6"
          />
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#f8f4e8]">{event.title}</p>
                    <p className="text-sm text-white/55">{event.location}</p>
                    <p className="text-xs text-white/45">{formatDateTime(event.startsAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/events?edit=${event.id}`}
                      className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70 transition hover:bg-white/12"
                    >
                      Edit
                    </Link>
                    <form action={deleteEventAction}>
                      <input type="hidden" name="id" value={event.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-[#ff6b4a]/30 bg-[#ff6b4a]/10 px-3 py-2 text-xs text-[#ffd7cf]"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
