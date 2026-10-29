import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  productIds: [],
  loading: false,
  isLoaded: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload || [];
      state.productIds = (action.payload || []).map((p) => String(p._id || p.id || p));
      state.loading = false;
      state.isLoaded = true;
      state.error = null;
    },
    setWishlistIds: (state, action) => {
      state.productIds = (action.payload || []).map((id) => String(id));
      state.isLoaded = true;
      state.loading = false;
    },
    toggleWishlistId: (state, action) => {
      const id = String(action.payload);
      const exists = state.productIds.some((pId) => String(pId) === id);
      if (exists) {
        state.productIds = state.productIds.filter((pId) => String(pId) !== id);
        state.items = state.items.filter((item) => String(item._id || item.id) !== id);
      } else {
        state.productIds.push(id);
      }
    },
    removeWishlistItem: (state, action) => {
      const id = String(action.payload);
      state.productIds = state.productIds.filter((pId) => String(pId) !== id);
      state.items = state.items.filter((item) => String(item._id || item.id) !== id);
    },
    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
    setWishlistError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.productIds = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", (state) => {
      state.items = [];
      state.productIds = [];
      state.loading = false;
      state.isLoaded = false;
      state.error = null;
    });
  },
});

export const {
  setWishlist,
  setWishlistIds,
  toggleWishlistId,
  removeWishlistItem,
  setWishlistLoading,
  setWishlistError,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

