import styles from "./CartPageSkeleton.module.css";

const SKELETON_ROWS = 3;

export default function CartPageSkeleton() {
  return (
    <div className={styles.layout} aria-hidden="true">
      <div className={styles.itemsSection}>
        <div className={styles.titleLine} />
        <div className={styles.tableHead} />

        <div className={styles.itemsList}>
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div key={i} className={styles.row}>
              <div className={styles.image} />
              <div className={styles.info}>
                <div className={styles.title} />
                <div className={styles.meta} />
              </div>
              <div className={styles.price} />
              <div className={styles.qty} />
              <div className={styles.total} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryTitle} />
          <div className={styles.summaryRow} />
          <div className={styles.summaryRow} />
          <div className={styles.summaryDivider} />
          <div className={styles.summaryTotal} />
          <div className={styles.checkoutBtn} />
        </div>
      </div>
    </div>
  );
}
