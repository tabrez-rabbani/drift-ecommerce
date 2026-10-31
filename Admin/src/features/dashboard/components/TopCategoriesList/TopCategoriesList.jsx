import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import styles from "./TopCategoriesList.module.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%231f2228'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='11' font-family='sans-serif'>No Image</text></svg>";

export default function TopCategoriesList({ topCategories, loading }) {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Top Categories by Sales</h2>
        <Link to="/admin/categories" className={styles.actionBtn}>
          View All
        </Link>
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <Loader2 className={styles.spinner} size={24} />
        </div>
      ) : topCategories && topCategories.length > 0 ? (
        <div className={styles.listContainer}>
          {topCategories.map((item, index) => (
            <div key={item._id || index} className={styles.listItem}>
              <img
                src={item.image || FALLBACK_IMAGE}
                alt={item._id || "Category"}
                className={styles.itemThumbnail}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />

              <div className={styles.titleCol}>
                <h3 className={styles.itemTitle}>
                  {item._id
                    ? item._id.charAt(0).toUpperCase() + item._id.slice(1)
                    : "General"}
                </h3>
                <span className={styles.rankBadge}>Rank #{index + 1}</span>
              </div>

              <div className={styles.infoCol}>
                <p className={styles.fieldLabel}>Items Sold</p>
                <p className={styles.fieldValue}>{item.totalSold || 0}</p>
              </div>

              <div className={styles.infoCol}>
                <p className={styles.fieldLabel}>Orders</p>
                <p className={styles.fieldValue}>{item.orderCount || 0}</p>
              </div>

              <div className={styles.infoCol}>
                <p className={styles.fieldLabel}>Total Earn</p>
                <p className={styles.fieldValue}>₹ {item.totalRevenue || 0}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No category sales recorded yet</div>
      )}
    </div>
  );
}
