import { useState, useEffect, useCallback, useRef } from "react";
import { fetchProductBySlug, fetchRelatedProducts } from "../../products/services/products.api";

// Fetches related products based on the first item in the cart.
export function useCartRelated(cartItems) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const firstSlug = cartItems?.[0]?.slug ?? null;
  const firstId = cartItems?.[0]?.id ?? null;

  const categoryIdRef = useRef(null);
  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!firstSlug) {
      setRelated([]);
      setHasMore(false);
      categoryIdRef.current = null;
      return;
    }

    let cancelled = false;
    pageRef.current = 1;
    isFetchingRef.current = true;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchProductBySlug(firstSlug);
        const categoryId = data?.product?.category?._id || data?.product?.category;
        if (!categoryId || cancelled) return;

        categoryIdRef.current = categoryId;
        const { products, pagination } = await fetchRelatedProducts(categoryId, firstId, 1, 10);
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

    load();

    return () => {
      cancelled = true;
      isFetchingRef.current = false;
    };
  }, [firstSlug, firstId]);

  const loadMore = useCallback(async () => {
    const catId = categoryIdRef.current;
    if (!catId || isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoadingMore(true);

    const nextPage = pageRef.current + 1;

    try {
      const { products, pagination } = await fetchRelatedProducts(catId, firstId, nextPage, 10);

      setRelated((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newItems = products.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newItems];
      });

      pageRef.current = nextPage;
      setHasMore(Boolean(pagination?.hasNextPage));
    } catch (err) {
      void err;
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [firstId, hasMore]);

  return { related, loading, loadingMore, hasMore, loadMore };
}
