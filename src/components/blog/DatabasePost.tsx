import type { Blog } from "@prisma/client";
import { transformArticleHtml } from "@/lib/articles/html-transform";
import { getPublishedArticle } from "@/lib/articles/queries";
import ArticleWorkspace from "./ArticleWorkspace";
import styles from "./blog.module.css";
import { blogSites } from "./data/site";
import PostShell from "./PostShell";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function ReferenceText({ label, url }: { label: string; url: string }) {
  if (!url) return <span className={styles.referenceText}>{label}</span>;

  const urlStart = label.indexOf(url);
  const beforeUrl = urlStart >= 0 ? label.slice(0, urlStart) : `${label} `;
  const afterUrl = urlStart >= 0 ? label.slice(urlStart + url.length) : "";

  return (
    <span className={styles.referenceText}>
      {beforeUrl}
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
      {afterUrl}
    </span>
  );
}

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

  const renderedArticle = transformArticleHtml(article.bodyHtml);

  return (
    <PostShell data={blogSites[blog]}>
      <ArticleWorkspace
        headings={renderedArticle.headings}
        storageKey={`reader-notes:${blog}:${slug}`}
      >
        <h1>{article.title}</h1>
        <p className={styles.byline}>
          {article.publishedAt
            ? dateFormat.format(article.publishedAt)
            : "Unpublished"}{" "}
          · {article.author.displayName}
        </p>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Admin HTML is sanitized before persistence. */}
        <div dangerouslySetInnerHTML={{ __html: renderedArticle.html }} />
        {renderedArticle.references.length > 0 && (
          <section
            className={styles.references}
            aria-labelledby="references-heading"
          >
            <h2 id="references-heading">References</h2>
            <ol className={styles.referenceList}>
              {renderedArticle.references.map((reference) => (
                <li key={reference.id} id={`ref-${reference.id}`}>
                  <span className={styles.referenceIndex}>{reference.id}</span>
                  <ReferenceText
                    label={reference.label || reference.url}
                    url={reference.url}
                  />
                </li>
              ))}
            </ol>
          </section>
        )}
      </ArticleWorkspace>
    </PostShell>
  );
}
