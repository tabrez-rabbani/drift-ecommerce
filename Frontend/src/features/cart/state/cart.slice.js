import { createSlice } from "@reduxjs/toolkit";

const getInitialCartFromStorage = () => {
  try {
    const cached = localStorage.getItem("drift_cart_items");
    const parsed = cached ? JSON.parse(cached) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => Boolean(item && item.id && item.title && (item.price > 0 || item.title !== "Product"))
    );
  } catch {
    return [];
  }
};

const initialState = {
  items: getInitialCartFromStorage(),
  isOpen: false,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      const validItems = (action.payload || []).filter(
        (item) => Boolean(item && item.id && item.title && (item.price > 0 || item.title !== "Product"))
      );
      state.items = validItems;
      state.loading = false;
      state.error = null;
      try {
        localStorage.setItem(
          "drift_cart_items",
          JSON.stringify(state.items)
        );
      } catch (err) {
        void err;
      }
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCartError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCart: (state) => {
      state.items = [];
      state.loading = false;
      try {
        localStorage.removeItem("drift_cart_items");
      } catch (err) {
        void err;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      try {
        localStorage.removeItem("drift_cart_items");
      } catch (err) {
        void err;
      }
    });
  },
});

export const {
  setCartItems,
  openCart,
  closeCart,
  setCartLoading,
  setCartError,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
