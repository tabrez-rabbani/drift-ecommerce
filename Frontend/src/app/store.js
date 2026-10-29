import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice";
import productsReducer from "../features/products/state/products.slice";
import cartReducer from "../features/cart/state/cart.slice";
import wishlistReducer from "../features/wishlist/state/wishlist.slice";
import accountReducer from "../features/account/state/account.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    account: accountReducer,
  },
});

export default store;
