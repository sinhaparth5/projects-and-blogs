This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## MDX content

Nextra compiles `.mdx` files in the App Router. Add a route such as
`src/app/guides/page.mdx`, then visit `/guides/`. Global MDX components are
configured in `mdx-components.tsx` using the Nextra blog theme.

CSS Modules work in both TSX and MDX. Colocate files using the
`*.module.css` pattern, import them into the page, and reference classes through
the imported object: `className={styles.callout}`. See
`src/app/docs/docs.module.css` for an example.

## Static export

Create the static site in `out/`:

```bash
pnpm build
```

The generated directory can be deployed to any static file host.

## Docker

Build and run the static site with the included unprivileged Nginx image:

```bash
docker build -t projects-and-blogs .
docker run --rm -p 8080:8080 projects-and-blogs
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
