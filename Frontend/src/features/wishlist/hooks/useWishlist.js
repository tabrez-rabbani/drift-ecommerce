import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  setWishlist,
  setWishlistIds,
  toggleWishlistId,
  removeWishlistItem,
  setWishlistLoading,
  setWishlistError,
  clearWishlist,
} from "../state/wishlist.slice";
import {
  getWishlistApi,
  getWishlistIdsApi,
  toggleWishlistApi,
  moveToBagApi,
  removeFromWishlistApi,
  clearWishlistApi,
} from "../services/wishlist.api";
import { useAuth } from "../../auth/hooks/useAuth";
import { useCart } from "../../cart/hooks/useCart";

export function useWishlist() {
  const dispatch = useDispatch();
  const { items, productIds, loading, isLoaded, error } = useSelector(
    (state) => state.wishlist
  );
  const { isAuthenticated } = useAuth();
  const { handleGetCart, handleOpenCart } = useCart();

  async function fetchWishlist() {
    if (!isAuthenticated) return;
    try {
      dispatch(setWishlistLoading(true));
      const res = await getWishlistApi();
      if (res?.success) {
        dispatch(setWishlist(res.wishlist || []));
      }
    } catch (err) {
      dispatch(setWishlistError(err.message || "Failed to load wishlist"));
    }
  }

  async function fetchWishlistIds() {
    if (!isAuthenticated) return;
    try {
      const res = await getWishlistIdsApi();
      if (res?.success) {
        dispatch(setWishlistIds(res.productIds || []));
      }
    } catch (err) {
      void err;
    }
  }

  async function handleToggleWishlist(productId) {
    if (!isAuthenticated) {
      toast.info("Please sign in to save items to your wishlist");
      return;
    }
    // Optimistic update
    dispatch(toggleWishlistId(productId));
    try {
      const res = await toggleWishlistApi(productId);
      if (res?.action === "added") {
        toast.success("Added to wishlist");
      } else {
        toast.info("Removed from wishlist");
      }
    } catch (err) {
      // Revert on failure
      dispatch(toggleWishlistId(productId));
      toast.error("Failed to update wishlist");
      void err;
    }
  }

  async function handleRemove(productId) {
    if (!isAuthenticated) return;
    dispatch(removeWishlistItem(productId));
    try {
      await removeFromWishlistApi(productId);
      toast.info("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove item");
      void err;
    }
  }

  async function handleMoveToCart(product) {
    if (!isAuthenticated) return;
    const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
    const size = hasSizes ? product.sizes[0] : "One Size";
    const firstColor = product.colors?.[0];
    const color =
      typeof firstColor === "object"
        ? firstColor?.name || "Default"
        : firstColor || "Default";

    try {
      const res = await moveToBagApi(product._id, { color, size, quantity: 1 });
      if (res?.success) {
        dispatch(removeWishlistItem(product._id));
        await handleGetCart();
        handleOpenCart();
        toast.success(`Moved "${product.title}" to bag!`);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to move to bag";
      toast.error(msg);
    }
  }

  async function handleClearAll() {
    if (!isAuthenticated || items.length === 0) return;
    const snapshot = [...items];
    dispatch(clearWishlist());
    try {
      await clearWishlistApi();
      toast.success("Wishlist cleared");
    } catch (err) {
      dispatch(setWishlist(snapshot));
      toast.error("Failed to clear wishlist");
      void err;
    }
  }

  function isInWishlist(productId) {
    if (!productId) return false;
    return productIds.some((pId) => String(pId) === String(productId));
  }

  const wishlistCount = productIds.length;

  return {
    items,
    productIds,
    loading,
    isLoaded,
    error,
    wishlistCount,
    fetchWishlist,
    fetchWishlistIds,
    handleToggleWishlist,
    handleRemove,
    handleMoveToCart,
    handleClearAll,
    isInWishlist,
  };
}

export default useWishlist;
