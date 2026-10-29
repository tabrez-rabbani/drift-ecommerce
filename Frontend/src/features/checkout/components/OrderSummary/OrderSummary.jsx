import { Lock } from "lucide-react";
import styles from "./OrderSummary.module.css";

export default function OrderSummary({
  items,
  subtotal,
  deliveryCharge,
  total,
  serverError,
  isPlacingOrder,
  paymentMethod,
  handlePlaceOrder,
}) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Order Summary</h3>

      <div className={styles.itemsList}>
        {items.map((item) => (
          <div
            key={`${item.id}-${item.color}-${item.size}`}
            className={styles.itemRow}
          >
            <div className={styles.imageWrap}>
              <img
                src={item.image}
                alt={item.title}
                className={styles.image}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className={styles.itemDetails}>
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.itemMeta}>
                {item.color} / {item.size} × {item.quantity}
              </p>
            </div>
            <span className={styles.itemPrice}>
              ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.costTable}>
        <div className={styles.costRow}>
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className={styles.costRow}>
          <span>Delivery Charges</span>
          <span>
            {deliveryCharge === 0 ? (
              <span className={styles.freeTag}>FREE</span>
            ) : (
              `₹${deliveryCharge}`
            )}
          </span>
        </div>
        <div className={styles.totalRow}>
          <span>Total Amount</span>
          <span>₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {serverError && <div className={styles.serverError}>{serverError}</div>}

      <button
        type="button"
        className={styles.placeBtn}
        onClick={handlePlaceOrder}
        disabled={isPlacingOrder}
      >
        {isPlacingOrder
          ? "Processing..."
          : paymentMethod === "online"
          ? `Proceed to Pay (₹${total.toLocaleString("en-IN")})`
          : "Place Order"}
      </button>

      <div className={styles.securityNote}>
        <Lock size={14} strokeWidth={2} />
        <span>100% Secure Checkout Guarantee</span>
      </div>
    </div>
  );
}

