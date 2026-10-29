import api from "../../../services/api";

export async function getWishlistApi() {
  const response = await api.get("/wishlist");
  return response.data;
}

export async function getWishlistIdsApi() {
  const response = await api.get("/wishlist/ids");
  return response.data;
}

export async function toggleWishlistApi(productId) {
  const response = await api.post(`/wishlist/toggle/${productId}`);
  return response.data;
}

export async function moveToBagApi(productId, { color, size, quantity = 1 }) {
  const response = await api.post(`/wishlist/move-to-bag/${productId}`, {
    color,
    size,
    quantity,
  });
  return response.data;
}

export async function removeFromWishlistApi(productId) {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
}

export async function clearWishlistApi() {
  const response = await api.delete("/wishlist/clear/all");
  return response.data;
}

