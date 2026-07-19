import { Blog } from "@prisma/client";
import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles/queries";
import { absoluteUrl, articlePath } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [parthArticles, shineArticles] = await Promise.all([
    getPublishedArticles(Blog.pb),
    getPublishedArticles(Blog.sb),
  ]);
  const staticPages: MetadataRoute.Sitemap = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/parth/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/shine/", priority: 0.8, changeFrequency: "monthly" },
    { path: "/pb/blogs/", priority: 0.9, changeFrequency: "weekly" },
    { path: "/sb/blogs/", priority: 0.8, changeFrequency: "weekly" },
  ].map(({ path, ...entry }) => ({
    url: absoluteUrl(path),
    ...entry,
    changeFrequency: entry.changeFrequency as "weekly" | "monthly" | "yearly",
  }));
  const articles = [
    ...parthArticles.map((article) => ({ blog: "pb" as const, article })),
    ...shineArticles.map((article) => ({ blog: "sb" as const, article })),
  ].map(({ blog, article }) => ({
    url: absoluteUrl(articlePath(blog, article.slug)),
    lastModified: article.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articles];
}
