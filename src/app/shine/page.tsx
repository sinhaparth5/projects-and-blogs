import { Blog } from "@prisma/client";
import type { Metadata } from "next";
import { shine } from "@/components/resume/data/shine";
import Resume from "@/components/resume/Resume";
import { getPublishedArticles } from "@/lib/articles/queries";

export const metadata: Metadata = {
  title: "Shine - Creative Developer",
  description:
    "Creative developer crafting delightful, accessible web experiences with a focus on design systems and polished interfaces.",
  alternates: {
    canonical: "/shine/",
    types: { "application/rss+xml": "/sb/blogs/feed.xml" },
  },
  authors: [{ name: "Shine", url: "/shine/" }],
  openGraph: {
    type: "profile",
    url: "/shine/",
    title: "Shine - Creative Developer",
    description:
      "Creative developer crafting delightful, accessible web experiences with a focus on design systems and polished interfaces.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shine - Creative Developer",
    description:
      "Creative developer crafting delightful, accessible web experiences with a focus on design systems and polished interfaces.",
  },
};

export default async function ShinePage() {
  const publishedArticles = await getPublishedArticles(Blog.sb);
  const recentPosts = publishedArticles.slice(0, 3).map((article) => ({
    title: article.title,
    summary: article.summary,
    date: article.publishedAt?.toISOString() ?? article.updatedAt.toISOString(),
    href: `/sb/blogs/${article.slug}/`,
    tags: article.tags,
  }));
  const lastUpdated =
    publishedArticles[0]?.updatedAt.toISOString() ?? "2026-07-19T00:00:00.000Z";

  return (
    <Resume
      data={shine}
      recentPosts={recentPosts}
      blogHref="/sb/blogs/"
      feedHref="/sb/blogs/feed.xml"
      lastUpdated={lastUpdated}
    />
  );
}
