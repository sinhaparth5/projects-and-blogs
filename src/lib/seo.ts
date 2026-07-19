export const siteUrl = new URL(
  process.env.APP_BASE_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "") ||
    "https://parthsinha.com",
);

export const siteName = "Parth & Shine — Projects & Blogs";
export const siteDescription =
  "Engineering projects and technical writing by Parth Sinha (GPU architecture and systems) and Shine (AI, machine learning, and quantitative research).";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function articlePath(blog: "pb" | "sb", slug: string) {
  return `/${blog}/blogs/${slug}/`;
}

export function authorPath(blog: "pb" | "sb") {
  return blog === "pb" ? "/parth/" : "/shine/";
}
