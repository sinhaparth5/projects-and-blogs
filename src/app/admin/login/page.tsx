import { redirect } from "next/navigation";
import styles from "@/components/admin/admin.module.css";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/auth/session";

export default async function AdminLoginPage() {
  if (await isAdmin()) {
    redirect("/admin/");
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="login-title">
        <p className={styles.eyebrow}>Projects &amp; Blogs</p>
        <h1 id="login-title">Admin sign in</h1>
        <p className={styles.intro}>
          Use the shared admin password to manage articles.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
