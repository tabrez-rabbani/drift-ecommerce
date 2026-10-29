import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchProducts } from "../../../products/services/products.api";
import ProductCard from "../../../../components/ui/ProductCard/ProductCard";
import ProductCardSkeleton from "../../../../components/ui/Skeleton/ProductCardSkeleton";
import { TRENDING_CATEGORIES } from "../../constants/trendingCategories";
import { fadeUp, fadeIn } from "../../../../utils/animations";
import styles from "./TrendingSection.module.css";

const INITIAL_LIMIT = 15;
const BATCH_LIMIT = 10;
const MAX_HOMEPAGE_PRODUCTS = 35;

export default function TrendingSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    setPage(1);
  };

  const currentCategory = TRENDING_CATEGORIES.find((t) => t.id === activeTab);
  const categoryLabel = currentCategory?.label || "ALL";
  const collectionLink =
    activeTab === "all"
      ? "/collection"
      : `/collection/${currentCategory?.categories?.[0] || activeTab}`;

  useEffect(() => {
    let isMounted = true;
    isFetchingRef.current = true;

    async function loadTrendingProducts() {
      try {
        setLoading(true);
        const categoryConfig = TRENDING_CATEGORIES.find((t) => t.id === activeTab);
        const params = { page: 1, limit: INITIAL_LIMIT, sort: "newest" };

        if (categoryConfig?.categories?.length > 0) {
          params.categories = categoryConfig.categories.join(",");
        }

        const data = await fetchProducts(params);
        if (isMounted) {
          if (data?.success && Array.isArray(data.products)) {
            setProducts(data.products);
            const hasNext = data.pagination
              ? Boolean(data.pagination.hasNextPage)
              : data.products.length >= INITIAL_LIMIT;
            setHasMore(hasNext && data.products.length < MAX_HOMEPAGE_PRODUCTS);
          } else {
            setProducts([]);
            setHasMore(false);
          }
          setPage(1);
        }
      } catch {
        if (isMounted) {
          setProducts([]);
          setHasMore(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          isFetchingRef.current = false;
        }
      }
    }

    loadTrendingProducts();

    return () => {
      isMounted = false;
      isFetchingRef.current = false;
    };
  }, [activeTab]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore || isFetchingRef.current || products.length >= MAX_HOMEPAGE_PRODUCTS)
      return;

    try {
      isFetchingRef.current = true;
      setLoadingMore(true);
      const nextPage = page + 1;
      const categoryConfig = TRENDING_CATEGORIES.find((t) => t.id === activeTab);
      const params = { page: nextPage, limit: BATCH_LIMIT, sort: "newest" };

      if (categoryConfig?.categories?.length > 0) {
        params.categories = categoryConfig.categories.join(",");
      }

      const data = await fetchProducts(params);
      if (data?.success && Array.isArray(data.products)) {
        let totalCount = 0;
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          const newUnique = data.products.filter((p) => !existingIds.has(p._id));
          const updated = [...prev, ...newUnique];
          totalCount = updated.length;
          return updated;
        });
        setPage(nextPage);

        const hasNext = data.pagination
          ? Boolean(data.pagination.hasNextPage)
          : data.products.length >= BATCH_LIMIT;

        setHasMore(hasNext && totalCount < MAX_HOMEPAGE_PRODUCTS);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [loadingMore, hasMore, page, activeTab, products.length]);

  useEffect(() => {
    if (!hasMore || loadingMore || loading) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "350px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadingMore, loading, handleLoadMore]);

  const trendingProducts = useMemo(() => {
    return products.map((product) => {
      const activeColor =
        product.colors?.find((c) => Array.isArray(c.images) && c.images.length > 0) ||
        product.colors?.[0];
      const mainImage = activeColor?.images?.[0] || "";
      const hoverImage = activeColor?.images?.[1] || mainImage;

      return {
        id: product._id,
        title: product.title,
        slug: product.slug,
        price: product.price?.amount || 0,
        originalPrice: product.originalPrice?.amount,
        mainImage,
        hoverImage,
        colors: (product.colors || []).map((c) => c.hex),
        colorsList: product.colors || [],
        colorName: activeColor?.name || "Default",
        sizes: product.sizes || [],
      };
    });
  }, [products]);

  return (
    <section className={styles.products} aria-label="Trending Products">
      <div className={styles.container}>
        <motion.div
          className={styles.products__header}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <h2 className={styles.products__title}>TRENDING</h2>
          <Link to={collectionLink} className={styles.products__viewAll}>
            View All {categoryLabel !== "ALL" ? categoryLabel : ""}{" "}
            <ArrowRight className={styles.products__arrow} size={16} strokeWidth={2.5} />
          </Link>
        </motion.div>

        <motion.div
          className={styles.tabs}
          role="tablist"
          aria-label="Trending Categories"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {TRENDING_CATEGORIES.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className={styles.products__grid}>
            {Array.from({ length: INITIAL_LIMIT }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : trendingProducts.length === 0 ? (
          <div className={styles.products__empty}>
            <p>No products found in this category.</p>
          </div>
        ) : (
          <>
            <div className={styles.products__grid}>
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
              {loadingMore &&
                Array.from({ length: 5 }).map((_, idx) => (
                  <ProductCardSkeleton key={`loading-more-${idx}`} />
                ))}
            </div>

            {hasMore && (
              <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
            )}
          </>
        )}

        {products.length > 0 && (
          <motion.div
            className={styles.bottomActions}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <Link to={collectionLink} className={styles.viewAllBtn}>
              Explore All {categoryLabel !== "ALL" ? categoryLabel : "Products"}{" "}
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
