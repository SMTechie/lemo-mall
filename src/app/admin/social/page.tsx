import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { syncSocialPostsAction } from "@/actions/admin";
import { getAdminSocialPosts } from "@/lib/site-data";
import { formatDateTime } from "@/lib/utils";

export const metadata = {
  title: "Manage social",
  description: "Sync Facebook posts into the news feed.",
};

export default async function AdminSocialPage() {
  const posts = await getAdminSocialPosts();

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Social sync</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f8f4e8]">Facebook to news pipeline</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Run a sync when you want the news feed to refresh. Without API credentials, the action
          falls back to seeded demo posts.
        </p>
        <form action={syncSocialPostsAction} className="mt-6">
          <input type="hidden" name="source" value="FACEBOOK" />
          <Button type="submit">Sync Facebook posts</Button>
        </form>
      </section>

      <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
        <SectionHeading
          eyebrow="Latest posts"
          title="Synced content"
          description="These entries power the public news page."
          className="mb-6"
        />
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-[#f8f4e8]">{post.authorName ?? "Lemo Fest"}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#ffcc66]">
                    {post.source}
                  </p>
                </div>
                <p className="text-xs text-white/45">{formatDateTime(post.publishedAt)}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/70">{post.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

