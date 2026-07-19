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
