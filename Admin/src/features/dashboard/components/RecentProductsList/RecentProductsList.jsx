import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import styles from "./RecentProductsList.module.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%231f2228'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='11' font-family='sans-serif'>No Image</text></svg>";

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function getProductPrice(price) {
  if (!price) return 0;
  if (typeof price === "object") return price.amount || 0;
  return price;
}

export default function RecentProductsList({ recentProducts, loading }) {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Recent Added Products</h2>
        <Link to="/admin/products/create" className={styles.actionBtn}>
          Add Product
        </Link>
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <Loader2 className={styles.spinner} size={24} />
        </div>
      ) : recentProducts && recentProducts.length > 0 ? (
        <div className={styles.listContainer}>
          {recentProducts.map((pro) => {
            const img = pro.colors?.[0]?.images?.[0] || FALLBACK_IMAGE;
            const isInStock = pro.inStock !== false;

            return (
              <div key={pro._id} className={styles.listItem}>
                <img
                  src={img}
                  alt={pro.title}
                  className={styles.itemThumbnail}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />

                <div className={`${styles.infoCol} ${styles.titleCol}`}>
                  <h3 className={styles.itemTitle} title={pro.title}>
                    {pro.title}
                  </h3>
                  <p className={styles.itemDate}>{formatDate(pro.createdAt)}</p>
                </div>

                <div className={styles.infoCol}>
                  <p className={styles.fieldLabel}>Price</p>
                  <p className={styles.fieldValue}>
                    ₹ {getProductPrice(pro.price)}
                  </p>
                </div>

                <div className={styles.infoCol}>
                  <p className={styles.fieldLabel}>Stock</p>
                  <p
                    className={`${styles.fieldValue} ${
                      isInStock
                        ? styles.statusInStock
                        : styles.statusOutOfStock
                    }`}
                  >
                    {isInStock ? "In Stock" : "Out Of Stock"}
                  </p>
                </div>

                <div className={styles.infoCol}>
                  <p className={styles.fieldLabel}>Category</p>
                  <p className={styles.fieldValue}>
                    {pro.category || "General"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>No products added yet</div>
      )}
    </div>
  );
}

