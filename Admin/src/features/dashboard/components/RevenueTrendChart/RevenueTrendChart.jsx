import { Loader2 } from "lucide-react";
import { MONTH_NAMES } from "../../hooks/useDashboard";
import styles from "./RevenueTrendChart.module.css";

function formatRevenue(amount) {
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return `${amount}`;
}

export default function RevenueTrendChart({
  monthlyRevenue,
  maxRevenue,
  totalRevenueThisYear,
  loading,
}) {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Total Revenue This Year</h2>
      </div>
      <p className={styles.sectionSubtitle}>Revenue Generated Monthly by Year</p>

      <div className={styles.chartBox}>
        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 className={styles.spinner} size={24} />
          </div>
        ) : (
          <>
            <div className={styles.chartBarsWrapper}>
              <svg
                className={styles.chartSvg}
                viewBox="0 0 600 170"
                preserveAspectRatio="none"
              >
                {MONTH_NAMES.map((monthName, index) => {
                  const rev = monthlyRevenue[index] || 0;
                  const barHeight =
                    rev > 0
                      ? Math.max(Math.round((rev / maxRevenue) * 140), 10)
                      : 4;
                  const x = index * 50 + 13;
                  const y = 170 - barHeight;

                  return (
                    <rect
                      key={monthName}
                      x={x}
                      y={y}
                      width={24}
                      height={barHeight}
                      rx={4}
                      className={styles.barRect}
                    >
                      <title>{`${monthName}: ₹${formatRevenue(rev)}`}</title>
                    </rect>
                  );
                })}
              </svg>
            </div>
            <div className={styles.chartLabelsWrapper}>
              {MONTH_NAMES.map((monthName) => (
                <span key={monthName} className={styles.chartMonthLabel}>
                  {monthName}
                </span>
              ))}
            </div>
            {totalRevenueThisYear === 0 && (
              <p className={styles.chartEmptyNote}>
                No revenue trends recorded yet
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
