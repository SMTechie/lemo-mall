import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";

type GalleryCardProps = {
  image: {
    slug: string;
    title: string;
    description: string | null;
    imageUrl: string;
    downloadUrl: string | null;
    altText: string | null;
  };
};

export function GalleryCard({ image }: GalleryCardProps) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-white/10 bg-white/6 backdrop-blur transition duration-300 hover:-translate-y-1 animate-fade-up motion-reduce:animate-none">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={image.imageUrl}
          alt={image.altText ?? image.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050913] via-transparent to-transparent" />
      </div>
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <h3 className="font-semibold text-[#f8f4e8]">{image.title}</h3>
          {image.description ? <p className="text-sm text-white/65">{image.description}</p> : null}
        </div>
        {image.downloadUrl ? (
          <Link
            href={image.downloadUrl}
            download
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ffff00] text-[#0b0b0b] shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition hover:brightness-95"
          >
            <Download className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
