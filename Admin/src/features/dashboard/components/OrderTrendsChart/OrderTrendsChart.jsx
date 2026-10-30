import { MONTH_NAMES } from "../../hooks/useDashboard";
import styles from "./OrderTrendsChart.module.css";

export default function OrderTrendsChart({
  monthlyCounts,
  maxOrderCount,
  totalOrdersThisYear,
  loading,
}) {
  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Total Orders This Year</h2>
      </div>
      <p className={styles.sectionSubtitle}>Orders Created Monthly by Year</p>

      <div className={styles.chartBox}>
        <div className={styles.chartBarsWrapper}>
          <svg
            className={styles.chartSvg}
            viewBox="0 0 600 170"
            preserveAspectRatio="none"
          >
            {MONTH_NAMES.map((monthName, index) => {
              const count = monthlyCounts[index];
              const barHeight =
                count > 0
                  ? Math.max(Math.round((count / maxOrderCount) * 140), 10)
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
                  <title>{`${monthName}: ${count} orders`}</title>
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
        {!loading && totalOrdersThisYear === 0 && (
          <p className={styles.chartEmptyNote}>No order trends available yet</p>
        )}
      </div>
    </div>
  );
}

