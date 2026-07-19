import styles from "./blog.module.css";
import { blogFontVariables } from "./fonts";
import Masthead from "./Masthead";
import type { BlogSiteData } from "./types";

export default function PostShell({
  data,
  children,
}: {
  data: BlogSiteData;
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      className={`${styles.container} ${blogFontVariables}`}
      tabIndex={-1}
    >
      <div className={styles.content}>
        <Masthead data={data} />
        {children}
      </div>
    </main>
  );
}
