import { Blog } from "@prisma/client";
import type { Metadata } from "next";
import BlogList from "@/components/blog/BlogList";
import { blogSites } from "@/components/blog/data/site";
import { getPublishedArticles } from "@/lib/articles/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs - Shine",
  description:
    "Blog posts by Shine on design systems, typography, and interface craft.",
};

export default async function ShineBlogsPage() {
  const articles = await getPublishedArticles(Blog.sb);

  return (
    <BlogList
      data={{
        ...blogSites.sb,
        posts: articles.map((article) => ({
          title: article.title,
          date: article.publishedAt?.toISOString() ?? "",
          summary: article.summary,
          tags: article.tags,
          href: `/sb/blogs/${article.slug}/`,
        })),
      }}
    />
  );
}
