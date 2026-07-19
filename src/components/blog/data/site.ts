import type { BlogSiteData } from "../types";

export const blogSites = {
  pb: {
    title: "Parth's Blog",
    author: "Parth Sinha",
    aboutHref: "/parth/",
    blogHref: "/pb/blogs/",
    description:
      "Notes on full-stack engineering, web performance, and tooling.",
  },
  sb: {
    title: "Shine's Blog",
    author: "Shine",
    aboutHref: "/shine/",
    blogHref: "/sb/blogs/",
    description: "Writing on design systems, typography, and interface craft.",
  },
} satisfies Record<"pb" | "sb", BlogSiteData>;
