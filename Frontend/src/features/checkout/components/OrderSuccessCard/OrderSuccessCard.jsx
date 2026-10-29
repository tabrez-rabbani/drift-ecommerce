import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import styles from "./OrderSuccessCard.module.css";

export default function OrderSuccessCard({ order }) {
  const isCod = order?.paymentMethod === "cod";
  const isDirect = order?.paymentMethod === "direct";

  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <Check size={36} strokeWidth={2.5} />
      </div>
      <h1 className={styles.title}>
        {isDirect ? "Order Request Received!" : "Order Placed Successfully!"}
      </h1>
      <p className={styles.subtitle}>
        {isCod
          ? "Thank you for your order! Your Cash on Delivery request is confirmed. Please keep cash ready when the delivery arrives at your doorstep."
          : isDirect
          ? "Thank you for your order request! Our concierge team will reach out directly to your phone/WhatsApp to coordinate payment & delivery."
          : "Thank you for your purchase! We have verified your online payment with Razorpay and are preparing your order for shipment."}
      </p>
      <div className={styles.badge}>
        Order ID: #{(order?._id || order?.id || "").slice(-8).toUpperCase()}
        {isCod && " • [ Cash on Delivery ]"}
        {isDirect && " • [ Direct Contact ]"}
        {!isCod && !isDirect && " • [ Online Paid ]"}
      </div>
      <div className={styles.actions}>
        <Link to="/collection" className={styles.continueBtn}>
          Continue Shopping
        </Link>
        <Link to="/" className={styles.homeBtn}>
          Return Home
        </Link>
      </div>
    </div>
  );
}

