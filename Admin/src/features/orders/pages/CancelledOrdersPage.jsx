import { useState } from "react";
import { Eye } from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import OrderDetailsModal from "../components/OrderDetailsModal/OrderDetailsModal";
import { Pagination } from "@/components/ui";
import styles from "./CancelledOrdersPage.module.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='100%' height='100%' fill='%23111111'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10' font-family='sans-serif'>No Img</text></svg>";

export default function CancelledOrdersPage() {
  const {
    orders,
    total,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    searchQuery,
    setSearchQuery,
    loading,
  } = useOrders({ isCancelledOnly: true });

  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "-"
      : d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleLine} />
            <h2 className={styles.title}>Cancelled Orders</h2>
          </div>
          <div className={styles.statsPill}>
            <span>Total Cancelled:</span>
            <span className={styles.statsCount}>{total}</span>
          </div>
        </div>

        <div className={styles.filterRow}>
          <label htmlFor="cancelled-search" className={styles.searchLabel}>
            Search:
          </label>
          <input
            id="cancelled-search"
            type="text"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, email, order ID..."
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID &amp; Date</th>
                <th>Customer</th>
                <th>Items Cancelled</th>
                <th>Order Amount</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Loading cancelled orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    {searchQuery
                      ? "No cancelled orders match your search."
                      : "No cancelled orders recorded."}
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const shipping = order.shippingAddress || {};
                  const itemCount = order.items?.length || 0;
                  const firstItems = (order.items || []).slice(0, 3);

                  return (
                    <tr key={order._id}>
                      <td>
                        <p className={styles.orderId} title={order._id}>
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className={styles.orderDate}>{formatDate(order.createdAt)}</p>
                      </td>

                      <td>
                        <p className={styles.customerName}>
                          {shipping.fullName || order.user?.name || "Customer"}
                        </p>
                        <p className={styles.customerContact}>
                          {shipping.email || order.user?.email || shipping.phone || "-"}
                        </p>
                      </td>

                      <td>
                        <div className={styles.itemsSummary}>
                          <div className={styles.itemThumbnails}>
                            {firstItems.map((item, idx) => (
                              <img
                                key={idx}
                                src={item.image || FALLBACK_IMAGE}
                                alt={item.title || "Item"}
                                className={styles.itemThumb}
                                title={`${item.title} (${item.color}, ${item.size})`}
                                onError={(e) => {
                                  e.currentTarget.src = FALLBACK_IMAGE;
                                }}
                              />
                            ))}
                          </div>
                          {itemCount > 1 && (
                            <span className={styles.itemCountBadge}>+{itemCount}</span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className={styles.price}>₹{order.totalAmount}</span>
                      </td>

                      <td>
                        <p className={styles.paymentMode}>
                          {order.paymentMethod || "online"}
                        </p>
                      </td>

                      <td>
                        <span className={`${styles.statusText} ${styles.statusCancelled}`}>
                          Cancelled
                        </span>
                      </td>

                      <td>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={styles.iconBtnView}
                            onClick={() => setSelectedOrder(order)}
                            title="View Full Order Details"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
        />

        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusUpdated={() => {}}
          />
        )}
      </div>
    </div>
  );
}
