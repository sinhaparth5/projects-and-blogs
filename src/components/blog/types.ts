export interface BlogPost {
  title: string;
  /** ISO date, e.g. "2026-07-19" */
  date: string;
  summary: string;
  tags: string[];
  /** Post URL, e.g. "/pb/blogs/hello-world/" */
  href: string;
}

export interface BlogSiteData {
  /** Page heading, e.g. "Parth's Blog" */
  title: string;
  author: string;
  /** Link to the author's CV page (the "About" nav item) */
  aboutHref: string;
  /** Link to the blog list (the "Blog" nav item) */
  blogHref: string;
  description: string;
}

export interface BlogListData extends BlogSiteData {
  posts: BlogPost[];
}
