import styles from "./resume.module.css";

export default function ResumeLoading() {
  return (
    <output className={styles.resumeSkeleton} aria-label="Loading resume">
      <span />
      <span />
      <span />
      <span />
      <span />
    </output>
  );
}
