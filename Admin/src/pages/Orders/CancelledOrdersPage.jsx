import { useState, useEffect, useCallback } from "react";
import authApiInstance from "@/lib/axios";
import { Eye, Search } from "lucide-react";
import { toast } from "sonner";
import OrderDetailsModal from "./components/OrderDetailsModal/OrderDetailsModal";
import styles from "./Orders.module.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='100%' height='100%' fill='%231f2228'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10' font-family='sans-serif'>No Img</text></svg>";

export default function CancelledOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchCancelledOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: 15,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const res = await authApiInstance.get("/admin/orders/cancelled", { params });
      if (res.data?.success) {
        setOrders(res.data.orders || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch cancelled orders");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchCancelledOrders();
  }, [fetchCancelledOrders]);

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
        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleLine}></div>
            <h2 className={styles.title}>Cancelled Orders</h2>
          </div>
          <div className={styles.statsPill}>
            <span>Total Cancelled:</span>
            <span className={styles.statsCount}>{total}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className={styles.filterRow}>
          <div></div>
          <div className={styles.searchGroup}>
            <label htmlFor="cancelled-search" className={styles.searchLabel}>
              Search:
            </label>
            <input
              id="cancelled-search"
              type="text"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, email, order ID..."
            />
          </div>
        </div>

        {/* Cancelled Orders Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID & Date</th>
                <th>Customer</th>
                <th>Items Cancelled</th>
                <th>Order Amount</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
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
                      {/* Order ID & Date */}
                      <td>
                        <p className={styles.orderId} title={order._id}>
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className={styles.orderDate}>{formatDate(order.createdAt)}</p>
                      </td>

                      {/* Customer */}
                      <td>
                        <p className={styles.customerName}>
                          {shipping.fullName || order.user?.name || "Customer"}
                        </p>
                        <p className={styles.customerContact}>
                          {shipping.email || order.user?.email || shipping.phone || "-"}
                        </p>
                      </td>

                      {/* Items Preview */}
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

                      {/* Total Price */}
                      <td>
                        <span className={styles.price}>₹{order.totalAmount}</span>
                      </td>

                      {/* Payment Mode */}
                      <td>
                        <span style={{ textTransform: "uppercase", fontSize: 13, color: "#a0a5b1" }}>
                          {order.paymentMethod || "online"}
                        </span>
                        <div style={{ marginTop: 4 }}>
                          <span
                            className={`${styles.badge} ${
                              order.paymentStatus === "completed"
                                ? styles.badgeCompleted
                                : styles.badgeFailed
                            }`}
                          >
                            {order.paymentStatus === "completed" ? "Refund Pending" : order.paymentStatus || "failed"}
                          </span>
                        </div>
                      </td>

                      {/* Cancelled Badge */}
                      <td>
                        <span className={`${styles.badge} ${styles.badgeCancelled}`}>
                          Cancelled
                        </span>
                      </td>

                      {/* Option */}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <span>
              Page {page} of {totalPages} ({total} total)
            </span>
            <div className={styles.pageControls}>
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={() => {
            fetchCancelledOrders();
          }}
        />
      )}
    </div>
  );
}
