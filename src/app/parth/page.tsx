import { Blog } from "@prisma/client";
import type { Metadata } from "next";
import { parth } from "@/components/resume/data/parth";
import Resume from "@/components/resume/Resume";
import { getPublishedArticles } from "@/lib/articles/queries";
import { absoluteUrl } from "@/lib/seo";

const title = "Parth Sinha - Full Stack Engineer";
const description =
  "Detail-oriented Full Stack Engineer dedicated to building high-quality products. Specializing in modern web technologies and scalable solutions.";
const url = "/parth/";
const canonicalUrl = absoluteUrl(url);

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords:
    "Full Stack Engineer, Web Developer, PHP, JavaScript, React, Node.js, Software Engineer",
  authors: [{ name: "Parth Sinha" }],
  robots: "index, follow",
  alternates: {
    canonical: url,
    types: { "application/rss+xml": "/pb/blogs/feed.xml" },
  },
  openGraph: {
    title,
    description,
    url,
    type: "profile",
    locale: "en_US",
    siteName: "Parth Sinha Portfolio",
    images: [
      {
        url: "/cv/images/profile.webp",
        width: 640,
        height: 640,
        alt: "Parth Sinha - Full Stack Engineer Profile",
      },
    ],
  },
  twitter: {
    card: "summary",
    title,
    description,
    creator: "@sinhaparth555",
    site: "@sinhaparth555",
    images: ["/cv/images/profile.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Parth Sinha",
  jobTitle: "Full Stack Engineer",
  description,
  url: canonicalUrl,
  image: absoluteUrl("/cv/images/profile.webp"),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oxford",
    addressCountry: "United Kingdom",
  },
  sameAs: [
    "https://github.com/sinhaparth5",
    "https://www.linkedin.com/in/parth-sinha18",
    "https://x.com/sinhaparth555",
  ],
};

export default async function ParthPage() {
  const publishedArticles = await getPublishedArticles(Blog.pb);
  const recentPosts = publishedArticles.slice(0, 3).map((article) => ({
    title: article.title,
    summary: article.summary,
    date: article.publishedAt?.toISOString() ?? article.updatedAt.toISOString(),
    href: `/pb/blogs/${article.slug}/`,
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
        data={parth}
        recentPosts={recentPosts}
        blogHref="/pb/blogs/"
        feedHref="/pb/blogs/feed.xml"
        lastUpdated={lastUpdated}
      />
    </>
  );
}
