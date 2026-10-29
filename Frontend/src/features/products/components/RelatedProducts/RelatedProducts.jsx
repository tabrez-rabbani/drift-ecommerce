import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../../../components/ui/ProductCard/ProductCard";
import { fadeUp } from "../../../../utils/animations";
import styles from "./RelatedProducts.module.css";

const SKELETON_COUNT = 5;

function RelatedProductsSkeleton() {
  return (
    <div className={styles.related__grid}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className={styles.skeleton}>
          <div className={styles.skeleton__image} />
          <div className={styles.skeleton__title} />
          <div className={styles.skeleton__price} />
        </div>
      ))}
    </div>
  );
}

export default function RelatedProducts({
  products = [],
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
}) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loadingMore || loading || !onLoadMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: "350px",
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadingMore, loading, onLoadMore]);

  if (!loading && products.length === 0) return null;

  return (
    <section className={styles.related} aria-label="You may also like">
      <motion.h2
        className={styles.related__heading}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        You May Also Like
      </motion.h2>

      {loading ? (
        <RelatedProductsSkeleton />
      ) : (
        <>
          <div className={styles.related__grid}>
            {products.map((product) => {
              const colors = Array.isArray(product.colors)
                ? product.colors.map((c) => c.hex).filter(Boolean)
                : [];
              const mainImage = product.colors?.[0]?.images?.[0] || product.images?.[0] || "";
              const hoverImage = product.colors?.[0]?.images?.[1] || product.images?.[1] || "";

              return (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.title}
                  price={product.price?.amount}
                  originalPrice={product.originalPrice?.amount}
                  mainImage={mainImage}
                  hoverImage={hoverImage}
                  colors={colors}
                  colorsList={product.colors}
                  sizes={product.sizes}
                  slug={product.slug}
                />
              );
            })}

            {loadingMore &&
              Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={`loading-more-${i}`} className={styles.skeleton}>
                  <div className={styles.skeleton__image} />
                  <div className={styles.skeleton__title} />
                  <div className={styles.skeleton__price} />
                </div>
              ))}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
          )}
        </>
      )}
    </section>
  );
}
