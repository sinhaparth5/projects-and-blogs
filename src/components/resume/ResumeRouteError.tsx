"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "@/app/state.module.css";

export default function ResumeRouteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.statePage}>
      <div className={styles.stateCard}>
        <p className={styles.eyebrow}>Resume unavailable</p>
        <h1>The latest writing couldn’t be loaded.</h1>
        <p>
          The database connection may be temporarily unavailable. Try again to
          reload the resume and recent articles.
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={unstable_retry}>
            Try again
          </button>
          <Link href="/">Return home</Link>
        </div>
      </div>
    </main>
  );
}
