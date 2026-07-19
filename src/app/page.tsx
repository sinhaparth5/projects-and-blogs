import fs from "node:fs";
import path from "node:path";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { Cormorant } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import ParallaxController from "@/components/home/ParallaxController";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";
import styles from "./page.module.css";

const cormorant = Cormorant({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Projects, Engineering & Research",
  description:
    "Two engineers, one archive: Parth Sinha on GPU architecture and systems, Shine on AI, machine learning, and quantitative research.",
  alternates: { canonical: "/" },
};

function Spark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 66 99" aria-hidden="true" focusable="false" {...props}>
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

function Leaf({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 27 26"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.84 25.02C19.12 19.9 21.55 10.82 26.94 4.57 18.87 6.27 10.73 4.93 6.1 0 8.2 7.96 2.7 14.77 0 20.45c5.19 0 14.9-1.12 20.84 4.57Z" />
    </svg>
  );
}

const ribbonItems =
  "GPU architecture · AI & ML · Quant research · Systems · Open source · Writing · ";

function Ribbon({ reverse = false }: { reverse?: boolean }) {
  return (
    <div
      className={`${styles.ribbon} ${reverse ? styles.ribbonReverse : ""}`}
      aria-hidden="true"
    >
      <div className={styles.ribbonTrack}>
        <span>{ribbonItems.repeat(3)}</span>
        <span>{ribbonItems.repeat(3)}</span>
      </div>
    </div>
  );
}

const landingDir = path.join(process.cwd(), "public", "landing");

function Artwork({
  file,
  label,
  size,
  className,
  alt = "",
  priority = false,
}: {
  file: string;
  label: string;
  size: string;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  if (!fs.existsSync(path.join(landingDir, file))) {
    return <ImageSpace className={className} label={label} size={size} />;
  }
  return (
    <div className={`${styles.artwork} ${className ?? ""}`}>
      <Image
        src={`/landing/${file}`}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 760px) 90vw, 45vw"
      />
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
        jobTitle: "Software Engineer",
        knowsAbout: ["GPU architecture", "systems engineering", "web platform"],
        sameAs: [
          "https://github.com/sinhaparth5",
          "https://www.linkedin.com/in/parth-sinha18/",
          "https://x.com/sinhaparth555",
        ],
      },
      {
        "@type": "Person",
        "@id": `${absoluteUrl("/shine/")}#person`,
        name: "Shine",
        url: absoluteUrl("/shine/"),
        jobTitle: "Engineer",
        knowsAbout: [
          "artificial intelligence",
          "machine learning",
          "quantitative research",
        ],
      },
    ],
  };

  return (
    <main
      id="main-content"
      className={`${styles.page} ${cormorant.variable}`}
      tabIndex={-1}
    >
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
        <div className={styles.heroGlowAlt} data-parallax data-speed="0.04" />
        <Spark className={styles.heroSpark} />
        <div
          className={styles.heroPill}
          data-parallax
          data-speed="0.05"
          aria-hidden="true"
        >
          <Leaf />
        </div>
        <div className={styles.heroImageWrap} data-parallax data-speed="-0.045">
          <Artwork
            file="hero-doodles.png"
            className={styles.heroImage}
            label="Hero doodle collage"
            size="2400 × 1350 px · 16:9"
            priority
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
          Two engineers writing down what the hardware and the models actually
          do.
        </p>
      </section>

      <Ribbon />

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
          <Artwork
            file="editorial-portrait.png"
            label="Editorial portrait"
            size="1400 × 1750 px · 4:5"
          />
        </div>
        <div
          className={styles.storyInsetImage}
          data-parallax
          data-speed="0.065"
        >
          <Artwork
            file="detail.png"
            label="Detail image"
            size="900 × 1200 px · 3:4"
          />
        </div>
        <div className={styles.storyCopy}>
          <p>Two perspectives, one home</p>
          <h2 id="story-title">
            We make the complex feel <em>untamable</em>
          </h2>
          <span>
            Parth works close to the metal — GPU architecture and systems.
            Shine works close to the data — AI, machine learning, and quant
            research. Together, this is a living archive of both.
          </span>
          <Link className={styles.storyLink} href="/parth/">
            Meet Parth <ArrowRight aria-hidden="true" size={19} />
          </Link>
          <Link className={styles.storyLink} href="/shine/">
            Meet Shine <ArrowRight aria-hidden="true" size={19} />
          </Link>
          <ol className={styles.storyIndex}>
            <li>
              <span>01</span>GPU architecture, compilers & systems
            </li>
            <li>
              <span>02</span>AI, machine learning & quantitative research
            </li>
            <li>
              <span>03</span>Field notes published as essays
            </li>
          </ol>
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
          <Artwork
            file="work-feature.png"
            label="Work feature"
            size="1400 × 2100 px · 2:3"
          />
          <p aria-hidden="true">NEW IN TOWN · NEW IN TOWN ·</p>
        </div>
        <div className={styles.collectionCopy}>
          <p>Selected destinations</p>
          <h2 id="collection-title">Explore the archive</h2>
          <span>
            Choose a portfolio or step directly into the latest independent
            writing.
          </span>
          <Link
            className={styles.collectionArrow}
            href="/pb/blogs/"
            aria-label="Browse all writing"
          >
            <ArrowRight aria-hidden="true" size={22} />
          </Link>
        </div>
        <div className={styles.cards}>
          <Link className={styles.cardLink} href="/parth/">
            <Artwork
              file="card-parth.png"
              label="Parth portrait"
              size="800 × 1200 px · 2:3"
            />
            <span>01 · Résumé</span>
            <strong>Parth Sinha</strong>
          </Link>
          <Link className={styles.cardLink} href="/shine/">
            <Artwork
              file="card-shine.png"
              label="Shine portrait"
              size="800 × 1200 px · 2:3"
            />
            <span>02 · Résumé</span>
            <strong>Shine</strong>
          </Link>
          <Link className={styles.cardLink} href="/pb/blogs/">
            <Artwork
              file="card-writing.png"
              label="Writing still life"
              size="800 × 1200 px · 2:3"
            />
            <span>03 · Journal</span>
            <strong>Latest writing</strong>
          </Link>
        </div>
      </section>

      <Ribbon reverse />

      <section className={styles.ctaBand} aria-labelledby="cta-title">
        <div className={styles.ctaGlow} data-parallax data-speed="0.06" />
        <Spark className={styles.ctaSpark} data-parallax data-speed="-0.04" />
        <p>Straight from the studio</p>
        <h2 id="cta-title">
          Come for the code, stay for the <em>notes</em>
        </h2>
        <div className={styles.ctaLinks}>
          <Link className={styles.ctaLink} href="/pb/blogs/">
            Notes by Parth <ArrowRight aria-hidden="true" size={20} />
          </Link>
          <Link className={styles.ctaLink} href="/sb/blogs/">
            Notes by Shine <ArrowRight aria-hidden="true" size={20} />
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
