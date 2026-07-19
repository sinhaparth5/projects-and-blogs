import type { Metadata } from "next";
import BlogList from "@/components/blog/BlogList";
import { shineBlogs } from "@/components/blog/data/shine";

export const metadata: Metadata = {
  title: "Blogs - Shine",
  description:
    "Blog posts by Shine on design systems, typography, and interface craft.",
};

export default function ShineBlogsPage() {
  return <BlogList data={shineBlogs} />;
}
