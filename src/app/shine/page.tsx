import { Blog } from "@prisma/client";
import type { Metadata } from "next";
import { shine } from "@/components/resume/data/shine";
import Resume from "@/components/resume/Resume";
import { getPublishedArticles } from "@/lib/articles/queries";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const title = "Shine Gupta - AI Engineer & Full-Stack Developer";
const description =
  "AI Engineer and Full-Stack Developer with 3+ years building, fine-tuning, and deploying production ML and LLM systems for global clients. Specialized in RAG, RLHF, SFT, LLM evaluation, and MLOps on AWS and GCP, multi-agent architectures, and customer-facing web applications.";
const url = "/shine/";
const canonicalUrl = absoluteUrl(url);

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords:
    "AI Engineer, Full-Stack Developer, LLMs, RAG, AI Agents, LangGraph, MCP, React, Next.js, FastAPI, Python, TypeScript, MLOps, AWS, GCP, Docker, Kubernetes",
  authors: [{ name: "Shine Gupta" }],
  robots: "index, follow",
  alternates: {
    canonical: url,
    types: { "application/rss+xml": "/sb/blogs/feed.xml" },
  },
  openGraph: {
    title,
    description,
    url,
    type: "profile",
    locale: "en_US",
    siteName: "Shine Gupta's Resume",
    images: [
      {
        url: "/cv/images/shine.webp",
        width: 640,
        height: 640,
        alt: "Shine Gupta - AI Engineer & Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@shine_gupta17",
    site: "@shine_gupta17",
    images: ["/cv/images/shine.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shine Gupta",
  jobTitle: "AI Engineer & Full-Stack Developer",
  description,
  url: canonicalUrl,
  image: absoluteUrl("/cv/images/shine.webp"),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "India",
  },
  sameAs: [
    "https://github.com/Shine-5705",
    "https://www.linkedin.com/in/shine-gupta-62b22b264",
    "https://scholar.google.com/citations?user=kx3_tLYAAAAJ&hl=en",
    "https://x.com/shine_gupta17",
  ],
};

export default async function ShinePage() {
  const publishedArticles = await getPublishedArticles(Blog.sb);
  const recentPosts = publishedArticles.slice(0, 3).map((article) => ({
    title: article.title,
    summary: article.summary,
    date: article.publishedAt?.toISOString() ?? article.updatedAt.toISOString(),
    href: `/sb/blogs/${article.slug}/`,
    tags: article.tags,
  }));
  const lastUpdated =
    publishedArticles[0]?.updatedAt.toISOString() ?? "2026-07-19T00:00:00.000Z";

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, escaped per Next.js docs
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Resume
        data={shine}
        recentPosts={recentPosts}
        blogHref="/sb/blogs/"
        feedHref="/sb/blogs/feed.xml"
        lastUpdated={lastUpdated}
      />
    </>
  );
}
