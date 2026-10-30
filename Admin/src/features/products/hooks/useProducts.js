import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { fetchProductsApi, deleteProductApi } from "../services/product.api";

export function useProducts({ limit = 100 } = {}) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchProductsApi({ limit });
      if (isMountedRef.current && data?.success) {
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      }
    } catch (error) {
      if (isMountedRef.current) {
        toast.error(error.response?.data?.message || "Failed to fetch products");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [limit]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter((p) => p.title.toLowerCase().includes(lowerQuery))
      );
    }
    setPage(1);
  }, [searchQuery, products]);

  const deleteProduct = (id, title) => {
    toast(`Delete "${title || "this product"}"?`, {
      description: "This product will be permanently removed.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const data = await deleteProductApi(id);
            if (data?.success) {
              if (isMountedRef.current) {
                setProducts((prev) => prev.filter((p) => p._id !== id));
                setFilteredProducts((prev) => prev.filter((p) => p._id !== id));
              }
              toast.success("Product deleted successfully");
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete product");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  return {
    products,
    filteredProducts: paginatedProducts,
    totalCount: filteredProducts.length,
    searchQuery,
    setSearchQuery,
    isLoading,
    page,
    setPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    totalPages,
    deleteProduct,
    refreshProducts: loadProducts,
  };
}

