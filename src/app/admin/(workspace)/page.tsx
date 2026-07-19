import { FilePlus2 } from "lucide-react";
import Link from "next/link";
import ArticleRowActions from "@/components/admin/ArticleRowActions";
import styles from "@/components/admin/admin.module.css";
import { getAllArticles } from "@/lib/articles/queries";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <main className={styles.adminMain}>
      <div className={styles.pageHeading}>
        <div>
          <p className={styles.eyebrow}>Content</p>
          <h1>Articles</h1>
          <p className={styles.intro}>
            Draft, publish, and maintain both blogs.
          </p>
        </div>
        <Link href="/admin/articles/new/" className={styles.primaryAction}>
          <FilePlus2 aria-hidden="true" size={17} />
          New article
        </Link>
      </div>

      {articles.length === 0 ? (
        <section className={styles.emptyState}>
          <h2>No articles yet</h2>
          <p>Create the first draft for Parth or Shine.</p>
        </section>
      ) : (
        <div className={styles.articleList}>
          <div className={styles.listHeader} aria-hidden="true">
            <span>Article</span>
            <span>Blog</span>
            <span>Status</span>
            <span>Updated</span>
            <span>Actions</span>
          </div>
          {articles.map((article) => (
            <article className={styles.articleRow} key={article.id}>
              <div className={styles.articleIdentity}>
                <h2>
                  <Link href={`/admin/articles/${article.id}/edit/`}>
                    {article.title}
                  </Link>
                </h2>
                <p>
                  /{article.blog}/blogs/{article.slug}/
                </p>
              </div>
              <span className={styles.mobileLabel}>Blog</span>
              <span className={styles.blogChip}>
                {article.author.displayName}
              </span>
              <span className={styles.mobileLabel}>Status</span>
              <span
                className={`${styles.statusChip} ${article.status === "PUBLISHED" ? styles.published : ""}`}
              >
                {article.status === "PUBLISHED" ? "Published" : "Draft"}
              </span>
              <span className={styles.mobileLabel}>Updated</span>
              <time
                dateTime={article.updatedAt.toISOString()}
                className={styles.dateCell}
              >
                {dateFormat.format(article.updatedAt)}
              </time>
              <ArticleRowActions
                id={article.id}
                editHref={`/admin/articles/${article.id}/edit/`}
                title={article.title}
              />
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
