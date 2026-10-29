import styles from "./AdminCard.module.css";

export default function AdminCard({ title, actions, children, className = "" }) {
  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${className}`.trim()}>
        {(title || actions) && (
          <div className={styles.cardHeader}>
            {title && (
              <div className={styles.titleWrapper}>
                <div className={styles.titleLine} />
                <h2 className={styles.title}>{title}</h2>
              </div>
            )}
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

