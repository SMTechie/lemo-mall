import Image from "next/image";
import { Quote } from "lucide-react";

type TestimonialCardProps = {
  testimonial: {
    name: string;
    role: string | null;
    quote: string;
    avatarUrl: string | null;
    rating: number;
  };
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="rounded-[24px] border border-white/10 bg-white/6 p-6 backdrop-blur animate-fade-up motion-reduce:animate-none">
      <Quote className="h-6 w-6 text-[#ffff00]" />
      <p className="mt-4 text-sm leading-7 text-white/75">{testimonial.quote}</p>
      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#111111]">
          {testimonial.avatarUrl ? (
            <Image
              src={testimonial.avatarUrl}
              alt={testimonial.name}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-white">{initials}</span>
          )}
        </div>
        <div>
          <p className="font-medium text-white">{testimonial.name}</p>
          <p className="text-sm text-white/55">{testimonial.role ?? "Guest"}</p>
        </div>
      </div>
    </article>
  );
}
