import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "nextra-theme-blog/style.css";
import "katex/dist/katex.min.css";
import "./globals.css";
import { siteDescription, siteName, siteUrl } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: siteName, template: "%s | Parth Sinha" },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "Parth Sinha", url: "/parth/" }],
  creator: "Parth Sinha",
  publisher: "Parth Sinha",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "technology",
  keywords: [
    "Parth Sinha",
    "full-stack engineering",
    "React",
    "Next.js",
    "TypeScript",
    "web performance",
    "design systems",
    "software architecture",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@sinhaparth555",
    site: "@sinhaparth555",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
