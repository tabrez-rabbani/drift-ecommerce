import styles from "./WishlistSkeleton.module.css";

const SKELETON_COUNT = 8;

export default function WishlistSkeleton() {
  return (
    <div className={styles.grid}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonBody}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonPrice} />
            <div className={styles.skeletonButton} />
          </div>
        </div>
      ))}
    </div>
  );
}
