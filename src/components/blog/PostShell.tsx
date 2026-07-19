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
    <main className={`${styles.container} ${blogFontVariables}`}>
      <div className={styles.content}>
        <Masthead data={data} />
        {children}
      </div>
    </main>
  );
}
