import { Link } from "react-router-dom";
import { FolderKanban, Loader2 } from "lucide-react";
import styles from "./TopCategoriesList.module.css";

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
              <div className={styles.categoryIconWrap}>
                <FolderKanban size={24} className={styles.categoryIcon} />
              </div>

              <div className={styles.titleCol}>
                <h3 className={styles.itemTitle}>
                  {item._id
                    ? item._id.charAt(0).toUpperCase() + item._id.slice(1)
                    : "General"}
                </h3>
                <p className={styles.rankLabel}>Rank #{index + 1}</p>
              </div>

              <div className={styles.infoCol}>
                <p className={styles.fieldLabel}>Items Sold</p>
                <p className={styles.fieldValue}>{item.totalSold || 0}</p>
              </div>

              <div className={styles.infoCol}>
                <p className={styles.fieldLabel}>Total Revenue</p>
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
