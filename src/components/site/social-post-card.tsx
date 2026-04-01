import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatDateOnly } from "@/lib/utils";

type SocialPostCardProps = {
  post: {
    message: string;
    link: string | null;
    imageUrl: string | null;
    authorName: string | null;
    publishedAt: Date;
    featured?: boolean;
  };
};

export function SocialPostCard({ post }: SocialPostCardProps) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-white/10 bg-white/6 backdrop-blur animate-fade-up motion-reduce:animate-none">
      {post.imageUrl ? (
        <div className="relative aspect-[16/10]">
          <Image src={post.imageUrl} alt={post.authorName ?? "Social post"} fill className="object-cover" />
        </div>
      ) : null}
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-[#ffcc66]">{post.authorName ?? "Lemo Fest"}</p>
          <span className="text-xs uppercase tracking-[0.2em] text-white/45">
            {formatDateOnly(post.publishedAt)}
          </span>
        </div>
        <p className="text-sm leading-7 text-white/72">{post.message}</p>
        {post.link ? (
          <Link
            href={post.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#91e4ff] transition hover:text-[#f8f4e8]"
          >
            Open post <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
