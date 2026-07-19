import type { BlogListData } from "../types";

// Placeholder posts — replace with Shine's real writing.
export const shineBlogs: BlogListData = {
  title: "Shine's Blog",
  author: "Shine",
  aboutHref: "/shine/",
  blogHref: "/sb/blogs/",
  description: "Writing on design systems, typography, and interface craft.",
  posts: [
    {
      title: "Choosing a type scale that survives real content",
      date: "2026-07-10",
      summary:
        "Fluid scales look great in demos and fall apart in tables. A practical approach that holds up.",
      tags: ["Typography", "Design Systems"],
      href: "/sb/blogs/choosing-a-type-scale/",
    },
    {
      title: "Hello world",
      date: "2026-07-01",
      summary: "First post: what this blog is about and what to expect here.",
      tags: ["Meta"],
      href: "/sb/blogs/hello-world/",
    },
  ],
};
