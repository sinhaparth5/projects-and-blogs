import type { BlogListData } from "../types";

export const parthBlogs: BlogListData = {
  title: "Parth's Blog",
  author: "Parth Sinha",
  aboutHref: "/parth/",
  blogHref: "/pb/blogs/",
  description: "Notes on full-stack engineering, web performance, and tooling.",
  posts: [
    {
      title: "Porting a PHP resume site to Next.js static export",
      date: "2026-07-19",
      summary:
        "How I moved a Slim + Twig CV to the App Router with CSS Modules, next/font, and zero runtime server.",
      tags: ["Next.js", "CSS Modules", "Static Export"],
      href: "/pb/blogs/porting-php-cv-to-nextjs/",
    },
    {
      title: "Hello world",
      date: "2026-07-01",
      summary:
        "Kicking off this blog: what I plan to write about and why I keep everything in one repo.",
      tags: ["Meta"],
      href: "/pb/blogs/hello-world/",
    },
  ],
};
