import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { fetchDashboardStatsApi } from "../services/dashboard.api";

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const INITIAL_STATS = {
  totalContacts: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalUsers: 0,
  totalRevenue: 0,
  monthlyOrders: [],
  recentProducts: [],
  recentOrders: [],
  bestSellingProducts: [],
};

export function useDashboard() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);

  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadStats = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    try {
      setLoading(true);
      const data = await fetchDashboardStatsApi();
      if (
        isMountedRef.current &&
        currentRequestId === requestIdRef.current &&
        data?.stats
      ) {
        setStats(data.stats);
      }
    } catch (err) {
      if (
        isMountedRef.current &&
        currentRequestId === requestIdRef.current
      ) {
        toast.error(err.response?.data?.message || "Failed to load dashboard statistics");
      }
    } finally {
      if (
        isMountedRef.current &&
        currentRequestId === requestIdRef.current
      ) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const monthlyCounts = MONTH_NAMES.map((_, index) => {
    const item = stats.monthlyOrders?.find((m) => m._id === index + 1);
    return item ? item.count : 0;
  });

  const maxOrderCount = Math.max(...monthlyCounts, 5);
  const totalOrdersThisYear = monthlyCounts.reduce((acc, c) => acc + c, 0);

  return {
    stats,
    loading,
    monthlyCounts,
    maxOrderCount,
    totalOrdersThisYear,
    refreshStats: loadStats,
  };
}

