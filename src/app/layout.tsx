import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "nextra-theme-blog/style.css";
import "katex/dist/katex.min.css";
import "./globals.css";
import CookieConsent from "@/components/consent/CookieConsent";
import { CONSENT_FIELDS, CONSENT_STORAGE_KEY } from "@/lib/consent";
import { siteDescription, siteName, siteUrl } from "@/lib/seo";

const GTM_ID = "GTM-KPCQQHQT";
const GA_MEASUREMENT_ID = "G-P96WFVMG3W";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: siteName, template: "%s | Parth & Shine" },
  description: siteDescription,
  applicationName: siteName,
  authors: [
    { name: "Parth Sinha", url: "/parth/" },
    { name: "Shine", url: "/shine/" },
  ],
  creator: "Parth Sinha & Shine",
  publisher: "Parth Sinha & Shine",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "technology",
  keywords: [
    "Parth Sinha",
    "Shine",
    "GPU architecture",
    "systems engineering",
    "AI",
    "machine learning",
    "quantitative research",
    "full-stack engineering",
    "web performance",
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
      <body>
        {/* Consent Mode v2 default: must run before the Google tag processes
            any command, so it loads with strategy="beforeInteractive" and is
            the first script in the tree. Reads any previously stored choice
            so returning visitors get the right default from their first
            event, instead of denied-then-update on every page. */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`(function () {
  var granted = false;
  try {
    granted = window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}) === "granted";
  } catch (e) {}
  var state = granted ? "granted" : "denied";
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    ${CONSENT_FIELDS.map((field) => `${field}: state`).join(",\n    ")}
  });
})();`}
        </Script>

        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* End Google Tag Manager */}

        {/* Google tag (gtag.js) */}
        <Script
          id="gtag-src"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
window.gtag('js', new Date());
window.gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>

        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
