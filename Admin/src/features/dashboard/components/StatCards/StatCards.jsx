import { Link } from "react-router-dom";
import { ShoppingBasket, ShoppingCart, UserPlus, IndianRupee } from "lucide-react";
import styles from "./StatCards.module.css";

function formatRevenue(amount) {
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toString();
}

export default function StatCards({ stats, loading }) {
  return (
    <div className={styles.statsGrid}>
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
            {!loading && stats.newUsersThisMonth > 0 && (
              <p className={styles.statSubLabel}>
                +{stats.newUsersThisMonth} this month
              </p>
            )}
          </div>
          <div className={`${styles.statIconWrapper} ${styles.iconPurple}`}>
            <UserPlus size={22} />
          </div>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={`${styles.statBorder} ${styles.borderGreen}`} />
        <div className={styles.statContent}>
          <div>
            <p className={styles.statLabel}>Total Revenue</p>
            <h3 className={styles.statValue}>
              {loading ? "..." : `₹${formatRevenue(stats.totalRevenue)}`}
            </h3>
            <p className={styles.statSubLabel}>Completed payments</p>
          </div>
          <div className={`${styles.statIconWrapper} ${styles.iconGreen}`}>
            <IndianRupee size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}
