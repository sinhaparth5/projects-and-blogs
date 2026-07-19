import styles from "./blog.module.css";
import { blogFontVariables } from "./fonts";
import Masthead from "./Masthead";
import type { BlogListData } from "./types";

export default function PostShell({
  data,
  children,
}: {
  data: BlogListData;
  children: React.ReactNode;
}) {
  return (
    <main className={`${styles.container} ${blogFontVariables}`}>
      <div className={styles.content}>
        <Masthead data={data} />
        <article className={styles.prose}>{children}</article>
      </div>
    </main>
  );
}
