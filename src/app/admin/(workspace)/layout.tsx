import { LogOut } from "lucide-react";
import Link from "next/link";
import styles from "@/components/admin/admin.module.css";
import { logoutAction } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className={styles.workspace}>
      <header className={styles.workspaceHeader}>
        <Link href="/admin/" className={styles.brand}>
          <span>Projects &amp; Blogs</span>
          <strong>Admin</strong>
        </Link>
        <form action={logoutAction}>
          <button type="submit" className={styles.headerAction}>
            <LogOut aria-hidden="true" size={16} />
            Log out
          </button>
        </form>
      </header>
      {children}
    </div>
  );
}
