import type { Metadata } from "next";
import Link from "next/link";
import styles from "./state.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className={styles.statePage}>
      <div className={styles.stateCard}>
        <p className={styles.eyebrow}>404</p>
        <h1>This page doesn’t exist.</h1>
        <p>
          The address may have changed, or the page may have been removed. You
          can return home or continue with the engineering blog.
        </p>
        <div className={styles.actions}>
          <Link href="/">Return home</Link>
          <Link href="/pb/blogs/">Read the blog</Link>
        </div>
      </div>
    </main>
  );
}
