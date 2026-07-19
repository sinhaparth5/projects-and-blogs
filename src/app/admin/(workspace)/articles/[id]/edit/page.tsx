import { notFound } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import styles from "@/components/admin/admin.module.css";
import { getArticle } from "@/lib/articles/queries";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  return (
    <main className={styles.adminMain}>
      <ArticleForm
        article={{
          id: article.id,
          blog: article.blog,
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          tags: article.tags,
          bodyHtml: article.bodyHtml,
          status: article.status,
        }}
      />
    </main>
  );
}
