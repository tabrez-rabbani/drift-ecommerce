import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  categories: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  loadingMore: false,
  categoriesLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.loadingMore = false;
      state.error = null;
    },
    appendProducts: (state, action) => {
      const existingIds = new Set(state.products.map((p) => p._id));
      const newItems = action.payload.filter((p) => !existingIds.has(p._id));
      state.products.push(...newItems);
      state.loadingMore = false;
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLoadingMore: (state, action) => {
      state.loadingMore = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.categoriesLoading = false;
    },
    setCategoriesLoading: (state, action) => {
      state.categoriesLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.loadingMore = false;
    },
  },
});

export const {
  setProducts,
  appendProducts,
  setPagination,
  setLoading,
  setLoadingMore,
  setCategories,
  setCategoriesLoading,
  setError,
} = productsSlice.actions;

export default productsSlice.reducer;
