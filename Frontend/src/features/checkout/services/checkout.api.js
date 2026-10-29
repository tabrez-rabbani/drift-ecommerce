import api from "../../../services/api";

export async function placeOrderApi({ shippingAddress, paymentMethod = "cod" }) {
  const response = await api.post("/orders/place", {
    shippingAddress,
    paymentMethod,
  });
  return response.data;
}

export async function createPaymentOrderApi({ shippingAddress }) {
  const response = await api.post("/cart/payment/create/order", {
    shippingAddress,
  });
  return response.data;
}

export async function verifyPaymentOrderApi({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  shippingAddress,
}) {
  const response = await api.post("/cart/payment/verify/order", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    shippingAddress,
  });
  return response.data;
}

