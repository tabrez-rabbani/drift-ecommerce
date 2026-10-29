import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  setOrders,
  setActiveTab,
  setExpandedOrderId,
  setCancellingOrderId,
  updateOrderStatus,
  setAccountLoading,
  setAccountError,
} from "../state/account.slice";
import {
  fetchMyOrdersApi,
  cancelOrderApi,
  updateProfileApi,
} from "../services/account.api";
import { useAuth } from "../../auth/hooks/useAuth";
import { setUser as setUserAction } from "../../auth/state/auth.slice";

export function useAccount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, isAuthenticated, isInitialized, handleLogout } = useAuth();
  const { orders, loading, activeTab, expandedOrderId, cancellingOrderId } =
    useSelector((state) => state.account);
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems?.length ?? 0;

  // Profile form state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || "");
  const [city, setCity] = useState(user?.city || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [stateField, setStateField] = useState(user?.state || "");
  const [country, setCountry] = useState(user?.country || "India");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Lifecycles & cleanup refs
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const lastSyncedUserRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Sync profile form state when user changes
  useEffect(() => {
    if (user && user !== lastSyncedUserRef.current) {
      lastSyncedUserRef.current = user;
      setName(user.name || "");
      setPhone(user.phone || "");
      setStreetAddress(user.streetAddress || "");
      setCity(user.city || "");
      setPostalCode(user.postalCode || "");
      setStateField(user.state || "");
      setCountry(user.country || "India");
    }
  }, [user]);

  // Read tab from ?tab= URL param, default to "dashboard" if not set
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "orders" || tab === "userinfo" || tab === "dashboard") {
      dispatch(setActiveTab(tab));
    } else if (!tab) {
      dispatch(setActiveTab("dashboard"));
    }
  }, [searchParams, dispatch]);

  // Redirect if not authenticated (preserving target from)
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate("/login", { replace: true, state: { from: "/account" } });
    }
  }, [isInitialized, isAuthenticated, navigate]);

  // Fetch orders with AbortController to prevent race conditions
  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (orders.length === 0) {
        dispatch(setAccountLoading(true));
      }
      const res = await fetchMyOrdersApi(controller.signal);
      if (!controller.signal.aborted) {
        if (res?.success && Array.isArray(res.orders)) {
          dispatch(setOrders(res.orders));
        } else {
          dispatch(setAccountLoading(false));
        }
      }
    } catch (err) {
      if (err?.name === "CanceledError" || err?.name === "AbortError" || controller.signal.aborted) {
        return;
      }
      dispatch(setAccountError(err?.response?.data?.message || err?.message || "Failed to load orders"));
    } finally {
      if (!controller.signal.aborted) {
        dispatch(setAccountLoading(false));
      }
    }
  }, [isAuthenticated, dispatch, orders.length]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchOrders();
    }
  }, [isInitialized, isAuthenticated, fetchOrders]);

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
    setSearchParams(tab === "dashboard" ? {} : { tab });
  };

  const handleToggleOrder = (orderId) => dispatch(setExpandedOrderId(orderId));

  const handleCancelOrder = (orderId) => {
    toast("Cancel this order?", {
      description: "This action cannot be undone. Your order will be cancelled.",
      duration: 10000,
      action: {
        label: "Yes, Cancel",
        onClick: async () => {
          dispatch(setCancellingOrderId(orderId));
          try {
            const res = await cancelOrderApi(orderId);
            if (res?.success) {
              dispatch(updateOrderStatus({ orderId, status: "cancelled" }));
              toast.success("Order cancelled successfully");
            }
          } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to cancel order");
          } finally {
            if (isMountedRef.current) {
              dispatch(setCancellingOrderId(null));
            }
          }
        },
      },
      cancel: {
        label: "No, Keep It",
        onClick: () => {},
      },
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      toast.error("Full name cannot be empty.");
      return;
    }
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    try {
      setIsSaving(true);
      const payload = {
        name: cleanName,
        phone: phone.trim(),
        streetAddress: streetAddress.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        state: stateField.trim(),
        country: country.trim() || "India",
      };
      if (password && password.trim()) payload.password = password.trim();

      const res = await updateProfileApi(payload);
      if (res?.success) {
        dispatch(setUserAction(res.user));
        toast.success("Profile updated successfully!");
        if (isMountedRef.current) {
          setPassword("");
          setConfirmPassword("");
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  };

  const handleLogoutAccount = async () => {
    await handleLogout();
    navigate("/login", { replace: true });
  };

  const getUserInitial = () =>
    user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const TRACKING_STEPS = ["placed", "processing", "shipped", "delivered"];

  const getTrackingStepIndex = (status) => {
    const normalized = (status || "").toLowerCase().trim();
    const idx = TRACKING_STEPS.indexOf(normalized);
    return idx >= 0 ? idx : 0;
  };

  return {
    user,
    isInitialized,
    isAuthenticated,
    handleLogoutAccount,
    getUserInitial,
    activeTab,
    handleTabChange,
    orders,
    loading,
    expandedOrderId,
    cancellingOrderId,
    handleToggleOrder,
    handleCancelOrder,
    formatDate,
    getTrackingStepIndex,
    cartItemCount,
    // profile form
    name, setName,
    phone, setPhone,
    streetAddress, setStreetAddress,
    city, setCity,
    postalCode, setPostalCode,
    stateField, setStateField,
    country, setCountry,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    isSaving,
    handleProfileSubmit,
  };
}

export default useAccount;
