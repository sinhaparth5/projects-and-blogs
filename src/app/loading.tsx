import styles from "./state.module.css";

export default function Loading() {
  return (
    <output className={styles.skeleton} aria-label="Loading page">
      <span />
      <span />
      <span />
      <span />
    </output>
  );
}
