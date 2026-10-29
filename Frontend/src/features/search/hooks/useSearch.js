import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../services/search.api";

export function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";

  const [inputVal, setInputVal] = useState(urlQuery);
  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const debounceTimerRef = useRef(null);
  const prevUrlQueryRef = useRef(urlQuery);
  const abortControllerRef = useRef(null);

  // Sync input value when URL query changes (e.g. browser back/forward or suggestion click)
  useEffect(() => {
    if (prevUrlQueryRef.current !== urlQuery) {
      prevUrlQueryRef.current = urlQuery;
      setInputVal(urlQuery);
    }
  }, [urlQuery]);

  // Dynamic document title for SEO & UX
  useEffect(() => {
    document.title = urlQuery.trim()
      ? `"${urlQuery.trim()}" - Search | DRIFT`
      : "Search Products | DRIFT";
  }, [urlQuery]);

  // Execute search with AbortController to cancel stale in-flight requests
  useEffect(() => {
    const query = urlQuery.trim();
    if (!query) {
      setProducts([]);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    async function runSearch() {
      setLoading(true);
      try {
        const data = await searchProducts(
          query,
          { limit: 16 },
          { signal: controller.signal }
        );
        if (!controller.signal.aborted && data?.success) {
          setProducts(data.products || []);
          setTotalResults(data.totalResults ?? data.products?.length ?? 0);
        }
      } catch (err) {
        // Do not reset state if aborted intentionally
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          return;
        }
        if (!controller.signal.aborted) {
          setProducts([]);
          setTotalResults(0);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    runSearch();

    return () => {
      controller.abort();
    };
  }, [urlQuery]);

  // Cleanup timers & abort controllers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleInputChange = useCallback((e) => {
    const val = e.target.value;
    setInputVal(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const trimmed = val.trim();
      setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
    }, 350);
  }, [setSearchParams]);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const trimmed = inputVal.trim();
    setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
  }, [inputVal, setSearchParams]);

  const handleClear = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setInputVal("");
    setProducts([]);
    setTotalResults(0);
    setLoading(false);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const handleSuggestionClick = useCallback((keyword) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setInputVal(keyword);
    setSearchParams({ q: keyword }, { replace: true });
  }, [setSearchParams]);

  const hasQuery = Boolean(urlQuery.trim());

  return {
    query: urlQuery,
    inputVal,
    handleInputChange,
    handleSubmit,
    handleClear,
    handleSuggestionClick,
    products: hasQuery ? products : [],
    totalResults: hasQuery ? totalResults : 0,
    loading,
    hasQuery,
  };
}
