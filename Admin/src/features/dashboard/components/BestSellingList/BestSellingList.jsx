import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import styles from "./BestSellingList.module.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%231f2228'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='11' font-family='sans-serif'>No Image</text></svg>";

export default function BestSellingList({ bestSellingProducts, loading }) {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Best Selling Product</h2>
        <Link to="/admin/products/create" className={styles.actionBtn}>
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <Loader2 className={styles.spinner} size={24} />
        </div>
      ) : bestSellingProducts && bestSellingProducts.length > 0 ? (
        <div className={styles.listContainer}>
          {bestSellingProducts.map((item) => (
            <div key={item._id} className={styles.listItem}>
              <img
                src={item.image || FALLBACK_IMAGE}
                alt={item.title || "Product"}
                className={styles.itemThumbnail}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className={styles.infoCol}>
                <p className={styles.fieldLabel}>Price</p>
                <p className={styles.fieldValue}>₹ {item.price}</p>
              </div>
              <div className={styles.infoCol}>
                <p className={styles.fieldLabel}>Orders</p>
                <p className={styles.fieldValue}>{item.orderCount}</p>
              </div>
              <div className={styles.infoCol}>
                <p className={styles.fieldLabel}>Total Earn</p>
                <p className={styles.fieldValue}>₹ {item.totalEarn}</p>
              </div>
              <div className={styles.infoCol}>
                <p className={styles.fieldLabel}>Total Sold</p>
                <p className={styles.fieldValue}>{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No sales data recorded yet</div>
      )}
    </div>
  );
}

