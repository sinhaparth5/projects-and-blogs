import { Blog } from "@prisma/client";
import { getPublishedArticle } from "@/lib/articles/queries";
import { createSocialImage, socialImageSize } from "@/lib/seo-image";

export const alt = "Article from Shine's Blog";
export const size = socialImageSize;
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublishedArticle(Blog.sb, slug);
  return createSocialImage({
    eyebrow: "Shine's Blog",
    title: article?.title ?? "Design Notes",
    description: article?.summary,
  });
}
