import { Loader2 } from "lucide-react";
import styles from "./RecentOrdersList.module.css";

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function getOrderStatusClass(status) {
  switch (status) {
    case "delivered":
      return styles.statusDelivered;
    case "shipped":
      return styles.statusShipped;
    case "processing":
      return styles.statusProcessing;
    case "cancelled":
      return styles.statusCancelled;
    case "placed":
    default:
      return styles.statusPlaced;
  }
}

export default function RecentOrdersList({ recentOrders, loading }) {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Recent Orders</h2>
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <Loader2 className={styles.spinner} size={24} />
        </div>
      ) : recentOrders && recentOrders.length > 0 ? (
        <div className={styles.listContainer}>
          {recentOrders.map((ord) => {
            const isPaid =
              ord.paymentStatus === "completed" ||
              ord.paymentStatus === "Paid";

            return (
              <div key={ord._id} className={styles.listItem}>
                <div className={styles.infoCol}>
                  <p className={styles.fieldLabel}>Order ID</p>
                  <p className={styles.fieldValue} title={ord._id}>
                    #{ord._id.slice(-6).toUpperCase()}
                  </p>
                </div>

                <div className={styles.infoCol}>
                  <p className={styles.fieldLabel}>Order Date</p>
                  <p className={styles.fieldValue}>
                    {formatDate(ord.createdAt)}
                  </p>
                </div>

                <div className={styles.infoCol}>
                  <p className={styles.fieldLabel}>Total Amount</p>
                  <p className={styles.fieldValue}>₹ {ord.totalAmount}</p>
                </div>

                <div className={styles.infoCol}>
                  <p className={styles.fieldLabel}>Order Status</p>
                  <p
                    className={`${styles.fieldValue} ${getOrderStatusClass(
                      ord.orderStatus
                    )}`}
                  >
                    {ord.orderStatus
                      ? ord.orderStatus.charAt(0).toUpperCase() +
                        ord.orderStatus.slice(1)
                      : "Placed"}
                  </p>
                </div>

                <div className={styles.infoCol}>
                  <p className={styles.fieldLabel}>Payment</p>
                  <p
                    className={`${styles.fieldValue} ${
                      isPaid ? styles.statusPaid : styles.statusUnpaid
                    }`}
                  >
                    {isPaid ? "Paid" : "Unpaid"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>No recent orders yet</div>
      )}
    </div>
  );
}

