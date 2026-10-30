import { Link } from "react-router-dom";
import { Mail, ShoppingBasket, ShoppingCart, UserPlus } from "lucide-react";
import styles from "./StatCards.module.css";

export default function StatCards({ stats, loading }) {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={`${styles.statBorder} ${styles.borderBlue}`} />
        <div className={styles.statContent}>
          <div>
            <p className={styles.statLabel}>Total Contacts</p>
            <h3 className={styles.statValue}>
              {loading ? "..." : stats.totalContacts}
            </h3>
          </div>
          <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
            <Mail size={22} />
          </div>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={`${styles.statBorder} ${styles.borderRed}`} />
        <div className={styles.statContent}>
          <div>
            <p className={styles.statLabel}>Total User Orders</p>
            <h3 className={styles.statValue}>
              {loading ? "..." : stats.totalOrders}
            </h3>
          </div>
          <div className={`${styles.statIconWrapper} ${styles.iconRed}`}>
            <ShoppingBasket size={22} />
          </div>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={`${styles.statBorder} ${styles.borderGold}`} />
        <div className={styles.statContent}>
          <div>
            <p className={styles.statLabel}>Total Products</p>
            <div className={styles.statValueWrap}>
              <h3 className={styles.statValue}>
                {loading ? "..." : stats.totalProducts}
              </h3>
              <Link
                to="/admin/products/create"
                className={styles.addNewLink}
              >
                ADD NEW
              </Link>
            </div>
          </div>
          <div className={`${styles.statIconWrapper} ${styles.iconGold}`}>
            <ShoppingCart size={22} />
          </div>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={`${styles.statBorder} ${styles.borderPurple}`} />
        <div className={styles.statContent}>
          <div>
            <p className={styles.statLabel}>Total Users</p>
            <h3 className={styles.statValue}>
              {loading ? "..." : stats.totalUsers}
            </h3>
          </div>
          <div className={`${styles.statIconWrapper} ${styles.iconPurple}`}>
            <UserPlus size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}

