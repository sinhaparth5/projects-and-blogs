import type { Metadata } from "next";
import BlogList from "@/components/blog/BlogList";
import { parthBlogs } from "@/components/blog/data/parth";

export const metadata: Metadata = {
  title: "Blogs - Parth Sinha",
  description:
    "Blog posts by Parth Sinha on full-stack engineering, web performance, and tooling.",
};

export default function ParthBlogsPage() {
  return <BlogList data={parthBlogs} />;
}
