import styles from "./PaymentCard.module.css";

const PAYMENT_METHODS = [
  {
    value: "online",
    label: "Online Payment",
    desc: "UPI, Debit/Credit Card, Net Banking",
  },
  {
    value: "cod",
    label: "Cash on Delivery (COD)",
    desc: "Pay in cash when order arrives at your doorstep",
  },
  {
    value: "direct",
    label: "By Direct Contact",
    desc: "Direct coordination with our team",
  },
];

export default function PaymentCard({ paymentMethod, setPaymentMethod }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        <span className={styles.accent} />
        Payment Method
      </h3>
      <div className={styles.options}>
        {PAYMENT_METHODS.map((opt) => (
          <label key={opt.value} className={styles.option}>
            <input
              type="radio"
              name="payment"
              value={opt.value}
              checked={paymentMethod === opt.value}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className={styles.radio} />
            <div className={styles.labelWrap}>
              <span className={styles.label}>{opt.label}</span>
              <span className={styles.desc}>{opt.desc}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

