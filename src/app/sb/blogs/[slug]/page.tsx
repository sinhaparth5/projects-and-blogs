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
  const article = await getPublishedArticle(Blog.sb, slug);

  if (!article) return { title: "Post not found", robots: { index: false } };
  const path = articlePath("sb", article.slug);
  const seoImage = article.seoImageUrl || absoluteUrl(`${path}opengraph-image`);
  return {
    title: article.title,
    description: article.summary,
    keywords: article.tags,
    authors: [{ name: article.author.displayName, url: "/shine/" }],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "en_GB",
      url: path,
      siteName: "Shine's Blog",
      title: article.title,
      description: article.summary,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [absoluteUrl("/shine/")],
      tags: article.tags,
      images: [{ url: seoImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [seoImage],
    },
  };
}

export default async function ShinePostPage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticle(Blog.sb, slug);

  if (!article) {
    notFound();
  }

  return <DatabasePost blog={Blog.sb} slug={slug} />;
}
