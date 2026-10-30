import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { fetchUsersApi, deleteUserApi } from "../services/user.api";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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

  const loadUsers = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    try {
      setLoading(true);
      const params = { page, limit: pageSize };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const data = await fetchUsersApi(params);

      if (
        isMountedRef.current &&
        currentRequestId === requestIdRef.current &&
        data?.success
      ) {
        setUsers(data.users || []);
        setTotal(data.total || 0);
        setTotalPages(Math.max(1, data.totalPages || 1));
      }
    } catch (err) {
      if (
        isMountedRef.current &&
        currentRequestId === requestIdRef.current
      ) {
        toast.error(err.response?.data?.message || "Failed to load users");
      }
    } finally {
      if (
        isMountedRef.current &&
        currentRequestId === requestIdRef.current
      ) {
        setLoading(false);
      }
    }
  }, [page, pageSize, debouncedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  const deleteUser = (id, userName) => {
    toast(`Delete user "${userName || "this customer"}"?`, {
      description: "This user account will be permanently removed.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            setDeletingId(id);
            const data = await deleteUserApi(id);
            if (data?.success) {
              if (isMountedRef.current) {
                setUsers((prev) => prev.filter((u) => u._id !== id));
                setTotal((prev) => Math.max(0, prev - 1));
              }
              toast.success("User deleted successfully");
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user");
          } finally {
            if (isMountedRef.current) {
              setDeletingId(null);
            }
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  return {
    users,
    total,
    page,
    setPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    totalPages,
    searchQuery,
    setSearchQuery,
    loading,
    deletingId,
    deleteUser,
    refreshUsers: loadUsers,
  };
}
