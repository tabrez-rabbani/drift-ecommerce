import { Link } from "react-router-dom";
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import styles from "./OrderStatusBanner.module.css";

export default function OrderStatusBanner({
  orderStatusBreakdown,
  totalOrders,
  loading,
}) {
  const breakdown = orderStatusBreakdown || {
    placed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  const placed = breakdown.placed || 0;
  const processing = breakdown.processing || 0;
  const shipped = breakdown.shipped || 0;
  const delivered = breakdown.delivered || 0;
  const cancelled = breakdown.cancelled || 0;

  const totalCalculated = placed + processing + shipped + delivered + cancelled;
  const total = totalCalculated > 0 ? totalCalculated : totalOrders || 0;

  const wDelivered = total > 0 ? (delivered / total) * 1000 : 0;
  const wShipped = total > 0 ? (shipped / total) * 1000 : 0;
  const wProcessing = total > 0 ? (processing / total) * 1000 : 0;
  const wPlaced = total > 0 ? (placed / total) * 1000 : 0;
  const wCancelled = total > 0 ? (cancelled / total) * 1000 : 0;

  const xDelivered = 0;
  const xShipped = xDelivered + wDelivered;
  const xProcessing = xShipped + wShipped;
  const xPlaced = xProcessing + wProcessing;
  const xCancelled = xPlaced + wPlaced;

  return (
    <div className={styles.bannerCard}>
      <div className={styles.bannerHeader}>
        <div className={styles.titleWrap}>
          <h2 className={styles.bannerTitle}>Order Status Breakdown</h2>
          <span className={styles.totalBadge}>
            {loading ? "..." : `${total} Total Orders`}
          </span>
        </div>
        <Link to="/admin/orders/users-orders" className={styles.viewAllLink}>
          Manage Orders
          <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className={styles.loadingWrap}>
          <Loader2 className={styles.spinner} size={20} />
        </div>
      ) : (
        <>
          <div className={styles.stagesRow}>
            <Link
              to="/admin/orders/users-orders"
              className={`${styles.stagePill} ${styles.pillPlaced}`}
            >
              <div className={styles.stageIconWrap}>
                <Clock size={16} />
              </div>
              <div className={styles.stageTextWrap}>
                <span className={styles.stageLabel}>Placed</span>
                <span className={styles.stageCount}>{placed}</span>
              </div>
            </Link>

            <Link
              to="/admin/orders/users-orders"
              className={`${styles.stagePill} ${styles.pillProcessing}`}
            >
              <div className={styles.stageIconWrap}>
                <Package size={16} />
              </div>
              <div className={styles.stageTextWrap}>
                <span className={styles.stageLabel}>Processing</span>
                <span className={styles.stageCount}>{processing}</span>
              </div>
            </Link>

            <Link
              to="/admin/orders/users-orders"
              className={`${styles.stagePill} ${styles.pillShipped}`}
            >
              <div className={styles.stageIconWrap}>
                <Truck size={16} />
              </div>
              <div className={styles.stageTextWrap}>
                <span className={styles.stageLabel}>Shipped</span>
                <span className={styles.stageCount}>{shipped}</span>
              </div>
            </Link>

            <Link
              to="/admin/orders/users-orders"
              className={`${styles.stagePill} ${styles.pillDelivered}`}
            >
              <div className={styles.stageIconWrap}>
                <CheckCircle2 size={16} />
              </div>
              <div className={styles.stageTextWrap}>
                <span className={styles.stageLabel}>Delivered</span>
                <span className={styles.stageCount}>{delivered}</span>
              </div>
            </Link>

            <Link
              to="/admin/orders/cancel-orders"
              className={`${styles.stagePill} ${styles.pillCancelled}`}
            >
              <div className={styles.stageIconWrap}>
                <XCircle size={16} />
              </div>
              <div className={styles.stageTextWrap}>
                <span className={styles.stageLabel}>Cancelled</span>
                <span className={styles.stageCount}>{cancelled}</span>
              </div>
            </Link>
          </div>

          <div className={styles.progressBarWrapper}>
            <svg
              className={styles.progressBarSvg}
              viewBox="0 0 1000 6"
              preserveAspectRatio="none"
            >
              <rect
                x={0}
                y={0}
                width={1000}
                height={6}
                rx={3}
                className={styles.trackBackground}
              />
              {wDelivered > 0 && (
                <rect
                  x={xDelivered}
                  y={0}
                  width={wDelivered}
                  height={6}
                  className={styles.barDelivered}
                />
              )}
              {wShipped > 0 && (
                <rect
                  x={xShipped}
                  y={0}
                  width={wShipped}
                  height={6}
                  className={styles.barShipped}
                />
              )}
              {wProcessing > 0 && (
                <rect
                  x={xProcessing}
                  y={0}
                  width={wProcessing}
                  height={6}
                  className={styles.barProcessing}
                />
              )}
              {wPlaced > 0 && (
                <rect
                  x={xPlaced}
                  y={0}
                  width={wPlaced}
                  height={6}
                  className={styles.barPlaced}
                />
              )}
              {wCancelled > 0 && (
                <rect
                  x={xCancelled}
                  y={0}
                  width={wCancelled}
                  height={6}
                  className={styles.barCancelled}
                />
              )}
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
