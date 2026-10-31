import { useDashboard } from "../hooks/useDashboard";
import StatCards from "../components/StatCards/StatCards";
import OrderTrendsChart from "../components/OrderTrendsChart/OrderTrendsChart";
import OrdersOverview from "../components/OrdersOverview/OrdersOverview";
import RevenueTrendChart from "../components/RevenueTrendChart/RevenueTrendChart";
import TopCategoriesList from "../components/TopCategoriesList/TopCategoriesList";
import BestSellingList from "../components/BestSellingList/BestSellingList";
import RecentProductsList from "../components/RecentProductsList/RecentProductsList";
import RecentOrdersList from "../components/RecentOrdersList/RecentOrdersList";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const {
    stats,
    loading,
    monthlyCounts,
    monthlyRevenue,
    maxOrderCount,
    maxRevenue,
    totalOrdersThisYear,
    totalRevenueThisYear,
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
        <OrdersOverview
          orderStatusBreakdown={stats.orderStatusBreakdown}
          totalOrders={stats.totalOrders}
          loading={loading}
        />
      </div>

      <div className={styles.showcaseGrid}>
        <RevenueTrendChart
          monthlyRevenue={monthlyRevenue}
          maxRevenue={maxRevenue}
          totalRevenueThisYear={totalRevenueThisYear}
          loading={loading}
        />
        <TopCategoriesList
          topCategories={stats.topCategories}
          loading={loading}
        />
      </div>

      <div className={styles.showcaseGrid}>
        <BestSellingList
          bestSellingProducts={stats.bestSellingProducts}
          loading={loading}
        />
        <RecentProductsList
          recentProducts={stats.recentProducts}
          loading={loading}
        />
      </div>

      <div className={styles.fullWidthRow}>
        <RecentOrdersList
          recentOrders={stats.recentOrders}
          loading={loading}
        />
      </div>
    </div>
  );
}
