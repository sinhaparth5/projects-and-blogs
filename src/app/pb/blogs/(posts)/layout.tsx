import { parthBlogs } from "@/components/blog/data/parth";
import PostShell from "@/components/blog/PostShell";

export default function ParthPostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PostShell data={parthBlogs}>{children}</PostShell>;
}
