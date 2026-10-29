import styles from "./ProductCardSkeleton.module.css";

const SWATCH_KEYS = [0, 1, 2];

export default function ProductCardSkeleton() {
  return (
    <div className={styles.cardSkeleton} aria-hidden="true">
      <div className={styles.cardSkeleton__image} />
      <div className={styles.cardSkeleton__content}>
        <div className={styles.cardSkeleton__title} />
        <div className={styles.cardSkeleton__priceRow}>
          <div className={styles.cardSkeleton__price} />
          <div className={styles.cardSkeleton__btn} />
        </div>
        <div className={styles.cardSkeleton__swatches}>
          {SWATCH_KEYS.map((i) => (
            <div key={i} className={styles.cardSkeleton__swatch} />
          ))}
        </div>
      </div>
    </div>
  );
}
