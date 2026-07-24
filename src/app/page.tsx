import fs from "node:fs";
import path from "node:path";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Cpu,
  HeartPulse,
  NotebookPen,
  ShieldAlert,
  Trophy,
  Video,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ParallaxController from "@/components/home/ParallaxController";
import SiteHeader from "@/components/home/SiteHeader";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects, Engineering & Research",
  description:
    "Two engineers, one archive: Shine Gupta on AI, machine learning, and quantitative research, Parth Sinha on GPU architecture and systems.",
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
        "@id": `${absoluteUrl("/shine/")}#person`,
        name: "Shine Gupta",
        url: absoluteUrl("/shine/"),
        jobTitle: "Engineer",
        knowsAbout: [
          "artificial intelligence",
          "machine learning",
          "quantitative research",
        ],
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

      <SiteHeader />

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
        <div className={styles.heroCopy} data-parallax data-speed="0.025">
          <p>Two engineers · one archive</p>
          <h1 id="hero-title">
            We build <span className={styles.heroHighlight}>systems</span>.
            <br />
            We train <span className={styles.heroHighlight}>models</span>.
          </h1>
          <p className={styles.heroSubcopy}>
            Two engineers writing down what the hardware and the models actually
            do.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.heroCta} href="#explore">
              Explore the archive <ArrowRight aria-hidden="true" size={20} />
            </Link>
            <Link className={styles.heroCtaGhost} href="/pb/blogs/">
              Read the notes
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <strong>15+</strong>
              <span>years engineering</span>
            </div>
            <div className={styles.heroStat}>
              <strong>9+</strong>
              <span>hackathons won</span>
            </div>
            <div className={styles.heroStat}>
              <strong>3</strong>
              <span>papers at ICML 2026</span>
            </div>
            <div className={styles.heroStat}>
              <strong>500+</strong>
              <span>users on shipped products</span>
            </div>
          </div>
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
          <p>Our philosophy</p>
          <h2 id="story-title">We make the complex feel legible.</h2>
          <span>
            Shine works close to the data — AI, machine learning, and quant
            research. Parth works close to the metal — GPU architecture and
            systems. Together, this is a living archive of both.
          </span>
          <Link className={styles.storyLink} href="/shine/" prefetch={false}>
            Meet Shine <ArrowRight aria-hidden="true" size={19} />
          </Link>
          <Link className={styles.storyLink} href="/parth/" prefetch={false}>
            Meet Parth <ArrowRight aria-hidden="true" size={19} />
          </Link>
          <div className={styles.philosophyGrid}>
            <div className={styles.philosophyCard}>
              <span className={styles.philosophyIcon}>
                <Cpu aria-hidden="true" size={20} />
              </span>
              <span>GPU architecture, compilers & systems</span>
            </div>
            <div className={styles.philosophyCard}>
              <span className={styles.philosophyIcon}>
                <BrainCircuit aria-hidden="true" size={20} />
              </span>
              <span>AI, machine learning & quantitative research</span>
            </div>
            <div className={styles.philosophyCard}>
              <span className={styles.philosophyIcon}>
                <NotebookPen aria-hidden="true" size={20} />
              </span>
              <span>Field notes published as essays</span>
            </div>
            <div className={styles.philosophyCard}>
              <span className={styles.philosophyIcon}>
                <Trophy aria-hidden="true" size={20} />
              </span>
              <span>9+ hackathon wins, 3 papers accepted at ICML 2026</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.process} aria-labelledby="process-title">
        <p>How we work</p>
        <h2 id="process-title">From question to published note.</h2>
        <ol className={styles.processList}>
          <li className={styles.processStep}>
            <span className={styles.processNumber}>01</span>
            <div>
              <h3>Explore</h3>
              <p>
                We start at the hardware and the model — profiling GPUs, reading
                papers, running the numbers ourselves.
              </p>
            </div>
          </li>
          <li className={styles.processStep}>
            <span className={styles.processNumber}>02</span>
            <div>
              <h3>Build</h3>
              <p>
                We ship the system: compilers, agents, pipelines, production
                code that has to hold up.
              </p>
            </div>
          </li>
          <li className={styles.processStep}>
            <span className={styles.processNumber}>03</span>
            <div>
              <h3>Publish</h3>
              <p>
                Every real finding becomes a written note — the archive is the
                paper trail.
              </p>
            </div>
          </li>
        </ol>
        <div className={styles.processOutcomes}>
          <div className={styles.processOutcome}>
            <strong>3 apps</strong>
            <span>shipped in 8 weeks at Gnani.ai</span>
          </div>
          <div className={styles.processOutcome}>
            <strong>50,000+</strong>
            <span>documents processed into a RAG pipeline at DRDO</span>
          </div>
          <div className={styles.processOutcome}>
            <strong>35%</strong>
            <span>lift in multi-turn LLM quality at Turing</span>
          </div>
        </div>
      </section>

      <section
        className={styles.credentials}
        aria-label="Companies we've built for"
      >
        <p>Built inside</p>
        <p className={styles.credentialsLead}>
          Eight product and research teams — from LTE base stations at Nokia
          Siemens to enterprise AI agents at Motion and Valura.ai.
        </p>
        <div className={styles.credentialsRow}>
          <span className={styles.credentialPill}>Motion</span>
          <span className={styles.credentialPill}>Film.io</span>
          <span className={styles.credentialPill}>Parabol</span>
          <span className={styles.credentialPill}>Clevertech</span>
          <span className={styles.credentialPill}>Gnani.ai</span>
          <span className={styles.credentialPill}>Valura.ai</span>
          <span className={styles.credentialPill}>Turing</span>
          <span className={styles.credentialPill}>DRDO</span>
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
          <p aria-hidden="true">LATEST WORK · LATEST WORK ·</p>
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
          <Link className={styles.cardLink} href="/shine/" prefetch={false}>
            <Artwork
              file="card-shine.png"
              label="Shine portrait"
              size="800 × 1200 px · 2:3"
            />
            <span>01 · Résumé</span>
            <strong>Shine Gupta</strong>
            <em className={styles.cardRole}>AI engineer, 9+ hackathon wins</em>
          </Link>
          <Link className={styles.cardLink} href="/parth/" prefetch={false}>
            <Artwork
              file="card-parth.png"
              label="Parth portrait"
              size="800 × 1200 px · 2:3"
            />
            <span>02 · Résumé</span>
            <strong>Parth Sinha</strong>
            <em className={styles.cardRole}>
              Full-stack &amp; systems, 15 years
            </em>
          </Link>
          <Link className={styles.cardLink} href="/pb/blogs/">
            <Artwork
              file="card-writing.png"
              label="Writing still life"
              size="800 × 1200 px · 2:3"
            />
            <span>03 · Journal</span>
            <strong>Latest writing</strong>
            <em className={styles.cardRole}>Notes from both engineers</em>
          </Link>
        </div>
      </section>

      <section className={styles.projects} aria-labelledby="projects-title">
        <p>Open source & side projects</p>
        <h2 id="projects-title">Things we've shipped outside of work.</h2>
        <div className={styles.projectsGrid}>
          <a
            className={styles.projectCard}
            href="https://monito.dev/"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.projectBadge}>
              <Cpu aria-hidden="true" size={18} />
            </span>
            <h3>
              Monito <ArrowUpRight aria-hidden="true" size={16} />
            </h3>
            <p>
              Browser extension for debugging web apps — screenshots, screen
              recording, E2E test generation, and bug reports.
            </p>
          </a>
          <a
            className={styles.projectCard}
            href="https://consultly.com/"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.projectBadge}>
              <Video aria-hidden="true" size={18} />
            </span>
            <h3>
              Consultly <ArrowUpRight aria-hidden="true" size={16} />
            </h3>
            <p>
              A platform for online consultations with real-time video meetings
              and scheduling, built on WebRTC.
            </p>
          </a>
          <a
            className={styles.projectCard}
            href="https://chatverse.io/"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.projectBadge}>
              <BrainCircuit aria-hidden="true" size={18} />
            </span>
            <h3>
              Chatverse.io <ArrowUpRight aria-hidden="true" size={16} />
            </h3>
            <p>
              An AI no-code automation platform that turns plain English into
              real actions across 15+ tools. 500+ beta users.
            </p>
          </a>
          <a
            className={styles.projectCard}
            href="https://github.com/Shine-5705/CareMate-AI-Powered-Chronic-Disease-Monitoring-Remote-Care"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.projectBadge}>
              <HeartPulse aria-hidden="true" size={18} />
            </span>
            <h3>
              CareMate <ArrowUpRight aria-hidden="true" size={16} />
            </h3>
            <p>
              A multilingual, LLM-powered healthcare assistant with RAG-based
              clinical reasoning and symptom triage.
            </p>
          </a>
          <a
            className={styles.projectCard}
            href="https://github.com/BartoszJarocki/cv"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.projectBadge}>
              <NotebookPen aria-hidden="true" size={18} />
            </span>
            <h3>
              Minimalist CV <ArrowUpRight aria-hidden="true" size={16} />
            </h3>
            <p>
              An open source, print-friendly CV template focused on readability.
              9k+ stars on GitHub.
            </p>
          </a>
          <a
            className={styles.projectCard}
            href="https://github.com/dorkydhruv/Cyber-Rakshak"
            target="_blank"
            rel="noreferrer"
          >
            <span className={styles.projectBadge}>
              <ShieldAlert aria-hidden="true" size={18} />
            </span>
            <h3>
              CyberRakshak <ArrowUpRight aria-hidden="true" size={16} />
            </h3>
            <p>
              An AI cybercrime prediction system with 82% accuracy and real-time
              risk scoring. Winner, Innotech 2023.
            </p>
          </a>
        </div>
      </section>

      <Ribbon reverse />

      <div className={styles.ctaBandOuter}>
        <section className={styles.ctaBand} aria-labelledby="cta-title">
          <Spark className={styles.ctaSpark} data-parallax data-speed="-0.04" />
          <p>Straight from the notebook</p>
          <h2 id="cta-title">Come for the code, stay for the notes.</h2>
          <div className={styles.ctaLinks}>
            <Link className={styles.ctaLink} href="/sb/blogs/">
              Notes by Shine <ArrowRight aria-hidden="true" size={20} />
            </Link>
            <Link className={styles.ctaLink} href="/pb/blogs/">
              Notes by Parth <ArrowRight aria-hidden="true" size={20} />
            </Link>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <div>
          <strong>Projects & Blogs</strong>
        </div>
        <div className={styles.footerSocial}>
          <div className={styles.footerSocialGroup}>
            <span>Shine</span>
            <a
              href="https://github.com/Shine-5705"
              target="_blank"
              rel="noreferrer"
              aria-label="Shine's GitHub profile"
            >
              <Image src="/cv/icons/github.png" alt="" width={16} height={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/shine-gupta-62b22b264"
              target="_blank"
              rel="noreferrer"
              aria-label="Shine's LinkedIn profile"
            >
              <Image
                src="/cv/icons/linkedin.png"
                alt=""
                width={16}
                height={16}
              />
            </a>
            <a
              href="https://x.com/shine_gupta17"
              target="_blank"
              rel="noreferrer"
              aria-label="Shine's X profile"
            >
              <Image src="/cv/icons/x.svg" alt="" width={16} height={16} />
            </a>
          </div>
          <div className={styles.footerSocialGroup}>
            <span>Parth</span>
            <a
              href="https://github.com/sinhaparth5"
              target="_blank"
              rel="noreferrer"
              aria-label="Parth's GitHub profile"
            >
              <Image src="/cv/icons/github.png" alt="" width={16} height={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/parth-sinha18/"
              target="_blank"
              rel="noreferrer"
              aria-label="Parth's LinkedIn profile"
            >
              <Image
                src="/cv/icons/linkedin.png"
                alt=""
                width={16}
                height={16}
              />
            </a>
            <a
              href="https://x.com/sinhaparth555"
              target="_blank"
              rel="noreferrer"
              aria-label="Parth's X profile"
            >
              <Image src="/cv/icons/x.svg" alt="" width={16} height={16} />
            </a>
          </div>
        </div>
        <Link className={styles.footerLink} href="/admin/login/">
          Admin
        </Link>
      </footer>
    </main>
  );
}
