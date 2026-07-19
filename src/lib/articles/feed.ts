import type { Blog } from "@prisma/client";
import { blogSites } from "@/components/blog/data/site";
import { absoluteUrl, articlePath } from "@/lib/seo";
import { getPublishedArticles } from "./queries";

function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function createArticleFeed(blog: Blog) {
  const site = blogSites[blog];
  const articles = await getPublishedArticles(blog);
  const items = articles
    .map((article) => {
      const url = absoluteUrl(articlePath(blog, article.slug));
      const date = article.publishedAt ?? article.updatedAt;
      return `<item>
        <title>${xml(article.title)}</title>
        <link>${xml(url)}</link>
        <guid isPermaLink="true">${xml(url)}</guid>
        <pubDate>${date.toUTCString()}</pubDate>
        <description>${xml(article.summary)}</description>
        ${article.tags.map((tag) => `<category>${xml(tag)}</category>`).join("\n")}
      </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${xml(site.title)}</title>
      <link>${xml(absoluteUrl(site.blogHref))}</link>
      <description>${xml(site.description)}</description>
      <language>en-gb</language>
      <atom:link href="${xml(absoluteUrl(`${site.blogHref}feed.xml`))}" rel="self" type="application/rss+xml" />
      ${items}
    </channel>
  </rss>`;
}

export const feedHeaders = {
  "Content-Type": "application/rss+xml; charset=utf-8",
  "Cache-Control":
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
};
