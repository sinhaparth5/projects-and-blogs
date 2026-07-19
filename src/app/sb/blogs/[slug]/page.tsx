import { Blog } from "@prisma/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DatabasePost } from "@/components/blog/DatabasePost";
import { getPublishedArticle } from "@/lib/articles/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(Blog.sb, slug);

  return article
    ? { title: `${article.title} - Shine`, description: article.summary }
    : { title: "Post not found - Shine" };
}

export default async function ShinePostPage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticle(Blog.sb, slug);

  if (!article) {
    notFound();
  }

  return <DatabasePost blog={Blog.sb} slug={slug} />;
}
