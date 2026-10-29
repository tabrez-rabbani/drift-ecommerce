import authApiInstance from "@/lib/axios";

export async function fetchOrdersApi(params = {}) {
  const response = await authApiInstance.get("/admin/orders", { params });
  return response.data;
}

export async function fetchCancelledOrdersApi(params = {}) {
  const response = await authApiInstance.get("/admin/orders/cancelled", { params });
  return response.data;
}

export async function updateOrderStatusApi(orderId, status) {
  const response = await authApiInstance.patch(`/admin/orders/${orderId}/status`, { status });
  return response.data;
}
