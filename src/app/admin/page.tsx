import styles from "@/components/admin/admin.module.css";
import { logoutAction } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main className={styles.page}>
      <section className={styles.adminHome}>
        <header className={styles.adminHeader}>
          <div>
            <p className={styles.eyebrow}>Projects &amp; Blogs</p>
            <h1>Articles</h1>
          </div>
          <form action={logoutAction}>
            <button type="submit" className={styles.logout}>
              Log out
            </button>
          </form>
        </header>
        <p className={styles.intro}>
          Article management arrives in the next phase.
        </p>
      </section>
    </main>
  );
}
