import api from "../../../services/api";

export async function fetchMyOrdersApi(signal) {
  const response = await api.get("/orders/my-orders", { signal });
  return response.data;
}

export async function cancelOrderApi(orderId) {
  const response = await api.patch(`/orders/${orderId}/cancel`);
  return response.data;
}

export async function updateProfileApi(payload) {
  const response = await api.put("/auth/profile", payload);
  return response.data;
}
