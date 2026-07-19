import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import ParallaxController from "@/components/home/ParallaxController";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects, Engineering & Design",
  description:
    "Explore Parth Sinha's engineering portfolio and technical writing, alongside Shine's notes on design systems and interface craft.",
  alternates: { canonical: "/" },
};

function Spark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 66 99"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M66 49.5C54 45.96 39 24.75 33 0 27 24.75 15 44.79 0 49.5 18 56.57 25 82.5 33 99 39 84.86 48 56.57 66 49.5Z" />
    </svg>
  );
}

function ImageSpace({
  className,
  label,
  size,
}: {
  className?: string;
  label: string;
  size: string;
}) {
  return (
    <div className={`${styles.imageSpace} ${className ?? ""}`}>
      <span>Image space</span>
      <strong>{label}</strong>
      <small>{size}</small>
    </div>
  );
}

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
      <ParallaxController />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Static, escaped JSON-LD.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className={styles.siteHeader}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="Projects and Blogs home"
        >
          P&B
        </Link>
        <nav aria-label="Primary navigation">
          <Link className={styles.activeLink} href="/">
            Home
          </Link>
          <Link href="/parth/">Parth</Link>
          <Link href="/shine/">Shine</Link>
          <Link href="/pb/blogs/">Writing</Link>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroGlow} data-parallax data-speed="0.06" />
        <Spark className={styles.heroSpark} />
        <div className={styles.heroImageWrap} data-parallax data-speed="-0.045">
          <ImageSpace
            className={styles.heroImage}
            label="Hero portrait"
            size="1600 × 2000 px · 4:5"
          />
        </div>
        <div className={styles.heroCopy} data-parallax data-speed="0.025">
          <p>Independent work · thoughtful writing</p>
          <h1 id="hero-title">
            Ideas have a <em>new</em> address
          </h1>
        </div>
        <Link className={styles.heroCta} href="#explore">
          Explore now <ArrowRight aria-hidden="true" size={20} />
        </Link>
        <p className={styles.heroNote}>
          Engineering, design, and the decisions that connect them.
        </p>
      </section>

      <section
        className={styles.story}
        id="explore"
        aria-labelledby="story-title"
      >
        <div className={styles.storyGlow} data-parallax data-speed="0.08" />
        <Spark className={styles.storySpark} />
        <div
          className={styles.storyMainImage}
          data-parallax
          data-speed="-0.035"
        >
          <ImageSpace label="Editorial portrait" size="1400 × 1750 px · 4:5" />
        </div>
        <div
          className={styles.storyInsetImage}
          data-parallax
          data-speed="0.065"
        >
          <ImageSpace label="Detail image" size="900 × 1200 px · 3:4" />
        </div>
        <div className={styles.storyCopy}>
          <p>Two perspectives, one home</p>
          <h2 id="story-title">
            We make the complex feel <em>untamable</em>
          </h2>
          <span>
            Parth explores systems and software. Shine explores interfaces and
            visual language. Together, this is a living archive of the work.
          </span>
          <Link className={styles.storyLink} href="/parth/">
            Meet Parth <ArrowRight aria-hidden="true" size={19} />
          </Link>
          <Link className={styles.storyLink} href="/shine/">
            Meet Shine <ArrowRight aria-hidden="true" size={19} />
          </Link>
        </div>
      </section>

      <section className={styles.collection} aria-labelledby="collection-title">
        <div
          className={styles.collectionGlow}
          data-parallax
          data-speed="0.07"
        />
        <div
          className={styles.collectionFeature}
          data-parallax
          data-speed="-0.04"
        >
          <ImageSpace label="Work feature" size="1400 × 2100 px · 2:3" />
          <p aria-hidden="true">NEW IN TOWN · NEW IN TOWN ·</p>
        </div>
        <div className={styles.collectionCopy}>
          <p>Selected destinations</p>
          <h2 id="collection-title">Explore the collection</h2>
          <span>
            Choose a portfolio or step directly into the latest independent
            writing.
          </span>
        </div>
        <div className={styles.cards}>
          <Link className={styles.cardLink} href="/parth/">
            <ImageSpace label="Parth portrait" size="800 × 1200 px · 2:3" />
            <span>01 · Résumé</span>
            <strong>Parth Sinha</strong>
          </Link>
          <Link className={styles.cardLink} href="/shine/">
            <ImageSpace label="Shine portrait" size="800 × 1200 px · 2:3" />
            <span>02 · Résumé</span>
            <strong>Shine</strong>
          </Link>
          <Link className={styles.cardLink} href="/pb/blogs/">
            <ImageSpace label="Writing still life" size="800 × 1200 px · 2:3" />
            <span>03 · Journal</span>
            <strong>Latest writing</strong>
          </Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <strong>Projects & Blogs</strong>
        <p>Made with care in London.</p>
        <Link className={styles.footerLink} href="/admin/login/">
          Admin
        </Link>
      </footer>
    </main>
  );
}
