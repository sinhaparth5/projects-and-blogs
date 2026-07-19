import { ArticleStatus, type Blog } from "@prisma/client";
import { cache } from "react";
import { db } from "@/lib/db";

export const getPublishedArticles = cache((blog: Blog) =>
  db.article.findMany({
    where: { blog, status: ArticleStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      summary: true,
      tags: true,
      publishedAt: true,
      updatedAt: true,
    },
  }),
);

export const getPublishedArticle = cache((blog: Blog, slug: string) =>
  db.article.findFirst({
    where: { blog, slug, status: ArticleStatus.PUBLISHED },
    include: {
      author: { select: { displayName: true } },
    },
  }),
);

export const getPublishedArticleNavigation = cache(
  async (blog: Blog, slug: string) => {
    const articles = await db.article.findMany({
      where: { blog, status: ArticleStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true, summary: true, tags: true },
    });
    const index = articles.findIndex((article) => article.slug === slug);
    if (index < 0) return { newer: null, older: null, related: [] };
    const current = articles[index];
    const related = articles
      .filter(
        (article, articleIndex) =>
          articleIndex !== index &&
          article.tags.some((tag) => current.tags.includes(tag)),
      )
      .slice(0, 3);
    return {
      newer: index > 0 ? articles[index - 1] : null,
      older: index < articles.length - 1 ? articles[index + 1] : null,
      related,
    };
  },
);

export const getAllArticles = cache(() =>
  db.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      author: { select: { displayName: true } },
    },
  }),
);

export const getArticle = cache((id: string) =>
  db.article.findUnique({
    where: { id },
    include: {
      author: { select: { displayName: true } },
    },
  }),
);
