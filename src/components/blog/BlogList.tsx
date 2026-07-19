import styles from "./blog.module.css";
import { blogFontVariables } from "./fonts";
import Masthead from "./Masthead";
import type { BlogListData } from "./types";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function BlogList({ data }: { data: BlogListData }) {
  const { description, posts } = data;

  return (
    <main
      id="main-content"
      className={`${styles.container} ${blogFontVariables}`}
      tabIndex={-1}
    >
      <div className={`${styles.content} ${styles.blogListContent}`}>
        <Masthead data={data} isHome />

        <p className={styles.description}>{description}</p>

        {posts.length === 0 ? (
          <p className={styles.empty}>No posts yet — check back soon.</p>
        ) : (
          <div className={styles.postList}>
            {posts.map((post) => (
              <article key={post.href} className={styles.post}>
                <div className={styles.postHeader}>
                  <h2 className={styles.postTitle}>
                    <a href={post.href}>{post.title}</a>
                  </h2>
                  <time className={styles.postDate} dateTime={post.date}>
                    {dateFormat.format(new Date(post.date))}
                  </time>
                </div>
                <p className={styles.postSummary}>{post.summary}</p>
                {post.tags.length > 0 && (
                  <ul className={styles.postTags}>
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <div className={styles.tag}>{tag}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
