import { useState } from "react";
import { X, CheckCircle2, Clock, Truck, Package, XCircle } from "lucide-react";
import authApiInstance from "@/lib/axios";
import { toast } from "sonner";
import styles from "./OrderDetailsModal.module.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='100%' height='100%' fill='%231f2228'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10' font-family='sans-serif'>No Img</text></svg>";

const STATUS_OPTIONS = [
  { value: "placed", label: "Placed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderDetailsModal({ order, onClose, onStatusUpdated }) {
  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "placed");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "-"
      : d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === order.orderStatus) {
      toast.info("Status is already " + selectedStatus);
      return;
    }

    try {
      setIsUpdating(true);
      const res = await authApiInstance.patch(`/admin/orders/${order._id}/status`, {
        status: selectedStatus,
      });

      if (res.data?.success) {
        toast.success(res.data.message || `Order status updated to "${selectedStatus}"`);
        if (onStatusUpdated) {
          onStatusUpdated(order._id, selectedStatus);
        }
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const shipping = order.shippingAddress || {};

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.titleLine}></div>
            <h3 className={styles.title}>Order Details</h3>
            <span className={styles.orderId}>#{order._id}</span>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Quick Status Updater */}
          <div className={styles.statusUpdateCard}>
            <div className={styles.statusUpdateLeft}>
              <p className={styles.statusUpdateLabel}>Current Order Status</p>
              <p className={styles.statusUpdateHelp}>
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className={styles.statusControls}>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={styles.statusSelect}
                disabled={isUpdating}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={styles.updateBtn}
                onClick={handleUpdateStatus}
                disabled={isUpdating || selectedStatus === order.orderStatus}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>

          {/* Customer & Shipping 2-Col Grid */}
          <div className={styles.grid2}>
            {/* Customer Info */}
            <div className={styles.infoCard}>
              <h4 className={styles.infoCardTitle}>Customer Information</h4>
              <p className={styles.infoLine}>
                <strong>Name:</strong> {shipping.fullName || order.user?.name || "Customer"}
              </p>
              <p className={styles.infoLine}>
                <strong>Email:</strong> {shipping.email || order.user?.email || "N/A"}
              </p>
              <p className={styles.infoLine}>
                <strong>Phone:</strong> {shipping.phone || "N/A"}
              </p>
            </div>

            {/* Shipping Address */}
            <div className={styles.infoCard}>
              <h4 className={styles.infoCardTitle}>Shipping Address</h4>
              <p className={styles.infoLine}>{shipping.streetAddress || "-"}</p>
              <p className={styles.infoLine}>
                {shipping.city || "-"}, {shipping.state || "-"} {shipping.postalCode ? `- ${shipping.postalCode}` : ""}
              </p>
              <p className={styles.infoLineMuted}>{shipping.country || "India"}</p>
            </div>
          </div>

          {/* Payment & Financial Info */}
          <div className={styles.infoCard}>
            <h4 className={styles.infoCardTitle}>Payment & Delivery Details</h4>
            <div className={styles.grid2}>
              <div>
                <p className={styles.infoLine}>
                  <strong>Payment Method:</strong>{" "}
                  <span style={{ textTransform: "uppercase" }}>{order.paymentMethod || "online"}</span>
                </p>
                <p className={styles.infoLine}>
                  <strong>Payment Status:</strong>{" "}
                  <span style={{ textTransform: "capitalize", color: order.paymentStatus === "completed" ? "#409852" : "#ea565f" }}>
                    {order.paymentStatus || "pending"}
                  </span>
                </p>
              </div>
              <div>
                <p className={styles.infoLine}>
                  <strong>Order Status:</strong>{" "}
                  <span style={{ textTransform: "capitalize", color: "#02a9f7" }}>
                    {order.orderStatus}
                  </span>
                </p>
                <p className={styles.infoLine}>
                  <strong>Currency:</strong> {order.currency || "INR"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div>
            <h4 className={styles.sectionTitle}>
              Ordered Items ({order.items?.length || 0})
            </h4>
            <div style={{ overflowX: "auto" }}>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => {
                    const itemPrice = item.price?.amount || 0;
                    const itemTotal = itemPrice * (item.quantity || 1);
                    return (
                      <tr key={idx}>
                        <td>
                          <div className={styles.productCell}>
                            <img
                              src={item.image || FALLBACK_IMAGE}
                              alt={item.title}
                              className={styles.productThumb}
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_IMAGE;
                              }}
                            />
                            <div className={styles.productMeta}>
                              <p className={styles.productName}>{item.title}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ textTransform: "capitalize" }}>{item.color || "-"}</td>
                        <td style={{ textTransform: "uppercase" }}>{item.size || "-"}</td>
                        <td>₹{itemPrice}</td>
                        <td>{item.quantity}</td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>₹{itemTotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary */}
          <div className={styles.totalsCard}>
            <div className={styles.totalsRow}>
              <span>Subtotal:</span>
              <span>₹{order.subtotal || order.totalAmount}</span>
            </div>
            <div className={styles.totalsRow}>
              <span>Delivery Fee:</span>
              <span>₹{order.deliveryCharge || 0}</span>
            </div>
            <div className={styles.totalsRowBold}>
              <span>Grand Total:</span>
              <span className={styles.totalsPrice}>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
