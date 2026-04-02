import Link from "next/link";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { SectionHeading } from "@/components/ui/section-heading";
import { deleteGalleryAction, upsertGalleryAction } from "@/actions/admin";
import { getAdminEvents, getAdminGallery } from "@/lib/site-data";

type PageProps = {
  searchParams: Promise<{ edit?: string }>;
};

export const metadata = {
  title: "Manage gallery",
  description: "Create, edit, and delete gallery images.",
};

export default async function AdminGalleryPage({ searchParams }: PageProps) {
  const { edit } = await searchParams;
  const [gallery, events] = await Promise.all([getAdminGallery(), getAdminEvents()]);
  const current = edit ? gallery.find((image) => image.id === edit) : null;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Gallery</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f8f4e8]">Manage event imagery</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Add photos, select event associations, and expose download links for marketing use.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <form action={upsertGalleryAction} className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow={current ? "Edit image" : "New image"}
            title={current ? "Update the selected image" : "Create a gallery entry"}
            className="mb-6"
          />
          <input type="hidden" name="id" defaultValue={current?.id ?? ""} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="title" defaultValue={current?.title ?? ""} placeholder="Image title" required />
            <Input name="slug" defaultValue={current?.slug ?? ""} placeholder="image-slug" required />
            <Select name="eventId" defaultValue={current?.eventId ?? ""} className="sm:col-span-2">
              <option value="">No event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </Select>
            <Input
              name="imageUrl"
              defaultValue={current?.imageUrl ?? "/images/gallery-stage.svg"}
              placeholder="Image URL"
              className="sm:col-span-2"
            />
            <Input type="file" name="imageFile" accept="image/*" className="sm:col-span-2" />
            <Input
              name="downloadUrl"
              defaultValue={current?.downloadUrl ?? ""}
              placeholder="Download URL"
              className="sm:col-span-2"
            />
            <Input
              name="altText"
              defaultValue={current?.altText ?? ""}
              placeholder="Alt text"
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
            placeholder="Image description"
            className="mt-4"
          />
          <Button type="submit" className="mt-4 w-full">
            {current ? "Update image" : "Create image"}
          </Button>
        </form>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow="Gallery entries"
            title="Image library"
            description="Download links and event associations are visible from the list."
            className="mb-6"
          />
          <div className="space-y-4">
            {gallery.map((image) => (
              <div
                key={image.id}
                className="rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#f8f4e8]">{image.title}</p>
                    <p className="text-sm text-white/55">{image.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/gallery?edit=${image.id}`}
                      className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70 transition hover:bg-white/12"
                    >
                      Edit
                    </Link>
                    <ConfirmActionDialog
                      triggerLabel="Delete"
                      title="Delete this gallery image?"
                      description={`This will remove ${image.title} from the public gallery.`}
                      confirmLabel="Delete image"
                      action={deleteGalleryAction}
                      fields={{ id: image.id }}
                    />
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
