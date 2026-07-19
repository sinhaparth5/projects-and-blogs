"use client";

import { Printer, Rss } from "lucide-react";
import styles from "./resume.module.css";

export default function ResumeActions({ feedHref }: { feedHref: string }) {
  return (
    <div className={styles.resumeActions}>
      <button type="button" onClick={() => window.print()}>
        <Printer aria-hidden="true" size={15} /> Save as PDF
      </button>
      <a href={feedHref}>
        <Rss aria-hidden="true" size={15} /> RSS feed
      </a>
    </div>
  );
}
