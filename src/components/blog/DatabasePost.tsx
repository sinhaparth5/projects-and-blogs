import type { Blog } from "@prisma/client";
import { getPublishedArticle } from "@/lib/articles/queries";
import styles from "./blog.module.css";
import { blogSites } from "./data/site";
import PostShell from "./PostShell";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function DatabasePost({
  blog,
  slug,
}: {
  blog: Blog;
  slug: string;
}) {
  const article = await getPublishedArticle(blog, slug);

  if (!article) {
    return null;
  }

  return (
    <PostShell data={blogSites[blog]}>
      <h1>{article.title}</h1>
      <p className={styles.byline}>
        {article.publishedAt
          ? dateFormat.format(article.publishedAt)
          : "Unpublished"}{" "}
        · {article.author.displayName}
      </p>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Seed HTML is trusted; admin HTML will be sanitized before persistence. */}
      <div dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
    </PostShell>
  );
}
