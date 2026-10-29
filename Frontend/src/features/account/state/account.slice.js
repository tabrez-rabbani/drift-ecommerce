import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  activeTab: "dashboard",
  expandedOrderId: null,
  cancellingOrderId: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload || [];
      state.loading = false;
      state.error = null;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload || "dashboard";
    },
    setExpandedOrderId: (state, action) => {
      state.expandedOrderId =
        state.expandedOrderId === action.payload ? null : action.payload;
    },
    setCancellingOrderId: (state, action) => {
      state.cancellingOrderId = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      state.orders = state.orders.map((o) =>
        o._id === orderId ? { ...o, orderStatus: status } : o
      );
    },
    setAccountLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAccountError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAccount: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
      state.activeTab = "dashboard";
      state.expandedOrderId = null;
      state.cancellingOrderId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
      state.activeTab = "dashboard";
      state.expandedOrderId = null;
      state.cancellingOrderId = null;
    });
  },
});

export const {
  setOrders,
  setActiveTab,
  setExpandedOrderId,
  setCancellingOrderId,
  updateOrderStatus,
  setAccountLoading,
  setAccountError,
  clearAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
