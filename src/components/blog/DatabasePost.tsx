import type { Blog } from "@prisma/client";
import { transformArticleHtml } from "@/lib/articles/html-transform";
import {
  getPublishedArticle,
  getPublishedArticleNavigation,
} from "@/lib/articles/queries";
import { absoluteUrl, articlePath, authorPath } from "@/lib/seo";
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
  const [article, navigation] = await Promise.all([
    getPublishedArticle(blog, slug),
    getPublishedArticleNavigation(blog, slug),
  ]);

  if (!article) {
    return null;
  }

  const renderedArticle = transformArticleHtml(article.bodyHtml);
  const wordCount = renderedArticle.html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const path = articlePath(blog, slug);
  const seoImage = article.seoImageUrl || absoluteUrl(`${path}opengraph-image`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${absoluteUrl(path)}#article`,
        headline: article.title,
        description: article.summary,
        datePublished: article.publishedAt?.toISOString(),
        dateModified: article.updatedAt.toISOString(),
        image: seoImage,
        mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
        author: {
          "@type": "Person",
          name: article.author.displayName,
          url: absoluteUrl(authorPath(blog)),
        },
        publisher: {
          "@type": "Person",
          name: article.author.displayName,
          url: absoluteUrl(authorPath(blog)),
        },
        keywords: article.tags.join(", "),
        articleSection: article.tags[0] || "Technology",
        inLanguage: "en-GB",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: blogSites[blog].title,
            item: absoluteUrl(blogSites[blog].blogHref),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: absoluteUrl(path),
          },
        ],
      },
    ],
  };

  return (
    <PostShell data={blogSites[blog]}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is generated from sanitized database fields and escaped.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ArticleWorkspace
        headings={renderedArticle.headings}
        storageKey={`reader-notes:${blog}:${slug}`}
      >
        <h1>{article.title}</h1>
        <p className={styles.byline}>
          {article.publishedAt ? (
            <time dateTime={article.publishedAt.toISOString()}>
              {dateFormat.format(article.publishedAt)}
            </time>
          ) : (
            "Unpublished"
          )}{" "}
          · {article.author.displayName}
          {article.publishedAt &&
            article.updatedAt.getTime() - article.publishedAt.getTime() >
              86_400_000 && (
              <>
                <span aria-hidden="true"> · </span>
                Updated{" "}
                <time dateTime={article.updatedAt.toISOString()}>
                  {dateFormat.format(article.updatedAt)}
                </time>
              </>
            )}
          <span aria-hidden="true"> · </span>
          {readingMinutes} min read
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
        {(navigation.newer || navigation.older) && (
          <nav className={styles.articleNavigation} aria-label="More articles">
            {navigation.newer ? (
              <a href={articlePath(blog, navigation.newer.slug)}>
                <span>Newer article</span>
                <strong>{navigation.newer.title}</strong>
              </a>
            ) : (
              <span />
            )}
            {navigation.older && (
              <a href={articlePath(blog, navigation.older.slug)}>
                <span>Older article</span>
                <strong>{navigation.older.title}</strong>
              </a>
            )}
          </nav>
        )}
        {navigation.related.length > 0 && (
          <section
            className={styles.relatedArticles}
            aria-labelledby="related-heading"
          >
            <h2 id="related-heading">Related reading</h2>
            <div>
              {navigation.related.map((related) => (
                <a key={related.slug} href={articlePath(blog, related.slug)}>
                  <strong>{related.title}</strong>
                  <span>{related.summary}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </ArticleWorkspace>
    </PostShell>
  );
}
