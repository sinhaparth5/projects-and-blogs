import { Blog } from "@prisma/client";
import type { Metadata } from "next";
import BlogList from "@/components/blog/BlogList";
import { blogSites } from "@/components/blog/data/site";
import { getPublishedArticles } from "@/lib/articles/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Blog",
  description:
    "Blog posts by Parth Sinha on full-stack engineering, web performance, and tooling.",
  keywords: [
    "software engineering blog",
    "full-stack development",
    "React",
    "Next.js",
    "TypeScript",
    "web performance",
  ],
  alternates: {
    canonical: "/pb/blogs/",
    types: { "application/rss+xml": "/pb/blogs/feed.xml" },
  },
  openGraph: {
    type: "website",
    url: "/pb/blogs/",
    siteName: "Parth's Blog",
    title: "Engineering Blog by Parth Sinha",
    description:
      "Practical writing on full-stack engineering, web performance, architecture, and developer tooling.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@sinhaparth555",
    title: "Engineering Blog by Parth Sinha",
    description:
      "Practical writing on full-stack engineering, web performance, architecture, and developer tooling.",
  },
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
