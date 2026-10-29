import styles from "./CheckoutSkeleton.module.css";

export default function CheckoutSkeleton() {
  return (
    <div className={styles.layout}>
      <div className={styles.mainColumn}>
        <div className={styles.card}>
          <div className={styles.header} />
          <div className={styles.grid}>
            <div className={styles.field} />
            <div className={styles.field} />
            <div className={styles.field} />
            <div className={styles.field} />
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.header} />
          <div className={`${styles.field} ${styles.fieldMb}`} />
          <div className={styles.field} />
        </div>
      </div>
      <div className={styles.summarySidebar}>
        <div className={styles.summaryCard}>
          <div className={styles.header} />
          <div className={styles.item} />
          <div className={styles.item} />
          <div className={styles.line} />
          <div className={styles.button} />
        </div>
      </div>
    </div>
  );
}

