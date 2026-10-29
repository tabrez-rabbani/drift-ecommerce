import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useWishlist } from "../../hooks/useWishlist";
import { useRelatedProducts } from "../../../products/hooks/useRelatedProducts";
import WishlistCard from "../../components/WishlistCard/WishlistCard";
import WishlistEmpty from "../../components/WishlistEmpty/WishlistEmpty";
import WishlistSkeleton from "../../components/WishlistSkeleton/WishlistSkeleton";
import RelatedProducts from "../../../products/components/RelatedProducts/RelatedProducts";
import RecentlyViewed from "../../../products/components/RecentlyViewed/RecentlyViewed";
import styles from "./WishlistPage.module.css";

export default function WishlistPage() {
  const { isAuthenticated, isInitialized } = useAuth();
  const {
    items,
    loading,
    fetchWishlist,
    handleRemove,
    handleMoveToCart,
    handleClearAll,
  } = useWishlist();

  useEffect(() => {
    if (isInitialized) {
      fetchWishlist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isAuthenticated]);

  const showSkeleton = !isInitialized || (loading && items.length === 0);
  const showEmpty = isInitialized && !loading && items.length === 0;

  const firstItem = items[0] ?? null;
  const categoryId = firstItem?.category?._id || firstItem?.category || null;
  const productId = firstItem?._id || firstItem?.id || null;

  const {
    related,
    loading: relatedLoading,
    loadingMore: relatedLoadingMore,
    hasMore: relatedHasMore,
    loadMore: loadMoreRelated,
  } = useRelatedProducts(categoryId, productId);

  return (
    <>
      <main className={styles.page}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Wishlist</h1>
            {!loading && items.length > 0 && (
              <span className={styles.itemCount}>
                {items.length} {items.length === 1 ? "Item" : "Items"}
              </span>
            )}
          </div>

          {/* Initial Loading Skeleton */}
          {showSkeleton && <WishlistSkeleton />}

          {/* Empty State: Guest with no items OR Authenticated with no items */}
          {showEmpty && (
            <WishlistEmpty isLoggedOut={!isAuthenticated} />
          )}

          {/* Has Items: Works for both Guest and Authenticated users */}
          {!loading && items.length > 0 && (
            <>
              {/* Guest banner informing user that items are stored locally on this device */}
              {!isAuthenticated && (
                <div className={styles.guestBanner}>
                  <div className={styles.guestBannerContent}>
                    <span className={styles.guestBannerBadge}>Local Wishlist</span>
                    <p className={styles.guestBannerText}>
                      These items are saved in this browser. Sign in to save them to your account and sync across all your devices.
                    </p>
                  </div>
                  <Link to="/login" className={styles.guestBannerBtn}>
                    Sign In
                  </Link>
                </div>
              )}

              <div className={styles.topBar}>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className={styles.clearAllBtn}
                >
                  Clear Wishlist
                </button>
              </div>

              <div className={styles.grid}>
                <AnimatePresence mode="popLayout">
                  {items.map((product) => {
                    const pId = String(product._id || product.id);
                    return (
                      <motion.div
                        key={pId}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.88,
                          transition: { duration: 0.22, ease: "easeOut" },
                        }}
                        transition={{ layout: { duration: 0.28, ease: "easeInOut" } }}
                      >
                        <WishlistCard
                          product={product}
                          onRemove={handleRemove}
                          onMoveToBag={handleMoveToCart}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
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
