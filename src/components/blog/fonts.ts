import { IBM_Plex_Sans, Merriweather } from "next/font/google";

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-blog-heading",
});

export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-blog-body",
});

/** Class string that exposes both blog font variables on a container. */
export const blogFontVariables = `${ibmPlexSans.variable} ${merriweather.variable}`;
