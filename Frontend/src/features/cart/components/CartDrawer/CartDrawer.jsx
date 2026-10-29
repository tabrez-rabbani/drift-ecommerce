import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../../auth/hooks/useAuth";
import { getOptimizedImageUrl } from "../../../../utils/imageOptimizer";
import styles from "./CartDrawer.module.css";

const CART_SKELETON_COUNT = 3;

function CartItemSkeleton() {
  return (
    <li className={styles.skelItem} aria-hidden="true">
      <div className={styles.skelImage} />
      <div className={styles.skelDetails}>
        <div className={styles.skelLine} />
        <div className={styles.skelLine} />
        <div className={styles.skelLine} />
        <div className={styles.skelQtyRow}>
          <div className={styles.skelQtyBtn} />
          <div className={styles.skelQtyNum} />
          <div className={styles.skelQtyBtn} />
          <div className={styles.skelPrice} />
        </div>
      </div>
    </li>
  );
}

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function CartDrawer() {
  const { isAuthenticated } = useAuth();
  const {
    items,
    isOpen,
    loading,
    totalItems,
    subtotal,
    handleGetCart,
    handleCloseCart,
    handleIncrementQty,
    handleDecrementQty,
    handleRemoveItem,
  } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      handleGetCart();
    }
  }, [isAuthenticated, handleGetCart]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") handleCloseCart();
    }

    document.addEventListener("keydown", handleKeyDown);
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen, handleCloseCart]);

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles["overlay--open"] : ""}`}
        onClick={handleCloseCart}
        aria-hidden="true"
      />

      <aside
        className={`${styles.drawer} ${isOpen ? styles["drawer--open"] : ""}`}
        aria-label="Shopping bag"
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.drawer__header}>
          <h2 className={styles.drawer__title}>
            Cart
            {totalItems > 0 && (
              <span className={styles.drawer__count}>({totalItems})</span>
            )}
          </h2>
          <button
            type="button"
            className={styles.drawer__close}
            onClick={handleCloseCart}
            aria-label="Close cart drawer"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {loading && items.length === 0 ? (
          <ul className={styles.drawer__items}>
            {Array.from({ length: CART_SKELETON_COUNT }).map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className={styles.drawer__empty}>
            <ShoppingBag size={44} strokeWidth={1.2} className={styles.drawer__emptyIcon} />
            <p className={styles.drawer__emptyText}>Your cart is empty</p>
            <p className={styles.drawer__emptySubtext}>Looks like you haven't added anything to your cart yet.</p>
            <button
              type="button"
              className={styles.drawer__shopBtn}
              onClick={handleCloseCart}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.drawer__items}>
              {items.map((item) => {
                const itemKey = `${item.id}-${item.color}-${item.size}`;
                const productHref = item.slug ? `/product/${item.slug}` : `/product/${item.id}`;

                return (
                  <li key={itemKey} className={styles.item}>
                    <div className={styles.item__imageWrapper}>
                      <button
                        type="button"
                        className={styles.item__remove}
                        onClick={() => {
                          handleRemoveItem(item.id, item.color, item.size);
                          toast.info("Item removed from cart");
                        }}
                        aria-label={`Remove ${item.title}`}
                      >
                        <X size={13} strokeWidth={2.2} />
                      </button>

                      {item.image ? (
                        <img
                          src={getOptimizedImageUrl(item.image, { width: 160, quality: 75 })}
                          alt={item.title}
                          className={styles.item__image}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.item__image} />
                      )}
                    </div>

                    <div className={styles.item__details}>
                      <Link
                        to={productHref}
                        className={styles.item__title}
                        onClick={handleCloseCart}
                      >
                        {item.title}
                      </Link>

                      <p className={styles.item__meta}>
                        {item.color} {item.size ? `/ ${item.size}` : ""}
                      </p>

                      <div className={styles.item__bottom}>
                        <div className={styles.item__qty}>
                          <button
                            type="button"
                            className={styles.item__qtyBtn}
                            onClick={() => {
                              if (item.quantity <= 1) {
                                toast.info("Item removed from cart");
                              }
                              handleDecrementQty(item.id, item.color, item.size);
                            }}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className={styles.item__qtyCount}>{item.quantity}</span>
                          <button
                            type="button"
                            className={styles.item__qtyBtn}
                            onClick={() =>
                              handleIncrementQty(item.id, item.color, item.size)
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <span className={styles.item__price}>
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className={styles.drawer__footer}>
              <div className={styles.drawer__subtotal}>
                <span className={styles.drawer__subtotalLabel}>Subtotal:</span>
                <span className={styles.drawer__subtotalPrice}>
                  {formatINR(subtotal)}
                </span>
              </div>

              <Link
                to="/cart"
                className={styles.drawer__checkoutBtn}
                onClick={handleCloseCart}
              >
                View Cart & Checkout
              </Link>

              <p className={styles.drawer__shipping}>
                Free Shipping on All Orders Over ₹999!
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
