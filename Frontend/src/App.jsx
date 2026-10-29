import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAuth } from "./features/auth/hooks/useAuth";
import { useWishlist } from "./features/wishlist/hooks/useWishlist";
import AppRoutes from "./app/routes/AppRoutes";

export default function App() {
  const { checkAuth, isAuthenticated, isInitialized } = useAuth();
  const { fetchWishlistIds } = useWishlist();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchWishlistIds();
    }
  }, [isInitialized, isAuthenticated]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <AppRoutes />
    </>
  );
}