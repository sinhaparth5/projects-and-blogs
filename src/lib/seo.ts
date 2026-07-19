export const siteUrl = new URL(
  process.env.APP_BASE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "https://parthsinha.com",
);

export const siteName = "Parth Sinha — Projects & Blogs";
export const siteDescription =
  "Engineering projects, technical writing, and design notes by Parth Sinha and Shine.";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function articlePath(blog: "pb" | "sb", slug: string) {
  return `/${blog}/blogs/${slug}/`;
}

export function authorPath(blog: "pb" | "sb") {
  return blog === "pb" ? "/parth/" : "/shine/";
}
