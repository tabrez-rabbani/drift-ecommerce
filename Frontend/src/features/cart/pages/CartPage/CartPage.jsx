import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Trash2, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useCartRelated } from "../../hooks/useCartRelated";
import CartPageSkeleton from "../../components/CartPageSkeleton/CartPageSkeleton";
import RelatedProducts from "../../../products/components/RelatedProducts/RelatedProducts";
import RecentlyViewed from "../../../products/components/RecentlyViewed/RecentlyViewed";
import { getOptimizedImageUrl } from "../../../../utils/imageOptimizer";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();
  const {
    items,
    loading,
    totalItems,
    subtotal,
    handleIncrementQty,
    handleDecrementQty,
    handleRemoveItem,
    handleClearCart,
  } = useCart();

  const {
    related,
    loading: relatedLoading,
    loadingMore: relatedLoadingMore,
    hasMore: relatedHasMore,
    loadMore: loadMoreRelated,
  } = useCartRelated(items);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate("/login", { replace: true, state: { from: "/cart" } });
    }
  }, [isInitialized, isAuthenticated, navigate]);

  if (!isInitialized) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <CartPageSkeleton />
        </div>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const total = subtotal + deliveryCharge;

  return (
    <>
      <main className={styles.main}>
        <div className={styles.content}>
          {loading && items.length === 0 ? (
            <CartPageSkeleton />
          ) : items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.empty__icon}>
                <ShoppingBag size={48} strokeWidth={1.2} />
              </div>
              <h2 className={styles.empty__title}>Your bag is empty</h2>
              <p className={styles.empty__text}>
                Discover our curated collection and find your next favourite piece.
              </p>
              <Link to="/collection" className={styles.empty__btn}>
                Explore Collection
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.itemsSection}>
                <div className={styles.cartHeader}>
                  <h1 className={styles.cartTitle}>Shopping Bag</h1>
                  <span className={styles.cartCount}>
                    ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                </div>

                <div className={styles.tableHead}>
                  <span />
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span />
                </div>

                <div className={styles.itemsList}>
                  {items.map((item) => {
                    const productHref = item.slug ? `/product/${item.slug}` : `/product/${item.id}`;

                    return (
                      <div
                        key={`${item.id}-${item.color}-${item.size}`}
                        className={styles.cartRow}
                      >
                        <Link to={productHref} className={styles.cartRow__image}>
                          {item.image && (
                            <img
                              src={getOptimizedImageUrl(item.image, { width: 160, quality: 75 })}
                              alt={item.title}
                              className={styles.cartRow__img}
                              loading="lazy"
                            />
                          )}
                        </Link>

                        <div className={styles.cartRow__info}>
                          <Link to={productHref} className={styles.cartRow__title}>
                            {item.title}
                          </Link>
                          <p className={styles.cartRow__meta}>
                            <span>{item.color}</span>
                            <span className={styles.cartRow__sep}>/</span>
                            <span>{item.size}</span>
                            <span className={styles.cartRow__mobilePrice}>
                              {" "}· ₹{item.price.toLocaleString("en-IN")}
                            </span>
                          </p>
                        </div>

                        <div className={styles.cartRow__price}>
                          ₹{item.price.toLocaleString("en-IN")}
                        </div>

                        <div className={styles.cartRow__qty}>
                          <button
                            type="button"
                            className={styles.cartRow__qtyBtn}
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
                          <span className={styles.cartRow__qtyValue}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className={styles.cartRow__qtyBtn}
                            onClick={() =>
                              handleIncrementQty(item.id, item.color, item.size)
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className={styles.cartRow__total}>
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>

                        <button
                          type="button"
                          className={styles.cartRow__remove}
                          onClick={() => {
                            handleRemoveItem(item.id, item.color, item.size);
                            toast.info("Item removed from cart");
                          }}
                          aria-label={`Remove ${item.title}`}
                        >
                          <X size={15} strokeWidth={2} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.cartActions}>
                  <Link to="/collection" className={styles.cartActions__continue}>
                    <ArrowLeft size={14} strokeWidth={2} />
                    <span>Continue Shopping</span>
                  </Link>
                  <button
                    type="button"
                    className={styles.cartActions__clear}
                    onClick={() => {
                      handleClearCart();
                      toast.info("Cart cleared");
                    }}
                  >
                    <Trash2 size={13} strokeWidth={2} />
                    <span>Clear Bag</span>
                  </button>
                </div>
              </div>

              <div className={styles.sidebar}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryHeader}>
                    <h2 className={styles.summaryTitle}>Order Summary</h2>
                    <span className={styles.summaryCount}>
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className={styles.summaryTable}>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Subtotal</span>
                      <span className={styles.summaryValue}>
                        ₹{subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Delivery</span>
                      <span
                        className={
                          deliveryCharge === 0
                            ? styles.summaryFree
                            : styles.summaryValue
                        }
                      >
                        {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
                      <span className={styles.summaryTotalLabel}>Total</span>
                      <span className={styles.summaryTotalValue}>
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {subtotal < 999 && (
                    <p className={styles.freeShippingNote}>
                      Add ₹{(999 - subtotal).toLocaleString("en-IN")} more for free delivery
                    </p>
                  )}

                  <Link to="/checkout" className={styles.checkoutBtn}>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={15} strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <RecentlyViewed />

      {items.length > 0 && (
        <RelatedProducts
          products={related}
          loading={relatedLoading}
          loadingMore={relatedLoadingMore}
          hasMore={relatedHasMore}
          onLoadMore={loadMoreRelated}
        />
      )}
    </>
  );
}
