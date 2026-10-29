import { useState } from "react";
import { Eye } from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import OrderDetailsModal from "../components/OrderDetailsModal/OrderDetailsModal";
import { AdminCard, AdminTable, Pagination, StatusBadge, SearchInput } from "@/components/ui";
import styles from "./CancelledOrdersPage.module.css";

const TABLE_COLUMNS = [
  "Order ID & Date",
  "Customer",
  "Items Cancelled",
  "Order Amount",
  "Payment Mode",
  "Status",
  "Option",
];

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='100%' height='100%' fill='%231f2228'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10' font-family='sans-serif'>No Img</text></svg>";

export default function CancelledOrdersPage() {
  const {
    orders,
    total,
    page,
    setPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    loading,
    refreshOrders,
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

  const cardActions = (
    <div className={styles.statsPill}>
      <span>Total Cancelled:</span>
      <span className={styles.statsCount}>{total}</span>
    </div>
  );

  return (
    <AdminCard title="Cancelled Orders" actions={cardActions}>
      <div className={styles.filterRow}>
        <SearchInput
          id="cancelled-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer, email, order ID..."
        />
      </div>

      <AdminTable
        columns={TABLE_COLUMNS}
        isLoading={loading}
        loadingText="Loading cancelled orders..."
        isEmpty={orders.length === 0}
        emptyMessage={
          searchQuery
            ? "No cancelled orders match your search."
            : "No cancelled orders recorded."
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
              </td>

              <td>
                <div className={styles.paymentMode}>{order.paymentMethod || "online"}</div>
                <StatusBadge
                  status={order.paymentStatus === "completed" ? "Refund Pending" : order.paymentStatus || "failed"}
                  variant={order.paymentStatus === "completed" ? "amber" : "red"}
                />
              </td>

              <td>
                <StatusBadge status="cancelled" variant="red" />
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
          onStatusUpdated={() => {
            refreshOrders();
          }}
        />
      )}
    </AdminCard>
  );
}
