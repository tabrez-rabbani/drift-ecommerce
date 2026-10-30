import { useDashboard } from "../hooks/useDashboard";
import StatCards from "../components/StatCards/StatCards";
import OrderTrendsChart from "../components/OrderTrendsChart/OrderTrendsChart";
import BestSellingList from "../components/BestSellingList/BestSellingList";
import RecentProductsList from "../components/RecentProductsList/RecentProductsList";
import RecentOrdersList from "../components/RecentOrdersList/RecentOrdersList";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const {
    stats,
    loading,
    monthlyCounts,
    maxOrderCount,
    totalOrdersThisYear,
  } = useDashboard();

  return (
    <div className={styles.container}>
      <StatCards stats={stats} loading={loading} />

      <div className={styles.showcaseGrid}>
        <OrderTrendsChart
          monthlyCounts={monthlyCounts}
          maxOrderCount={maxOrderCount}
          totalOrdersThisYear={totalOrdersThisYear}
          loading={loading}
        />
        <BestSellingList
          bestSellingProducts={stats.bestSellingProducts}
          loading={loading}
        />
      </div>

      <div className={styles.showcaseGrid}>
        <RecentProductsList
          recentProducts={stats.recentProducts}
          loading={loading}
        />
        <RecentOrdersList
          recentOrders={stats.recentOrders}
          loading={loading}
        />
      </div>
    </div>
  );
}

