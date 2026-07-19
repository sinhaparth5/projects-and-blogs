import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({});

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  trailingSlash: true,
  // Keep route metadata in <head> for every user agent instead of streaming it
  // into the document body after dynamic routes begin rendering.
  htmlLimitedBots: /.*/,
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./mdx-components.tsx",
    },
  },
};

export default withNextra(nextConfig);
