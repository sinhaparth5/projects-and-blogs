"use server";

import { ArticleStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  type ArticleActionState,
  type ArticleInput,
  parseArticleInput,
} from "./article-input";

function publicPath(blog: ArticleInput["blog"], slug?: string) {
  return slug ? `/${blog}/blogs/${slug}/` : `/${blog}/blogs/`;
}

function refreshArticlePaths(
  blog: ArticleInput["blog"],
  slug: string,
  previousSlug?: string,
) {
  revalidatePath("/admin/");
  revalidatePath(publicPath(blog));
  revalidatePath(publicPath(blog, slug));

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(publicPath(blog, previousSlug));
  }
}

export async function saveArticle(
  _previousState: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  await requireAdmin();

  const parsed = parseArticleInput(formData);
  if (!parsed.success) {
    return parsed.state;
  }

  const input = parsed.data;
  const existing = input.id
    ? await db.article.findUnique({ where: { id: input.id } })
    : null;

  if (input.id && !existing) {
    return { error: "This article no longer exists." };
  }

  const author = await db.user.findUnique({
    where: { username: input.blog === "pb" ? "parth" : "shine" },
    select: { id: true },
  });

  if (!author) {
    console.error(`Missing seeded author for blog ${input.blog}`);
    return { error: "The selected blog is not configured." };
  }

  const status =
    input.intent === "publish"
      ? ArticleStatus.PUBLISHED
      : input.intent === "unpublish"
        ? ArticleStatus.DRAFT
        : (existing?.status ?? ArticleStatus.DRAFT);
  const publishedAt =
    status === ArticleStatus.PUBLISHED
      ? (existing?.publishedAt ?? new Date())
      : null;
  const data = {
    blog: input.blog,
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    seoImageUrl: input.seoImageUrl || null,
    tags: input.tags,
    bodyHtml: input.bodyHtml,
    authorId: author.id,
    status,
    publishedAt,
  };

  try {
    if (existing) {
      await db.article.update({ where: { id: existing.id }, data });
    } else {
      await db.article.create({ data });
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        error: "Check the highlighted fields.",
        fieldErrors: { slug: "That slug is already used by this blog." },
      };
    }
    console.error("Unable to save article", error);
    return { error: "Unable to save the article. Try again." };
  }

  if (existing && existing.blog !== input.blog) {
    refreshArticlePaths(existing.blog, existing.slug);
  }
  refreshArticlePaths(input.blog, input.slug, existing?.slug);
  redirect("/admin/");
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return;
  }

  try {
    const article = await db.article.delete({
      where: { id },
      select: { blog: true, slug: true },
    });
    refreshArticlePaths(article.blog, article.slug);
  } catch (error) {
    if (
      !(
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
    ) {
      console.error("Unable to delete article", error);
    }
  }

  redirect("/admin/");
}
