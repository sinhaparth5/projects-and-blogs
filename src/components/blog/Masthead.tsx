import styles from "./blog.module.css";
import type { BlogSiteData } from "./types";

export default function Masthead({
  data,
  isHome = false,
}: {
  data: BlogSiteData;
  /** true on the blog list page — renders the title as the page h1 */
  isHome?: boolean;
}) {
  const { title, aboutHref, blogHref } = data;

  return (
    <header className={styles.masthead}>
      {isHome ? (
        <h1 className={styles.mastheadTitle}>{title}</h1>
      ) : (
        <p className={styles.mastheadTitle}>
          <a href={blogHref}>{title}</a>
        </p>
      )}
      <nav className={styles.mastheadNav} aria-label="Site navigation">
        <a href={aboutHref} className={styles.navLink}>
          About
        </a>
        <a
          href={blogHref}
          className={`${styles.navLink} ${styles.navLinkActive}`}
          aria-current={isHome ? "page" : undefined}
        >
          Blog
        </a>
      </nav>
    </header>
  );
}
