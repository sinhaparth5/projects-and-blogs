import { Blog } from "@prisma/client";
import type { Metadata } from "next";
import BlogList from "@/components/blog/BlogList";
import { blogSites } from "@/components/blog/data/site";
import { getPublishedArticles } from "@/lib/articles/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design & Interface Blog by Shine",
  description:
    "Blog posts by Shine on design systems, typography, and interface craft.",
  keywords: [
    "design systems",
    "interface design",
    "typography",
    "frontend development",
    "accessibility",
  ],
  alternates: {
    canonical: "/sb/blogs/",
    types: { "application/rss+xml": "/sb/blogs/feed.xml" },
  },
  openGraph: {
    type: "website",
    url: "/sb/blogs/",
    siteName: "Shine's Blog",
    title: "Design & Interface Blog by Shine",
    description:
      "Writing on design systems, typography, accessibility, and polished interface craft.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design & Interface Blog by Shine",
    description:
      "Writing on design systems, typography, accessibility, and polished interface craft.",
  },
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
