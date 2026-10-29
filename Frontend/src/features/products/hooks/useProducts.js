import { useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
  fetchProductBySlug,
} from "../services/products.api";
import {
  setProducts,
  appendProducts,
  setPagination,
  setLoading,
  setLoadingMore,
  setCategories,
  setCategoriesLoading,
  setError,
} from "../state/products.slice";

export function useProducts() {
  const dispatch = useDispatch();
  const {
    products,
    categories,
    pagination,
    loading,
    loadingMore,
    categoriesLoading,
    error,
  } = useSelector((state) => state.products);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleGetProducts = useCallback(
    async (params = {}, isLoadMore = false) => {
      if (!isLoadMore) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
      }

      const signal = !isLoadMore ? abortControllerRef.current?.signal : undefined;

      try {
        if (isLoadMore) {
          dispatch(setLoadingMore(true));
        } else {
          dispatch(setLoading(true));
        }

        const data = await fetchProducts(params, signal);
        if (data?.success) {
          if (isLoadMore) {
            dispatch(appendProducts(data.products || []));
          } else {
            dispatch(setProducts(data.products || []));
          }

          if (data.pagination) {
            dispatch(setPagination(data.pagination));
          }
        }
        return data?.products || [];
      } catch (err) {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          return [];
        }
        dispatch(setError(err.message || "Failed to load products"));
        return [];
      } finally {
        if (isLoadMore) {
          dispatch(setLoadingMore(false));
        } else {
          dispatch(setLoading(false));
        }
      }
    },
    [dispatch]
  );

  const handleGetCategories = useCallback(async () => {
    try {
      dispatch(setCategoriesLoading(true));
      const data = await fetchCategories();
      if (data?.success) {
        dispatch(setCategories(data.categories || []));
      }
      return data?.categories || [];
    } catch (err) {
      dispatch(setError(err.message || "Failed to load categories"));
      return [];
    } finally {
      dispatch(setCategoriesLoading(false));
    }
  }, [dispatch]);

  const handleGetProductBySlug = useCallback(
    async (slug) => {
      try {
        dispatch(setLoading(true));
        const data = await fetchProductBySlug(slug);
        return data?.product || null;
      } catch (err) {
        dispatch(setError(err.message || "Failed to load product"));
        return null;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  return {
    products,
    categories,
    pagination,
    loading,
    loadingMore,
    categoriesLoading,
    error,
    handleGetProducts,
    handleGetCategories,
    handleGetProductBySlug,
  };
}

export default useProducts;
