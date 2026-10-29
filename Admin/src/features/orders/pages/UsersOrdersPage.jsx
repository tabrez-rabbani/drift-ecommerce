import { useState } from "react";
import { Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useOrders } from "../hooks/useOrders";
import OrderDetailsModal from "../components/OrderDetailsModal/OrderDetailsModal";
import { AdminCard, AdminTable, Pagination, StatusBadge, SearchInput } from "@/components/ui";
import styles from "./UsersOrdersPage.module.css";

const STATUS_TABS = [
  { value: "all", label: "All Orders" },
  { value: "placed", label: "Placed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const TABLE_COLUMNS = [
  "Order ID & Date",
  "Customer",
  "Items Preview",
  "Total Price",
  "Payment",
  "Order Status",
  "Option",
];

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='100%' height='100%' fill='%231f2228'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10' font-family='sans-serif'>No Img</text></svg>";

export default function UsersOrdersPage() {
  const {
    orders,
    total,
    page,
    setPage,
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

  const cardActions = (
    <div className={styles.statsPill}>
      <span>Total Orders:</span>
      <span className={styles.statsCount}>{total}</span>
    </div>
  );

  return (
    <AdminCard title="Users Orders" actions={cardActions}>
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

        <SearchInput
          id="order-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer, email, order ID..."
        />
      </div>

      <AdminTable
        columns={TABLE_COLUMNS}
        isLoading={loading}
        loadingText="Loading orders..."
        isEmpty={orders.length === 0}
        emptyMessage={
          searchQuery || statusFilter !== "all"
            ? "No orders match your filter criteria."
            : "No customer orders placed yet."
        }
      >
        {orders.map((order) => {
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
                <StatusBadge status={order.paymentStatus || "pending"} />
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
                    <XCircle size={18} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
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
    </AdminCard>
  );
}
