import {
  ClipboardList,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import styles from "./OrdersTab.module.css";

const TRACKING_STEPS = ["placed", "processing", "shipped", "delivered"];

function getStepIcon(step, isActive, isCompleted) {
  const size = 17;
  const color = isCompleted || isActive ? "#000000" : "#94a3b8";
  switch (step) {
    case "placed":     return <ClipboardList size={size} color={color} />;
    case "processing": return <Package size={size} color={color} />;
    case "shipped":    return <Truck size={size} color={color} />;
    case "delivered":  return <CheckCircle2 size={size} color={color} />;
    default:           return null;
  }
}

function StatusBadge({ status }) {
  const map = {
    delivered: styles.statusDelivered,
    processing: styles.statusProcessing,
    shipped: styles.statusProcessing,
    cancelled: styles.statusCancelled,
    placed: styles.statusPlaced,
  };
  const cls = map[(status || "placed").toLowerCase()] || styles.statusPlaced;
  return (
    <span className={`${styles.badge} ${cls}`}>
      {status || "Placed"}
    </span>
  );
}

export default function OrdersTab({
  orders,
  loading,
  expandedOrderId,
  cancellingOrderId,
  onToggleOrder,
  onCancelOrder,
  formatDate,
  getTrackingStepIndex,
}) {
  const orderList = Array.isArray(orders) ? orders : [];
  const selectedOrder = orderList.find((o) => o._id === expandedOrderId);

  return (
    <div className={styles.root}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>My Orders</h2>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>Order #</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <tr key={i} className={styles.skeletonRow}>
                  <td><div className={`${styles.skel} ${styles.skelNo}`} /></td>
                  <td><div className={`${styles.skel} ${styles.skelOrder}`} /></td>
                  <td><div className={`${styles.skel} ${styles.skelDate}`} /></td>
                  <td><div className={`${styles.skel} ${styles.skelAmount}`} /></td>
                  <td><div className={`${styles.skel} ${styles.skelStatus}`} /></td>
                  <td><div className={`${styles.skel} ${styles.skelAction}`} /></td>
                </tr>
              ))
            ) : orderList.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyMsg}>
                  No orders found
                </td>
              </tr>
            ) : (
              orderList.map((order, idx) => (
                <tr
                  key={order._id}
                  className={expandedOrderId === order._id ? styles.activeRow : ""}
                >
                  <td>{idx + 1}</td>
                  <td>
                    <strong>#{String(order._id || order.id || "").slice(-8).toUpperCase() || "ORDER"}</strong>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <strong>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</strong>
                  </td>
                  <td>
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.viewBtn}
                      onClick={() => onToggleOrder(order._id)}
                    >
                      {expandedOrderId === order._id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Expanded Order Detail */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          cancellingOrderId={cancellingOrderId}
          onCancelOrder={onCancelOrder}
          formatDate={formatDate}
          getTrackingStepIndex={getTrackingStepIndex}
        />
      )}
    </div>
  );
}

function OrderDetail({ order, cancellingOrderId, onCancelOrder, formatDate, getTrackingStepIndex }) {
  const normalizedStatus = (order.orderStatus || "").toLowerCase().trim();
  const isCancelled = normalizedStatus === "cancelled";
  const currentStepIdx = getTrackingStepIndex(normalizedStatus);
  const canCancel = ["placed", "processing"].includes(normalizedStatus);
  const isCancelling = cancellingOrderId === order._id;

  return (
    <div className={styles.detailCard}>
      {/* Top row */}
      <div className={styles.detailTop}>
        <h4 className={styles.detailHeading}>
          Order #{String(order._id || order.id || "").slice(-8).toUpperCase() || "ORDER"}
        </h4>
        <span className={styles.detailDate}>{formatDate(order.createdAt)}</span>
      </div>

      {/* Tracking or Cancelled banner */}
      {isCancelled ? (
        <div className={styles.cancelledBanner}>
          <XCircle size={20} />
          <span>This order has been cancelled</span>
        </div>
      ) : (
        <div className={styles.timeline}>
          {TRACKING_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isActive = idx === currentStepIdx;
            return (
              <div
                key={step}
                className={`${styles.timelineStep} ${isCompleted ? styles.stepCompleted : ""} ${isActive ? styles.stepActive : ""}`}
              >
                <div className={styles.timelineDot}>
                  {getStepIcon(step, isActive, isCompleted)}
                </div>
                {idx < TRACKING_STEPS.length - 1 && (
                  <div className={`${styles.timelineLine} ${isCompleted ? styles.lineCompleted : ""}`} />
                )}
                <span className={styles.timelineLabel}>{step}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Payment</span>
          <span className={`${styles.summaryValue} ${styles.summaryPayment}`}>
            {(order.paymentMethod || "").toUpperCase()}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Subtotal</span>
          <span className={styles.summaryValue}>
            ₹{(order.subtotal || 0).toLocaleString("en-IN")}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Delivery</span>
          <span className={styles.summaryValue}>
            {order.deliveryCharge === 0 ? "Free" : `₹${order.deliveryCharge}`}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total</span>
          <span className={`${styles.summaryValue} ${styles.summaryTotal}`}>
            ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className={styles.itemsList}>
        {(order.items || []).map((item, idx) => (
          <div key={idx} className={styles.itemRow}>
            <div className={styles.itemThumb}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title || "Product"}
                  className={styles.itemThumbImg}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
            <div className={styles.itemInfo}>
              <div className={styles.itemTitle}>{item.title}</div>
              <div className={styles.itemMeta}>
                {item.color && `Color: ${item.color}`}
                {item.size && ` · Size: ${item.size}`}
                {` · Qty: ${item.quantity}`}
              </div>
            </div>
            <div className={styles.itemTotal}>
              ₹{(((typeof item.price === "number" ? item.price : item.price?.amount) || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
            </div>
          </div>
        ))}
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div className={styles.shippingAddress}>
          <strong>Shipping: </strong>
          {[
            order.shippingAddress.fullName,
            order.shippingAddress.streetAddress,
            order.shippingAddress.city,
            order.shippingAddress.state,
            order.shippingAddress.postalCode,
          ]
            .filter(Boolean)
            .join(", ")}
          {order.shippingAddress.phone ? ` | Ph: ${order.shippingAddress.phone}` : ""}
        </div>
      )}

      {/* Cancel */}
      {canCancel && (
        <div className={styles.cancelArea}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => onCancelOrder(order._id)}
            disabled={isCancelling}
          >
            <XCircle size={15} />
            <span>{isCancelling ? "Cancelling..." : "Cancel Order"}</span>
          </button>
          <p className={styles.cancelHint}>
            You can cancel this order as it has not been shipped yet.
          </p>
        </div>
      )}
    </div>
  );
}
