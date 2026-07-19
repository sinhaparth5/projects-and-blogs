import { Blog } from "@prisma/client";
import { sanitizeArticleHtml } from "@/lib/articles/sanitize";

export const articleIntents = ["save", "publish", "unpublish"] as const;
export type ArticleIntent = (typeof articleIntents)[number];

export interface ArticleInput {
  id?: string;
  blog: Blog;
  title: string;
  slug: string;
  summary: string;
  seoImageUrl: string;
  tags: string[];
  bodyHtml: string;
  intent: ArticleIntent;
}

export interface ArticleActionState {
  error: string | null;
  fieldErrors?: Partial<
    Record<
      | "blog"
      | "title"
      | "slug"
      | "summary"
      | "seoImageUrl"
      | "tags"
      | "bodyHtml",
      string
    >
  >;
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function parseArticleInput(
  formData: FormData,
):
  | { success: true; data: ArticleInput }
  | { success: false; state: ArticleActionState } {
  const id = text(formData, "id") || undefined;
  const blogValue = text(formData, "blog");
  const title = text(formData, "title");
  const slug = text(formData, "slug");
  const summary = text(formData, "summary");
  const seoImageUrl = text(formData, "seoImageUrl");
  const tagValue = text(formData, "tags");
  const rawBodyHtml = text(formData, "bodyHtml");
  const intentValue = text(formData, "intent");
  const fieldErrors: NonNullable<ArticleActionState["fieldErrors"]> = {};

  if (blogValue !== Blog.pb && blogValue !== Blog.sb) {
    fieldErrors.blog = "Choose a blog.";
  }
  if (!title || title.length > 200) {
    fieldErrors.title = "Enter a title of no more than 200 characters.";
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) {
    fieldErrors.slug =
      "Use up to 120 lowercase letters, numbers, and single hyphens.";
  }
  if (!summary || summary.length > 500) {
    fieldErrors.summary = "Enter a summary of no more than 500 characters.";
  }
  if (seoImageUrl) {
    try {
      const url = new URL(seoImageUrl);
      if (
        (url.protocol !== "https:" && url.protocol !== "http:") ||
        seoImageUrl.length > 2_048
      ) {
        throw new Error("Unsupported SEO image URL");
      }
    } catch {
      fieldErrors.seoImageUrl = "Upload an image with a valid public URL.";
    }
  }

  const tags = [
    ...new Set(
      tagValue
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
  if (tags.length > 10 || tags.some((tag) => tag.length > 40)) {
    fieldErrors.tags = "Use no more than 10 tags, with 40 characters per tag.";
  }

  if (!rawBodyHtml || rawBodyHtml.length > 1_000_000) {
    fieldErrors.bodyHtml = "Add article content no larger than 1 MB.";
  } else {
    const sanitizedBody = sanitizeArticleHtml(rawBodyHtml);
    const plainBody = sanitizedBody
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
    if (!plainBody) {
      fieldErrors.bodyHtml = "Add article content.";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: { error: "Check the highlighted fields.", fieldErrors },
    };
  }

  const bodyHtml = sanitizeArticleHtml(rawBodyHtml);
  const intent = articleIntents.includes(intentValue as ArticleIntent)
    ? (intentValue as ArticleIntent)
    : "save";

  return {
    success: true,
    data: {
      id,
      blog: blogValue as Blog,
      title,
      slug,
      summary,
      seoImageUrl,
      tags,
      bodyHtml,
      intent,
    },
  };
}
