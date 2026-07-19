"use client";

import { Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { deleteArticle } from "@/lib/admin/actions";
import styles from "./admin.module.css";

export default function ArticleRowActions({
  id,
  editHref,
  title,
}: {
  id: string;
  editHref: string;
  title: string;
}) {
  const deleteDialog = useRef<HTMLDialogElement>(null);

  return (
    <div className={styles.rowActions}>
      <Link
        href={editHref}
        className={styles.rowAction}
        aria-label={`Edit ${title}`}
        title="Edit article"
      >
        <Pencil aria-hidden="true" size={16} />
      </Link>
      <button
        type="button"
        className={styles.deleteAction}
        aria-label={`Delete ${title}`}
        title="Delete article"
        onClick={() => deleteDialog.current?.showModal()}
      >
        <Trash2 aria-hidden="true" size={16} />
      </button>
      <dialog
        ref={deleteDialog}
        className={styles.deleteDialog}
        aria-labelledby={`delete-title-${id}`}
      >
        <div className={styles.deleteDialogPanel}>
          <div className={styles.deleteDialogHeader}>
            <div>
              <p>Delete article</p>
              <h2 id={`delete-title-${id}`}>{title}</h2>
            </div>
            <button
              type="button"
              aria-label="Close delete dialog"
              onClick={() => deleteDialog.current?.close()}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>
          <p className={styles.deleteDialogCopy}>
            This permanently removes the article and cannot be undone.
          </p>
          <form action={deleteArticle} className={styles.deleteDialogActions}>
            <input type="hidden" name="id" value={id} />
            <button type="button" onClick={() => deleteDialog.current?.close()}>
              Cancel
            </button>
            <button type="submit">Delete article</button>
          </form>
        </div>
      </dialog>
    </div>
  );
}
