import { Blog } from "@prisma/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DatabasePost } from "@/components/blog/DatabasePost";
import { getPublishedArticle } from "@/lib/articles/queries";
import { absoluteUrl, articlePath } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(Blog.pb, slug);

  if (!article) return { title: "Post not found", robots: { index: false } };
  const path = articlePath("pb", article.slug);
  return {
    title: article.title,
    description: article.summary,
    keywords: article.tags,
    authors: [{ name: article.author.displayName, url: "/parth/" }],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "en_GB",
      url: path,
      siteName: "Parth's Blog",
      title: article.title,
      description: article.summary,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [absoluteUrl("/parth/")],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@sinhaparth555",
      title: article.title,
      description: article.summary,
    },
  };
}

export default async function ParthPostPage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticle(Blog.pb, slug);

  if (!article) {
    notFound();
  }

  return <DatabasePost blog={Blog.pb} slug={slug} />;
}
