import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../../features/home/pages/HomePage";

const LoginPage        = lazy(() => import("../../features/auth/pages/LoginPage"));
const RegisterPage     = lazy(() => import("../../features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../../features/auth/pages/ForgotPasswordPage"));
const ResetPasswordPage  = lazy(() => import("../../features/auth/pages/ResetPasswordPage"));
const CollectionPage   = lazy(() => import("../../features/products/pages/CollectionPage"));
const ProductDetailPage = lazy(() => import("../../features/products/pages/ProductDetailPage"));
const CartPage         = lazy(() => import("../../features/cart/pages/CartPage/CartPage"));
const CheckoutPage     = lazy(() => import("../../features/checkout/pages/CheckoutPage/CheckoutPage"));
const WishlistPage     = lazy(() => import("../../features/wishlist/pages/WishlistPage/WishlistPage"));
const AccountPage      = lazy(() => import("../../features/account/pages/AccountPage/AccountPage"));
const SearchPage       = lazy(() => import("../../features/search/pages/SearchPage/SearchPage"));
const InfoPage         = lazy(() => import("../../pages/InfoPage/InfoPage"));
const NotFoundPage     = lazy(() => import("../../pages/NotFoundPage/NotFoundPage"));

function RedirectPreserveSearch({ to }) {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace state={location.state} />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/collection/:category" element={<CollectionPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/info/:slug" element={<InfoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/account/login" element={<RedirectPreserveSearch to="/login" />} />
            <Route path="/account/signup" element={<RedirectPreserveSearch to="/register" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
