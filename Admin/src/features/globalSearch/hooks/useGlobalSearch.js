import { useState, useEffect, useRef, useCallback } from "react";
import { fetchGlobalSearchApi } from "../services/globalSearch.api";

const DEBOUNCE_MS = 300;

export function useGlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], orders: [], users: [] });
  const [loading, setLoading] = useState(false);

  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const debounceRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const search = useCallback((q) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const trimmed = (q || "").trim();

    if (trimmed.length < 2) {
      setResults({ products: [], orders: [], users: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const thisRequest = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      abortControllerRef.current = new AbortController();

      try {
        const data = await fetchGlobalSearchApi(
          trimmed,
          abortControllerRef.current.signal
        );

        if (!isMountedRef.current || thisRequest !== requestIdRef.current) return;

        setResults({
          products: Array.isArray(data?.products) ? data.products : [],
          orders: Array.isArray(data?.orders) ? data.orders : [],
          users: Array.isArray(data?.users) ? data.users : [],
        });
      } catch (err) {
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
        if (!isMountedRef.current || thisRequest !== requestIdRef.current) return;
        setResults({ products: [], orders: [], users: [] });
      } finally {
        if (isMountedRef.current && thisRequest === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);
  }, []);

  const handleQueryChange = useCallback(
    (q) => {
      setQuery(q);
      search(q);
    },
    [search]
  );

  const resetSearch = useCallback(() => {
    setQuery("");
    setResults({ products: [], orders: [], users: [] });
    setLoading(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
  }, []);

  const hasResults =
    results.products.length > 0 ||
    results.orders.length > 0 ||
    results.users.length > 0;

  return {
    query,
    results,
    loading,
    hasResults,
    handleQueryChange,
    resetSearch,
  };
}
