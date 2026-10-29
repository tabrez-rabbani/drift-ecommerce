import { useState, useEffect, useCallback, useRef } from "react";
import { fetchRelatedProducts } from "../services/products.api";

export function useRelatedProducts(categoryId, excludeId = null) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!categoryId) return;

    let cancelled = false;
    pageRef.current = 1;
    isFetchingRef.current = true;

    async function initialLoad() {
      setLoading(true);
      try {
        const { products, pagination } = await fetchRelatedProducts(categoryId, excludeId, 1, 10);
        if (!cancelled) {
          setRelated(products);
          setHasMore(Boolean(pagination?.hasNextPage));
        }
      } catch {
        if (!cancelled) {
          setRelated([]);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          isFetchingRef.current = false;
        }
      }
    }

    initialLoad();

    return () => {
      cancelled = true;
      isFetchingRef.current = false;
    };
  }, [categoryId, excludeId]);

  const loadMore = useCallback(async () => {
    if (!categoryId || isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoadingMore(true);

    const nextPage = pageRef.current + 1;

    try {
      const { products, pagination } = await fetchRelatedProducts(categoryId, excludeId, nextPage, 10);

      setRelated((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newItems = products.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newItems];
      });

      pageRef.current = nextPage;
      setHasMore(Boolean(pagination?.hasNextPage));
    } catch {
      // Silently handle pagination error
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [categoryId, excludeId, hasMore]);

  return { related, loading, loadingMore, hasMore, loadMore };
}
