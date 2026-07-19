import { Blog } from "@prisma/client";
import type { Metadata } from "next";
import BlogList from "@/components/blog/BlogList";
import { blogSites } from "@/components/blog/data/site";
import { getPublishedArticles } from "@/lib/articles/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs - Parth Sinha",
  description:
    "Blog posts by Parth Sinha on full-stack engineering, web performance, and tooling.",
};

export default async function ParthBlogsPage() {
  const articles = await getPublishedArticles(Blog.pb);

  return (
    <BlogList
      data={{
        ...blogSites.pb,
        posts: articles.map((article) => ({
          title: article.title,
          date: article.publishedAt?.toISOString() ?? "",
          summary: article.summary,
          tags: article.tags,
          href: `/pb/blogs/${article.slug}/`,
        })),
      }}
    />
  );
}
