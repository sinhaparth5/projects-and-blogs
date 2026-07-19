import { ArticleStatus, Blog, type Prisma, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const articles = [
  {
    blog: Blog.pb,
    slug: "porting-php-cv-to-nextjs",
    title: "Porting a PHP resume site to Next.js static export",
    summary:
      "How I moved a Slim + Twig CV to the App Router with CSS Modules, next/font, and zero runtime server.",
    tags: ["Next.js", "CSS Modules", "Static Export"],
    bodyHtml: `<p>I recently moved my CV from a PHP Slim + Twig site to this Next.js app. A few notes from the process:</p>
<ul>
  <li><strong>CSS Modules</strong> made it easy to port the original stylesheet while keeping it scoped away from the blog theme's global styles.</li>
  <li><strong>next/font</strong> self-hosts Inter at build time — same font as before, but no runtime request to Google Fonts.</li>
  <li><strong><code>output: "export"</code></strong> produces a fully static site, so the deployment story (Nginx in Docker) stayed exactly the same.</li>
</ul>
<p>The trickiest part was neutralizing global styles that leaked into the ported markup — element-level rules from the blog theme were centering every <code>&lt;article&gt;</code>. A scoped <code>:where()</code> reset fixed it without specificity wars.</p>`,
    status: ArticleStatus.PUBLISHED,
    publishedAt: new Date("2026-07-19T00:00:00.000Z"),
  },
  {
    blog: Blog.pb,
    slug: "hello-world",
    title: "Hello world",
    summary:
      "Kicking off this blog: what I plan to write about and why I keep everything in one repo.",
    tags: ["Meta"],
    bodyHtml: `<p>Kicking off this blog. I plan to write about full-stack engineering, web performance, and the tooling I use day to day.</p>
<p>Everything here lives in the same repository as my CV — one static export, deployed anywhere.</p>`,
    status: ArticleStatus.PUBLISHED,
    publishedAt: new Date("2026-07-01T00:00:00.000Z"),
  },
  {
    blog: Blog.sb,
    slug: "choosing-a-type-scale",
    title: "Choosing a type scale that survives real content",
    summary:
      "Fluid scales look great in demos and fall apart in tables. A practical approach that holds up.",
    tags: ["Typography", "Design Systems"],
    bodyHtml: `<p>Type scales look effortless in demos with three headings and a paragraph. Then real content arrives: long German compound words, data tables, timestamps, legal footnotes — and the scale falls apart.</p>
<p>A few principles that have held up for me:</p>
<ul>
  <li><strong>Fewer steps than you think.</strong> Most products need five or six sizes, not twelve.</li>
  <li><strong>Test with tabular data early.</strong> Numbers expose bad line-height choices faster than prose.</li>
  <li><strong>Pin the body size first.</strong> Build the scale outward from 16px, not downward from the hero.</li>
</ul>
<p><em>(Placeholder post — replace with real content.)</em></p>`,
    status: ArticleStatus.PUBLISHED,
    publishedAt: new Date("2026-07-10T00:00:00.000Z"),
  },
  {
    blog: Blog.sb,
    slug: "hello-world",
    title: "Hello world",
    summary: "First post: what this blog is about and what to expect here.",
    tags: ["Meta"],
    bodyHtml: `<p>First post! This blog will cover design systems, typography, and the small details that make interfaces feel considered.</p>
<p>More soon.</p>`,
    status: ArticleStatus.PUBLISHED,
    publishedAt: new Date("2026-07-01T00:00:00.000Z"),
  },
] satisfies Omit<Prisma.ArticleCreateManyInput, "authorId">[];

const users = [
  { username: "parth", displayName: "Parth Sinha" },
  { username: "shine", displayName: "Shine" },
] as const;

async function main() {
  const userIds = new Map<string, string>();

  for (const user of users) {
    const savedUser = await db.user.upsert({
      where: { username: user.username },
      update: { displayName: user.displayName },
      create: user,
      select: { id: true },
    });

    userIds.set(user.username, savedUser.id);
  }

  for (const article of articles) {
    const authorId = userIds.get(article.blog === Blog.pb ? "parth" : "shine");

    if (!authorId) {
      throw new Error(`Missing author for ${article.blog}/${article.slug}`);
    }

    const data = { ...article, authorId };

    await db.article.upsert({
      where: {
        blog_slug: { blog: article.blog, slug: article.slug },
      },
      update: data,
      create: data,
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
