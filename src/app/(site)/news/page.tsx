import Link from "next/link";
import { BackdropPanel } from "@/components/site/backdrop-panel";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SocialPostCard } from "@/components/site/social-post-card";
import { getFeaturedSocialPosts } from "@/lib/site-data";

export const metadata = {
  title: "News",
  description: "Facebook-synced social posts and blog-style updates from the Lemo Fest team.",
};

export default async function NewsPage() {
  const posts = await getFeaturedSocialPosts();

  return (
    <div className="py-16">
      <Container>
        <BackdropPanel image="/lemofest/blog2.jpg" alt="Lemo Fest social post crowd" contentClassName="p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">News & social</p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[#f8f4e8] sm:text-5xl">
            Updates from the team and the crowd.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            In production this can sync from Facebook; in development it falls back to the demo
            posts so the page still looks alive.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/social"
              className="inline-flex h-11 items-center rounded-full bg-[#ffff00] px-5 text-sm font-semibold text-[#0b0b0b]"
            >
              Manage social sync
            </Link>
          </div>
        </BackdropPanel>
      </Container>

      <section className="mt-14">
        <Container>
          <SectionHeading
            eyebrow="Feed"
            title="Live-looking social updates"
            description="Use these cards as blog entries, Facebook teasers, or launch posts when you have real news."
          />
          <div className="grid gap-6 lg:grid-cols-4">
            {posts.map((post) => (
              <SocialPostCard key={post.id} post={post} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
