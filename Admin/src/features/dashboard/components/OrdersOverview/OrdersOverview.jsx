import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import styles from "./OrdersOverview.module.css";

const RADIUS = 65;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STATUS_CONFIG = [
  { key: "delivered", label: "Delivered", colorClass: styles.colorDelivered },
  { key: "shipped", label: "Shipped", colorClass: styles.colorShipped },
  { key: "processing", label: "Processing", colorClass: styles.colorProcessing },
  { key: "placed", label: "Placed", colorClass: styles.colorPlaced },
  { key: "cancelled", label: "Cancelled", colorClass: styles.colorCancelled },
];

export default function OrdersOverview({ orderStatusBreakdown, totalOrders, loading }) {
  const breakdown = orderStatusBreakdown || {};

  const counts = {
    delivered: breakdown.delivered || 0,
    shipped: breakdown.shipped || 0,
    processing: breakdown.processing || 0,
    placed: breakdown.placed || 0,
    cancelled: breakdown.cancelled || 0,
  };

  const calculatedTotal = Object.values(counts).reduce((acc, c) => acc + c, 0);
  const total = calculatedTotal > 0 ? calculatedTotal : totalOrders || 0;

  let accumulatedOffset = 0;
  const segments = STATUS_CONFIG.map((cfg) => {
    const count = counts[cfg.key];
    const pct = total > 0 ? (count / total) * 100 : 0;
    const strokeLength = total > 0 ? (count / total) * CIRCUMFERENCE : 0;
    const offset = accumulatedOffset;
    accumulatedOffset += strokeLength;

    return {
      ...cfg,
      count,
      pct: Math.round(pct),
      strokeLength,
      offset,
    };
  });

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Orders Overview</h2>
        <Link to="/admin/orders/users-orders" className={styles.actionBtn}>
          View All
          <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className={styles.emptyState}>
          <Loader2 className={styles.spinner} size={24} />
        </div>
      ) : (
        <div className={styles.contentWrap}>
          <div className={styles.donutWrap}>
            <svg
              className={styles.donutSvg}
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r={RADIUS}
                className={styles.trackRing}
                strokeWidth="18"
                fill="none"
              />

              {total > 0 &&
                segments.map((seg) => {
                  if (seg.strokeLength <= 0) return null;
                  return (
                    <circle
                      key={seg.key}
                      cx="100"
                      cy="100"
                      r={RADIUS}
                      fill="none"
                      strokeWidth="18"
                      strokeDasharray={`${seg.strokeLength} ${CIRCUMFERENCE}`}
                      strokeDashoffset={-seg.offset}
                      className={seg.colorClass}
                      transform="rotate(-90 100 100)"
                    />
                  );
                })}

              <text
                x="100"
                y="94"
                textAnchor="middle"
                className={styles.centerNumber}
              >
                {total}
              </text>
              <text
                x="100"
                y="114"
                textAnchor="middle"
                className={styles.centerLabel}
              >
                Total Orders
              </text>
            </svg>
          </div>

          <div className={styles.legendList}>
            {segments.map((seg) => (
              <div key={seg.key} className={styles.legendRow}>
                <div className={styles.legendLabelGroup}>
                  <span className={`${styles.statusDot} ${seg.colorClass}`} />
                  <span className={styles.statusName}>{seg.label}</span>
                </div>
                <div className={styles.legendValueGroup}>
                  <span className={styles.statusCount}>{seg.count}</span>
                  <span className={styles.statusPct}>{seg.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

