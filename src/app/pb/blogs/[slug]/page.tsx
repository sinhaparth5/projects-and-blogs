import { Blog } from "@prisma/client";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DatabasePost } from "@/components/blog/DatabasePost";
import { getPublishedArticle } from "@/lib/articles/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(Blog.pb, slug);

  return article
    ? { title: `${article.title} - Parth Sinha`, description: article.summary }
    : { title: "Post not found - Parth Sinha" };
}

export default async function ParthPostPage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticle(Blog.pb, slug);

  if (!article) {
    notFound();
  }

  return <DatabasePost blog={Blog.pb} slug={slug} />;
}
