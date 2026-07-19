import ArticleForm from "@/components/admin/ArticleForm";
import styles from "@/components/admin/admin.module.css";

export default function NewArticlePage() {
  return (
    <main className={styles.adminMain}>
      <ArticleForm />
    </main>
  );
}
