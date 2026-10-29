import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "../../cart/hooks/useCart";
import {
  placeOrderApi,
  createPaymentOrderApi,
  verifyPaymentOrderApi,
} from "../services/checkout.api";

let razorpayPromise = null;

const loadRazorpayScript = () => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayPromise) return razorpayPromise;

  razorpayPromise = new Promise((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener(
        "error",
        () => {
          razorpayPromise = null;
          resolve(false);
        },
        { once: true }
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpayPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return razorpayPromise;
};

export function useCheckout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, isInitialized } = useAuth();
  const { items, subtotal, handleClearCart, loading: cartLoading } = useCart();

  const [shippingAddress, setShippingAddress] = useState(() => {
    let saved = {};
    try {
      const stored = localStorage.getItem("drift_shipping_address");
      if (stored) saved = JSON.parse(stored);
    } catch (err) {
      void err;
    }
    return {
      fullName: saved.fullName || user?.name || "",
      email: saved.email || user?.email || "",
      phone: saved.phone || user?.phone || "",
      streetAddress: saved.streetAddress || "",
      city: saved.city || "",
      state: saved.state || "",
      postalCode: saved.postalCode || "",
      country: saved.country || "India",
    };
  });

  const [isEditingAddress, setIsEditingAddress] = useState(() => {
    let saved = {};
    try {
      const stored = localStorage.getItem("drift_shipping_address");
      if (stored) saved = JSON.parse(stored);
    } catch (err) {
      void err;
    }
    return !(saved.streetAddress && saved.city && saved.postalCode);
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const total = subtotal + deliveryCharge;

  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => {
        if (!prev.fullName || !prev.email || !prev.phone) {
          return {
            ...prev,
            fullName: prev.fullName || user.name || "",
            email: prev.email || user.email || "",
            phone: prev.phone || user.phone || "",
          };
        }
        return prev;
      });
    }
  }, [user]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate("/login", { replace: true, state: { from: "/checkout" } });
    }
  }, [isInitialized, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!shippingAddress.fullName.trim()) {
      errors.fullName = "Name is required";
    } else if (shippingAddress.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }

    if (!shippingAddress.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(shippingAddress.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    const cleanPhone = shippingAddress.phone.replace(/[\s\-()+]/g, "");
    if (!shippingAddress.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (
      !/^[0-9+\s\-()]{7,15}$/.test(shippingAddress.phone.trim()) ||
      cleanPhone.length < 10
    ) {
      errors.phone = "Enter a valid 10-digit phone number";
    }

    if (!shippingAddress.streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    }
    if (!shippingAddress.city.trim()) errors.city = "City is required";
    if (!shippingAddress.state.trim()) errors.state = "State is required";
    if (!shippingAddress.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    } else if (shippingAddress.postalCode.trim().length < 4) {
      errors.postalCode = "Enter a valid postal code";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = () => {
    if (validateForm()) {
      setIsEditingAddress(false);
      try {
        localStorage.setItem(
          "drift_shipping_address",
          JSON.stringify(shippingAddress)
        );
      } catch (err) {
        void err;
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;
    setServerError("");
    if (!validateForm()) {
      setIsEditingAddress(true);
      return;
    }

    try {
      localStorage.setItem(
        "drift_shipping_address",
        JSON.stringify(shippingAddress)
      );
    } catch (err) {
      void err;
    }

    if (!isAuthenticated) {
      setServerError("Please login to complete your order.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    try {
      setIsPlacingOrder(true);

      if (paymentMethod === "online") {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error(
            "Unable to load payment gateway. Please check your internet connection."
          );
        }

        const createRes = await createPaymentOrderApi({ shippingAddress });
        const { order, keyId } = createRes;

        const options = {
          key: keyId,
          amount: order.amount,
          currency: order.currency || "INR",
          name: "Drift",
          description: "Purchase Payment",
          order_id: order.id,
          prefill: {
            name: shippingAddress.fullName,
            email: shippingAddress.email,
            contact: shippingAddress.phone,
          },
          theme: {
            color: "#000000",
          },
          handler: async (response) => {
            try {
              const verifyRes = await verifyPaymentOrderApi({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress,
              });

              if (!isMountedRef.current) return;

              if (verifyRes.success) {
                const confirmedOrder = verifyRes.order || {
                  _id: verifyRes.orderId,
                  paymentMethod: "online",
                };
                setOrderSuccess({
                  ...confirmedOrder,
                  paymentMethod: confirmedOrder.paymentMethod || "online",
                });
                handleClearCart();
                toast.success("Payment verified! Order placed successfully.");
              }
            } catch (vErr) {
              if (!isMountedRef.current) return;
              const msg =
                vErr.response?.data?.message ||
                vErr.message ||
                "Payment verification failed. If money was deducted, it will be refunded or please contact support.";
              setServerError(msg);
              toast.error(msg);
            } finally {
              if (isMountedRef.current) {
                setIsPlacingOrder(false);
              }
            }
          },
          modal: {
            ondismiss: () => {
              if (isMountedRef.current) {
                setIsPlacingOrder(false);
              }
            },
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on("payment.failed", (response) => {
          if (!isMountedRef.current) return;
          setIsPlacingOrder(false);
          setServerError(
            response.error?.description || "Payment failed. Please try again."
          );
        });
        razorpayInstance.open();
        return;
      }

      const response = await placeOrderApi({
        shippingAddress,
        paymentMethod,
      });

      if (!isMountedRef.current) return;

      if (response.success) {
        setOrderSuccess(response.order);
        handleClearCart();
        toast.success("Order placed successfully!");
      }
      setIsPlacingOrder(false);
    } catch (err) {
      if (!isMountedRef.current) return;
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Failed to place order. Please try again.";
      setServerError(msg);
      toast.error(msg);
      setIsPlacingOrder(false);
    }
  };

  return {
    items,
    subtotal,
    deliveryCharge,
    total,
    cartLoading,
    authLoading,
    isAuthenticated,
    isInitialized,
    shippingAddress,
    isEditingAddress,
    setIsEditingAddress,
    paymentMethod,
    setPaymentMethod,
    isPlacingOrder,
    orderSuccess,
    formErrors,
    serverError,
    handleInputChange,
    handleSaveAddress,
    handlePlaceOrder,
  };
}

export default useCheckout;

