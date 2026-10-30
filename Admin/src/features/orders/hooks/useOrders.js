import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { fetchOrdersApi, fetchCancelledOrdersApi, updateOrderStatusApi } from "../services/order.api";

export function useOrders({ initialStatus = "all", isCancelledOnly = false } = {}) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);

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
    const currentRequestId = ++requestIdRef.current;
    try {
      setLoading(true);
      const params = { page, limit: pageSize };

      if (!isCancelledOnly && statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const data = isCancelledOnly
        ? await fetchCancelledOrdersApi(params)
        : await fetchOrdersApi(params);

      if (
        isMountedRef.current &&
        currentRequestId === requestIdRef.current &&
        data?.success
      ) {
        setOrders(data.orders || []);
        setTotal(data.total || 0);
        setTotalPages(Math.max(1, data.totalPages || 1));
      }
    } catch (err) {
      if (
        isMountedRef.current &&
        currentRequestId === requestIdRef.current
      ) {
        toast.error(err.response?.data?.message || "Failed to load orders");
      }
    } finally {
      if (
        isMountedRef.current &&
        currentRequestId === requestIdRef.current
      ) {
        setLoading(false);
      }
    }
  }, [page, pageSize, statusFilter, debouncedSearch, isCancelledOnly]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

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
    pageSize,
    setPageSize: handlePageSizeChange,
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

