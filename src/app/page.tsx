import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects, Engineering & Design",
  description:
    "Explore Parth Sinha's engineering portfolio and technical writing, alongside Shine's notes on design systems and interface craft.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        url: absoluteUrl("/"),
        name: siteName,
        description: siteDescription,
        inLanguage: "en-GB",
      },
      {
        "@type": "Person",
        "@id": `${absoluteUrl("/parth/")}#person`,
        name: "Parth Sinha",
        url: absoluteUrl("/parth/"),
        jobTitle: "Full Stack Engineer",
        sameAs: [
          "https://github.com/sinhaparth5",
          "https://www.linkedin.com/in/parth-sinha18/",
          "https://x.com/sinhaparth555",
        ],
      },
    ],
  };

  return (
    <main id="main-content" className={styles.page} tabIndex={-1}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Static, escaped JSON-LD.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className={styles.hero}>
        <p>Projects & independent writing</p>
        <h1>Engineering ideas and thoughtful interface craft.</h1>
        <span>
          Technical writing, professional work, and practical notes by Parth
          Sinha and Shine.
        </span>
      </header>
      <section className={styles.directory} aria-label="Explore the website">
        <article>
          <p>Engineering</p>
          <h2>Parth Sinha</h2>
          <span>
            Full-stack systems, React, Next.js, performance, architecture, and
            developer tooling.
          </span>
          <nav aria-label="Explore Parth Sinha">
            <Link href="/parth/">View portfolio</Link>
            <Link href="/pb/blogs/">Read engineering blog</Link>
          </nav>
        </article>
        <article>
          <p>Design</p>
          <h2>Shine</h2>
          <span>
            Design systems, typography, accessibility, frontend development, and
            polished interfaces.
          </span>
          <nav aria-label="Explore Shine">
            <Link href="/shine/">View portfolio</Link>
            <Link href="/sb/blogs/">Read design blog</Link>
          </nav>
        </article>
      </section>
    </main>
  );
}
