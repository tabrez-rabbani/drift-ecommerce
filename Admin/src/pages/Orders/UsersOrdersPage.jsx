import { useState, useEffect, useCallback } from "react";
import authApiInstance from "@/lib/axios";
import { Eye, XCircle, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import OrderDetailsModal from "./components/OrderDetailsModal/OrderDetailsModal";
import styles from "./Orders.module.css";

const STATUS_TABS = [
  { value: "all", label: "All Orders" },
  { value: "placed", label: "Placed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='100%' height='100%' fill='%231f2228'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10' font-family='sans-serif'>No Img</text></svg>";

export default function UsersOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: 15,
      };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const res = await authApiInstance.get("/admin/orders", { params });
      if (res.data?.success) {
        setOrders(res.data.orders || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await authApiInstance.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });

      if (res.data?.success) {
        toast.success(`Order status changed to "${newStatus}"`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = (order) => {
    if (order.orderStatus === "cancelled") {
      toast.info("This order is already cancelled.");
      return;
    }

    toast(`Cancel order #${order._id.slice(-6).toUpperCase()}?`, {
      description: `Customer: ${order.shippingAddress?.fullName || "User"}. Amount: ₹${order.totalAmount}`,
      action: {
        label: "Cancel Order",
        onClick: async () => {
          await handleStatusChange(order._id, "cancelled");
        },
      },
      cancel: {
        label: "Back",
        onClick: () => {},
      },
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return styles.badgeDelivered;
      case "shipped":
        return styles.badgeShipped;
      case "processing":
        return styles.badgeProcessing;
      case "cancelled":
        return styles.badgeCancelled;
      case "placed":
      default:
        return styles.badgePlaced;
    }
  };

  const getPaymentBadgeClass = (status) => {
    if (status === "completed") return styles.badgeCompleted;
    if (status === "failed") return styles.badgeFailed;
    return styles.badgePending;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleLine}></div>
            <h2 className={styles.title}>Users Orders</h2>
          </div>
          <div className={styles.statsPill}>
            <span>Total Orders:</span>
            <span className={styles.statsCount}>{total}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className={styles.filterRow}>
          <div className={styles.statusFilterTabs}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`${styles.filterTab} ${statusFilter === tab.value ? styles.filterTabActive : ""}`}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.searchGroup}>
            <label htmlFor="order-search" className={styles.searchLabel}>
              Search:
            </label>
            <input
              id="order-search"
              type="text"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, email, order ID..."
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID & Date</th>
                <th>Customer</th>
                <th>Items Preview</th>
                <th>Total Price</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    {searchQuery || statusFilter !== "all"
                      ? "No orders match your filter criteria."
                      : "No customer orders placed yet."}
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
                        <div className={styles.paymentMethodTag}>
                          {order.paymentMethod || "online"}
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td>
                        <span
                          className={`${styles.badge} ${getPaymentBadgeClass(order.paymentStatus)}`}
                        >
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>

                      {/* Order Status Selector */}
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingOrderId === order._id}
                        >
                          <option value="placed">Placed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Option / Actions */}
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
                          <button
                            type="button"
                            className={styles.iconBtnCancel}
                            onClick={() => handleCancelOrder(order)}
                            title="Cancel Order"
                            disabled={order.orderStatus === "cancelled"}
                          >
                            <XCircle size={18} />
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
          onStatusUpdated={(orderId, newStatus) => {
            setOrders((prev) =>
              prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
            );
          }}
        />
      )}
    </div>
  );
}
