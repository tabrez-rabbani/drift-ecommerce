import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartItems,
  openCart,
  closeCart,
  setCartLoading,
  setCartError,
  clearCart,
} from "../state/cart.slice";
import {
  getCartApi,
  addToCartApi,
  incrementCartQtyApi,
  decrementCartQtyApi,
  removeCartItemApi,
} from "../services/cart.api";
import { useAuth } from "../../auth/hooks/useAuth";

export function useCart() {
  const dispatch = useDispatch();
  const { items, isOpen, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useAuth();

  const handleGetCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      dispatch(setCartLoading(true));
      const res = await getCartApi();
      if (res?.success && Array.isArray(res.cart?.items)) {
        const parsedItems = res.cart.items
          .filter((item) => Boolean(item && item.product && (item.product._id || item.product.title)))
          .map((item) => {
            const product = item.product || {};
            const colorObj = product.colors?.find(
              (c) => c.name?.toLowerCase() === item.color?.toLowerCase()
            );
            const image =
              colorObj?.images?.[0] || product.colors?.[0]?.images?.[0] || "";

            return {
              id: product._id || item.product,
              title: product.title || "Product",
              slug: product.slug || "",
              price:
                item.currentPrice?.amount ||
                product.price?.amount ||
                item.price?.amount ||
                0,
              image,
              color: item.color,
              size: item.size,
              quantity: item.quantity || 1,
            };
          })
          .filter((item) => Boolean(item.id && (item.price > 0 || item.title !== "Product")));

        dispatch(setCartItems(parsedItems));
      } else {
        dispatch(setCartItems([]));
      }
    } catch (err) {
      dispatch(setCartError(err.message || "Failed to load cart"));
    } finally {
      dispatch(setCartLoading(false));
    }
  }, [isAuthenticated, dispatch]);

  async function handleAddToCart(
    {
      id,
      title,
      slug,
      price,
      image,
      color,
      size,
      quantity = 1,
    },
    openDrawer = true
  ) {
    const existingIndex = items.findIndex(
      (item) => item.id === id && item.color === color && item.size === size
    );

    let updatedItems;
    if (existingIndex > -1) {
      updatedItems = items.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [
        ...items,
        { id, title, slug, price, image, color, size, quantity },
      ];
    }

    dispatch(setCartItems(updatedItems));
    if (openDrawer) {
      dispatch(openCart());
    } else {
      dispatch(closeCart());
    }

    if (isAuthenticated && id) {
      try {
        await addToCartApi(id, { color, size, quantity });
      } catch (err) {
        void err;
      }
    }
  }

  async function handleIncrementQty(id, color, size) {
    const updated = items.map((item) =>
      item.id === id && item.color === color && item.size === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    dispatch(setCartItems(updated));

    if (isAuthenticated && id) {
      try {
        await incrementCartQtyApi(id, { color, size });
      } catch (err) {
        void err;
      }
    }
  }

  async function handleDecrementQty(id, color, size) {
    const targetItem = items.find(
      (item) => item.id === id && item.color === color && item.size === size
    );
    if (!targetItem) return;

    let updated;
    if (targetItem.quantity <= 1) {
      updated = items.filter(
        (item) => !(item.id === id && item.color === color && item.size === size)
      );
    } else {
      updated = items.map((item) =>
        item.id === id && item.color === color && item.size === size
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    }
    dispatch(setCartItems(updated));

    if (isAuthenticated && id) {
      try {
        await decrementCartQtyApi(id, { color, size });
      } catch (err) {
        void err;
      }
    }
  }

  async function handleRemoveItem(id, color, size) {
    const updated = items.filter(
      (item) => !(item.id === id && item.color === color && item.size === size)
    );
    dispatch(setCartItems(updated));

    if (isAuthenticated && id) {
      try {
        await removeCartItemApi(id, { color, size });
      } catch (err) {
        void err;
      }
    }
  }

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return {
    items,
    isOpen,
    loading,
    error,
    totalItems,
    subtotal,
    handleGetCart,
    handleAddToCart,
    handleIncrementQty,
    handleDecrementQty,
    handleRemoveItem,
    handleOpenCart: () => dispatch(openCart()),
    handleCloseCart: () => dispatch(closeCart()),
    handleClearCart: () => dispatch(clearCart()),
  };
}

export default useCart;
