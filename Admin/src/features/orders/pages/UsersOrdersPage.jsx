import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "../hooks/useOrders";
import OrderDetailsModal from "../components/OrderDetailsModal/OrderDetailsModal";
import { Pagination } from "@/components/ui";
import styles from "./UsersOrdersPage.module.css";

const STATUS_TABS = [
  { value: "all", label: "All Orders" },
  { value: "placed", label: "Placed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='100%' height='100%' fill='%23111111'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10' font-family='sans-serif'>No Img</text></svg>";

export default function UsersOrdersPage() {
  const {
    orders,
    total,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    loading,
    updatingId,
    updateStatus,
  } = useOrders();

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

  const handleCancelOrder = (order) => {
    if (order.orderStatus === "cancelled") {
      toast.info("This order is already cancelled.");
      return;
    }

    toast(`Cancel order #${order._id.slice(-6).toUpperCase()}?`, {
      description: `Customer: ${order.shippingAddress?.fullName || "User"}. Amount: ₹${order.totalAmount}`,
      action: {
        label: "Cancel Order",
        onClick: () => updateStatus(order._id, "cancelled"),
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
      case "completed":
        return styles.badgeDelivered;
      case "cancelled":
      case "failed":
        return styles.badgeCancelled;
      case "shipped":
        return styles.badgeShipped;
      case "processing":
        return styles.badgeProcessing;
      default:
        return styles.badgePlaced;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleLine} />
            <h2 className={styles.title}>Users Orders</h2>
          </div>
          <div className={styles.statsPill}>
            <span>Total Orders:</span>
            <span className={styles.statsCount}>{total}</span>
          </div>
        </div>

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
              placeholder="Search customer, email, order ID..."
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID &amp; Date</th>
                <th>Customer</th>
                <th>Items Preview</th>
                <th>Total Price</th>
                <th>Payment</th>
                <th>Order Status</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
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
                        <div className={styles.paymentMethodTag}>
                          {order.paymentMethod || "online"}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${getStatusBadgeClass(
                            order.paymentStatus || "pending"
                          )}`}
                        >
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>

                      <td>
                        <select
                          className={styles.statusSelect}
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          disabled={updatingId === order._id}
                        >
                          <option value="placed">Placed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
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
                          <button
                            type="button"
                            className={styles.iconBtnCancel}
                            onClick={() => handleCancelOrder(order)}
                            title="Cancel Order"
                            disabled={order.orderStatus === "cancelled"}
                          >
                            <Trash2 size={18} />
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
            onStatusUpdated={(orderId, newStatus) => {
              updateStatus(orderId, newStatus);
            }}
          />
        )}
      </div>
    </div>
  );
}
