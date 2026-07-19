"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./state.module.css";

export default function ErrorPage({
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
        <p className={styles.eyebrow}>Temporary problem</p>
        <h1>We couldn’t load this page.</h1>
        <p>
          The connection may have been interrupted. Try loading the page again,
          or return home if the problem continues.
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
