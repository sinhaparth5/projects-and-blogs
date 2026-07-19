import { shineBlogs } from "@/components/blog/data/shine";
import PostShell from "@/components/blog/PostShell";

export default function ShinePostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PostShell data={shineBlogs}>{children}</PostShell>;
}
