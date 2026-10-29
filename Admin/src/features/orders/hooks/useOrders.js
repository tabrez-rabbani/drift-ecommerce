import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { fetchOrdersApi, updateOrderStatusApi } from "../services/order.api";

export function useOrders({ initialStatus = "all", isCancelledOnly = false } = {}) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 15 };

      if (isCancelledOnly) {
        params.status = "cancelled";
      } else if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const data = await fetchOrdersApi(params);

      if (isMountedRef.current && data?.success) {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      if (isMountedRef.current) {
        toast.error(err.response?.data?.message || "Failed to load orders");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [page, statusFilter, debouncedSearch, isCancelledOnly]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const data = await updateOrderStatusApi(orderId, newStatus);
      if (data?.success) {
        toast.success(`Order status updated to "${newStatus}"`);
        if (isMountedRef.current) {
          setOrders((prev) =>
            prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
          );
        }
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      return false;
    } finally {
      if (isMountedRef.current) {
        setUpdatingId(null);
      }
    }
  };

  return {
    orders,
    total,
    page,
    setPage,
    totalPages,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    loading,
    updatingId,
    refreshOrders: loadOrders,
    updateStatus,
  };
}

