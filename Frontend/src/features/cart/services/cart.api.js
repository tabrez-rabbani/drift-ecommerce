import api from "../../../services/api";

export async function getCartApi() {
  const response = await api.get("/cart");
  return response.data;
}

export async function addToCartApi(productId, { color, size, quantity = 1 }) {
  const response = await api.post(`/cart/add/${productId}`, {
    color,
    size,
    quantity,
  });
  return response.data;
}

export async function incrementCartQtyApi(productId, { color, size }) {
  const response = await api.patch(`/cart/quantity/increment/${productId}`, {
    color,
    size,
  });
  return response.data;
}

export async function decrementCartQtyApi(productId, { color, size }) {
  const response = await api.patch(`/cart/quantity/decrement/${productId}`, {
    color,
    size,
  });
  return response.data;
}

export async function removeCartItemApi(productId, { color, size }) {
  const response = await api.delete(`/cart/remove/${productId}`, {
    data: { color, size },
  });
  return response.data;
}
