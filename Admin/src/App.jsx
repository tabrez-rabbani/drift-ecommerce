import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import AdminLoginPage from "@/features/auth/pages/AdminLoginPage";
import AdminLayout from "@/components/AdminLayout/AdminLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import HeroPage from "@/features/hero/pages/HeroPage";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import ProductsPage from "@/features/products/pages/ProductsPage";
import CreateProductPage from "@/features/products/pages/CreateProductPage";
import EditProductPage from "@/features/products/pages/EditProductPage";
import UsersOrdersPage from "@/features/orders/pages/UsersOrdersPage";
import CancelledOrdersPage from "@/features/orders/pages/CancelledOrdersPage";
import UsersPage from "@/features/users/pages/UsersPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="hero" element={<HeroPage />} />
            <Route path="banners" element={<Navigate to="/admin/hero" replace />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/create" element={<CreateProductPage />} />
            <Route path="products/edit/:id" element={<EditProductPage />} />
            <Route path="orders" element={<Navigate to="/admin/orders/users-orders" replace />} />
            <Route path="orders/users-orders" element={<UsersOrdersPage />} />
            <Route path="orders/cancel-orders" element={<CancelledOrdersPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
