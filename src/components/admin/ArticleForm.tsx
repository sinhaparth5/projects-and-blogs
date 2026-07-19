"use client";

import { ArrowLeft, Eye, ImageUp, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import ArticleBodyField, {
  type ArticleBodyFieldHandle,
} from "@/components/editor/ArticleBodyField";
import { saveArticle } from "@/lib/admin/actions";
import type { ArticleActionState } from "@/lib/admin/article-input";
import styles from "./admin.module.css";

interface ArticleFormValue {
  id: string;
  blog: "pb" | "sb";
  title: string;
  slug: string;
  summary: string;
  seoImageUrl: string | null;
  tags: string[];
  bodyHtml: string;
  status: "DRAFT" | "PUBLISHED";
}

const initialState: ArticleActionState = { error: null };

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ArticleForm({
  article,
}: {
  article?: ArticleFormValue;
}) {
  const [state, formAction, pending] = useActionState(
    saveArticle,
    initialState,
  );
  const editorRef = useRef<ArticleBodyFieldHandle>(null);
  const bodyInput = useRef<HTMLInputElement>(null);
  const seoImageInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [seoImageUrl, setSeoImageUrl] = useState(article?.seoImageUrl ?? "");
  const [uploadingSeoImage, setUploadingSeoImage] = useState(false);
  const [seoImageError, setSeoImageError] = useState<string | null>(null);

  function syncBody() {
    if (bodyInput.current) {
      bodyInput.current.value = editorRef.current?.getHTML() ?? "";
    }
  }

  async function uploadSeoImage(file: File) {
    setUploadingSeoImage(true);
    setSeoImageError(null);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/admin/articles/images/", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !result.url) {
        throw new Error(result.error || "Upload failed");
      }
      setSeoImageUrl(result.url);
    } catch (error) {
      setSeoImageError(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    } finally {
      setUploadingSeoImage(false);
      if (seoImageInput.current) seoImageInput.current.value = "";
    }
  }

  return (
    <form
      action={formAction}
      className={styles.articleForm}
      onSubmit={syncBody}
    >
      {article && <input type="hidden" name="id" value={article.id} />}
      <input
        ref={bodyInput}
        type="hidden"
        name="bodyHtml"
        defaultValue={article?.bodyHtml ?? ""}
      />

      <div className={styles.formHeading}>
        <div>
          <Link href="/admin/" className={styles.backLink}>
            <ArrowLeft aria-hidden="true" size={16} />
            All articles
          </Link>
          <h1>{article ? "Edit article" : "New article"}</h1>
          <p>
            {article
              ? `Currently ${article.status.toLowerCase()}.`
              : "Start with a draft, then publish when ready."}
          </p>
        </div>
        <div className={styles.formActions}>
          <button
            type="submit"
            name="intent"
            value="save"
            className={styles.secondaryAction}
            disabled={pending}
          >
            <Save aria-hidden="true" size={16} />
            {pending ? "Saving…" : "Save"}
          </button>
          {article?.status === "PUBLISHED" ? (
            <button
              type="submit"
              name="intent"
              value="unpublish"
              className={styles.secondaryAction}
              disabled={pending}
            >
              Unpublish
            </button>
          ) : (
            <button
              type="submit"
              name="intent"
              value="publish"
              className={styles.primaryButton}
              disabled={pending}
            >
              <Eye aria-hidden="true" size={16} />
              Publish
            </button>
          )}
        </div>
      </div>

      {state.error && (
        <p className={styles.formError} role="alert">
          {state.error}
        </p>
      )}

      <section
        className={styles.formCard}
        aria-labelledby="article-details-heading"
      >
        <div className={styles.sectionHeading}>
          <h2 id="article-details-heading">Article details</h2>
          <p>Public metadata and ownership.</p>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="blog">Blog</label>
            <select
              id="blog"
              name="blog"
              defaultValue={article?.blog ?? "pb"}
              aria-invalid={Boolean(state.fieldErrors?.blog)}
            >
              <option value="pb">Parth Sinha</option>
              <option value="sb">Shine</option>
            </select>
            {state.fieldErrors?.blog && (
              <p className={styles.fieldError}>{state.fieldErrors.blog}</p>
            )}
          </div>
          <div className={styles.fieldWide}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              required
              maxLength={200}
              value={title}
              aria-invalid={Boolean(state.fieldErrors?.title)}
              onChange={(event) => {
                const value = event.target.value;
                setTitle(value);
                if (!slugTouched) setSlug(slugify(value));
              }}
            />
            {state.fieldErrors?.title && (
              <p className={styles.fieldError}>{state.fieldErrors.title}</p>
            )}
          </div>
          <div className={styles.fieldWide}>
            <label htmlFor="slug">Slug</label>
            <div className={styles.slugField}>
              <span>/blogs/</span>
              <input
                id="slug"
                name="slug"
                required
                maxLength={120}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                value={slug}
                aria-invalid={Boolean(state.fieldErrors?.slug)}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
              />
            </div>
            {state.fieldErrors?.slug && (
              <p className={styles.fieldError}>{state.fieldErrors.slug}</p>
            )}
          </div>
          <div className={styles.fieldFull}>
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              name="summary"
              required
              maxLength={500}
              rows={3}
              defaultValue={article?.summary ?? ""}
              aria-invalid={Boolean(state.fieldErrors?.summary)}
            />
            <p className={styles.hint}>
              Shown on the blog list and in search metadata.
            </p>
            {state.fieldErrors?.summary && (
              <p className={styles.fieldError}>{state.fieldErrors.summary}</p>
            )}
          </div>
          <div className={styles.fieldFull}>
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              name="tags"
              defaultValue={article?.tags.join(", ") ?? ""}
              aria-invalid={Boolean(state.fieldErrors?.tags)}
              placeholder="Next.js, Design systems"
            />
            <p className={styles.hint}>Comma-separated; up to 10 tags.</p>
            {state.fieldErrors?.tags && (
              <p className={styles.fieldError}>{state.fieldErrors.tags}</p>
            )}
          </div>
          <div className={styles.fieldFull}>
            <label htmlFor="seo-image">SEO sharing image</label>
            <input type="hidden" name="seoImageUrl" value={seoImageUrl} />
            <input
              ref={seoImageInput}
              id="seo-image"
              className={styles.hiddenFileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              disabled={uploadingSeoImage}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadSeoImage(file);
              }}
            />
            {seoImageUrl ? (
              <div className={styles.seoImagePreview}>
                <Image
                  src={seoImageUrl}
                  alt="Current SEO sharing preview"
                  width={1200}
                  height={630}
                  unoptimized
                />
                <div>
                  <p>Ready for social sharing</p>
                  <span>{seoImageUrl}</span>
                  <div className={styles.seoImageActions}>
                    <button
                      type="button"
                      className={styles.secondaryAction}
                      disabled={uploadingSeoImage}
                      onClick={() => seoImageInput.current?.click()}
                    >
                      <ImageUp aria-hidden="true" size={16} />
                      {uploadingSeoImage ? "Uploading…" : "Replace image"}
                    </button>
                    <button
                      type="button"
                      className={styles.removeImageButton}
                      disabled={uploadingSeoImage}
                      onClick={() => {
                        setSeoImageUrl("");
                        setSeoImageError(null);
                      }}
                    >
                      <Trash2 aria-hidden="true" size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.seoImageDropzone}
                disabled={uploadingSeoImage}
                onClick={() => seoImageInput.current?.click()}
              >
                <ImageUp aria-hidden="true" size={22} />
                <strong>
                  {uploadingSeoImage ? "Uploading to R2…" : "Upload SEO image"}
                </strong>
                <span>
                  Recommended: 1200 × 630 px · JPEG, PNG, WebP or AVIF
                </span>
              </button>
            )}
            <p className={styles.hint}>
              Used by search previews, Open Graph, and social sharing cards. The
              generated article card is used when no image is uploaded.
            </p>
            {(seoImageError || state.fieldErrors?.seoImageUrl) && (
              <p className={styles.fieldError} role="alert">
                {seoImageError || state.fieldErrors?.seoImageUrl}
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        className={styles.editorSection}
        aria-labelledby="article-body-heading"
      >
        <div className={styles.sectionHeading}>
          <h2 id="article-body-heading">Article body</h2>
          <p>Use headings, images, tables, and references as needed.</p>
        </div>
        <ArticleBodyField
          ref={editorRef}
          initialValue={article?.bodyHtml}
          describedBy={state.fieldErrors?.bodyHtml ? "body-error" : undefined}
        />
        {state.fieldErrors?.bodyHtml && (
          <p id="body-error" className={styles.fieldError}>
            {state.fieldErrors.bodyHtml}
          </p>
        )}
      </section>

      <div className={styles.mobileActions}>
        <button
          type="submit"
          name="intent"
          value="save"
          className={styles.secondaryAction}
          disabled={pending}
        >
          Save draft
        </button>
        <button
          type="submit"
          name="intent"
          value={article?.status === "PUBLISHED" ? "unpublish" : "publish"}
          className={styles.primaryButton}
          disabled={pending}
        >
          {article?.status === "PUBLISHED" ? "Unpublish" : "Publish"}
        </button>
      </div>
    </form>
  );
}
