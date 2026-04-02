import Link from "next/link";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { SectionHeading } from "@/components/ui/section-heading";
import { deleteTestimonialAction, upsertTestimonialAction } from "@/actions/admin";
import { getAdminTestimonials } from "@/lib/site-data";

type PageProps = {
  searchParams: Promise<{ edit?: string }>;
};

export const metadata = {
  title: "Manage testimonials",
  description: "Create, edit, and delete testimonials.",
};

export default async function AdminTestimonialsPage({ searchParams }: PageProps) {
  const { edit } = await searchParams;
  const testimonials = await getAdminTestimonials();
  const current = edit ? testimonials.find((item) => item.id === edit) : null;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Testimonials</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f8f4e8]">Manage social proof</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Add quotes, avatars, and featured reviews for the homepage.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <form action={upsertTestimonialAction} className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow={current ? "Edit testimonial" : "New testimonial"}
            title={current ? "Update the selected quote" : "Create a testimonial"}
            className="mb-6"
          />
          <input type="hidden" name="id" defaultValue={current?.id ?? ""} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="name" defaultValue={current?.name ?? ""} placeholder="Guest name" required />
            <Input name="role" defaultValue={current?.role ?? ""} placeholder="Role" />
            <Input
              name="avatarUrl"
              defaultValue={current?.avatarUrl ?? "/images/avatar-1.svg"}
              placeholder="Avatar URL"
              className="sm:col-span-2"
            />
            <Input type="file" name="avatarFile" accept="image/*" className="sm:col-span-2" />
            <Select name="rating" defaultValue={String(current?.rating ?? 5)} className="sm:col-span-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} stars
                </option>
              ))}
            </Select>
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
            name="quote"
            defaultValue={current?.quote ?? ""}
            placeholder="Testimonial quote"
            className="mt-4"
            required
          />
          <Button type="submit" className="mt-4 w-full">
            {current ? "Update testimonial" : "Create testimonial"}
          </Button>
        </form>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow="Published testimonials"
            title="Homepage quote library"
            description="Keep the hero section and testimonial carousel fresh."
            className="mb-6"
          />
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#f8f4e8]">{testimonial.name}</p>
                    <p className="text-sm text-white/55">{testimonial.role ?? "Guest"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/testimonials?edit=${testimonial.id}`}
                      className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70 transition hover:bg-white/12"
                    >
                      Edit
                    </Link>
                    <ConfirmActionDialog
                      triggerLabel="Delete"
                      title="Delete this testimonial?"
                      description={`This will remove the quote from the homepage carousel and testimonial blocks.`}
                      confirmLabel="Delete testimonial"
                      action={deleteTestimonialAction}
                      fields={{ id: testimonial.id }}
                    />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/70">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
