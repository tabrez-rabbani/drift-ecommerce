import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import AdminLoginPage from "@/pages/AdminLogin/AdminLoginPage";
import AdminLayout from "@/components/AdminLayout/AdminLayout";
import Dashboard from "@/pages/Dashboard/Dashboard";
import HeroPage from "@/pages/Hero/HeroPage";
import CategoriesPage from "@/pages/Categories/CategoriesPage";
import ProductsPage from "@/pages/Products/ProductsPage";
import CreateProductPage from "@/pages/Products/CreateProductPage";
import EditProductPage from "@/pages/Products/EditProductPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="hero" element={<HeroPage />} />
            <Route path="banners" element={<Navigate to="/admin/hero" replace />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/create" element={<CreateProductPage />} />
            <Route path="products/edit/:id" element={<EditProductPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
