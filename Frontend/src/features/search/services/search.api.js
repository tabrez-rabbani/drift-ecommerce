import api from "../../../services/api";

export async function searchProducts(query, params = {}, options = {}) {
  const q = (query || "").trim();
  if (!q) {
    return { success: true, products: [], totalResults: 0 };
  }

  const queryParams = new URLSearchParams({
    q,
    ...params,
  }).toString();

  const response = await api.get(`/products/search?${queryParams}`, {
    signal: options.signal,
  });
  return response.data;
}
