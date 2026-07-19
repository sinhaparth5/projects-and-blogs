import { Blog } from "@prisma/client";
import { createArticleFeed, feedHeaders } from "@/lib/articles/feed";

export async function GET() {
  return new Response(await createArticleFeed(Blog.pb), {
    headers: feedHeaders,
  });
}
