import type { Metadata } from "next";
import { parth } from "@/components/resume/data/parth";
import Resume from "@/components/resume/Resume";

const title = "Parth Sinha - Full Stack Engineer";
const description =
  "Detail-oriented Full Stack Engineer dedicated to building high-quality products. Specializing in modern web technologies and scalable solutions.";
const url = "https://cv.parthsinha.com";

export const metadata: Metadata = {
  title,
  description,
  keywords:
    "Full Stack Engineer, Web Developer, PHP, JavaScript, React, Node.js, Software Engineer",
  authors: [{ name: "Parth Sinha" }],
  robots: "index, follow",
  alternates: { canonical: url },
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
        width: 1200,
        height: 630,
        alt: "Parth Sinha - Full Stack Engineer Profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
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
  url,
  image: `${url}/cv/images/profile.webp`,
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

export default function ParthPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, escaped per Next.js docs
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Resume data={parth} />
    </>
  );
}
