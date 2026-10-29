import api from "../../../services/api";

export async function fetchProducts(params = {}, signal) {
  const query =
    typeof params === "string"
      ? params
      : new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
        ).toString();

  const response = await api.get(`/products${query ? `?${query}` : ""}`, { signal });
  return response.data;
}

export async function fetchCategories() {
  const response = await api.get("/categories");
  return response.data;
}

export async function fetchProductBySlug(slug) {
  const response = await api.get(`/products/detail/${slug}`);
  return response.data;
}

export async function fetchRelatedProducts(categoryId, excludeId, page = 1, limit = 10) {
  const params = new URLSearchParams({
    category: categoryId,
    page: String(page),
    limit: String(limit),
  });
  const response = await api.get(`/products?${params.toString()}`);
  const rawProducts = response.data?.products || [];
  const products = excludeId ? rawProducts.filter((p) => p._id !== excludeId) : rawProducts;
  const pagination = response.data?.pagination || {
    currentPage: Number(page),
    totalPages: 1,
    hasNextPage: false,
  };
  return { products, pagination };
}


