import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { X, ChevronDown, SlidersHorizontal, Check, ArrowDownUp } from "lucide-react";
import ProductCard from "../../../../components/ui/ProductCard/ProductCard";
import ProductCardSkeleton from "../../../../components/ui/Skeleton/ProductCardSkeleton";
import { useProducts } from "../../hooks/useProducts";
import {
  FILTER_COLORS,
  matchesColorFamily,
  PRICE_MIN_LIMIT,
  PRICE_MAX_LIMIT,
  PRICE_GAP,
} from "../../../../constants/collectionFilters";
import CollectionFilters from "./CollectionFilters";
import styles from "./CollectionTemplate.module.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function CollectionTemplate({ title, category }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get("category");
  const effectiveCategory = category && category !== "all" ? category : (queryCategory || "all");
  const isRouteCategory = Boolean(effectiveCategory && effectiveCategory !== "all");

  const {
    products,
    categories,
    pagination,
    loading,
    loadingMore,
    categoriesLoading,
    handleGetProducts,
    handleGetCategories,
  } = useProducts();

  const currentPageRef = useRef(1);
  const currentParamsRef = useRef({});
  const sentinelRef = useRef(null);
  const sortRef = useRef(null);

  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    category: false,
    price: false,
    color: false,
    availability: false,
  });

  const [filters, setFilters] = useState({
    category: isRouteCategory ? effectiveCategory : "",
    colors: [],
    minPrice: "",
    maxPrice: "",
    inStock: false,
  });

  const [sliderMin, setSliderMin] = useState(PRICE_MIN_LIMIT);
  const [sliderMax, setSliderMax] = useState(PRICE_MAX_LIMIT);

  useEffect(() => {
    handleGetCategories();
  }, [handleGetCategories]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const targetCat = isRouteCategory ? effectiveCategory : "";
    setFilters((prev) => {
      if (prev.category === targetCat) return prev;
      return { ...prev, category: targetCat };
    });
  }, [effectiveCategory, isRouteCategory]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setSortOpen(false);
        setMobileFilterOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!mobileFilterOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileFilterOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const minVal = sliderMin > PRICE_MIN_LIMIT ? String(sliderMin) : "";
      const maxVal = sliderMax < PRICE_MAX_LIMIT ? String(sliderMax) : "";
      setFilters((prev) => {
        if (prev.minPrice === minVal && prev.maxPrice === maxVal) return prev;
        return { ...prev, minPrice: minVal, maxPrice: maxVal };
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [sliderMin, sliderMax]);

  useEffect(() => {
    currentPageRef.current = 1;
    const params = {
      category: isRouteCategory ? effectiveCategory : filters.category,
      colors: filters.colors.join(","),
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock ? "true" : "",
      sort,
      limit: 20,
      page: 1,
    };
    currentParamsRef.current = params;
    handleGetProducts(params, false);
  }, [effectiveCategory, isRouteCategory, filters, sort, handleGetProducts]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || loading || !pagination.hasNextPage) return;
    const nextPage = currentPageRef.current + 1;
    currentPageRef.current = nextPage;
    const params = {
      ...currentParamsRef.current,
      page: nextPage,
      limit: 10,
    };
    handleGetProducts(params, true);
  }, [loadingMore, loading, pagination.hasNextPage, handleGetProducts]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !pagination.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "350px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, pagination.hasNextPage]);

  const toggleSection = useCallback((section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleCategoryChange = useCallback((catSlug) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === catSlug ? "" : catSlug,
    }));
  }, []);

  const handleColorToggle = useCallback((colorName) => {
    setFilters((prev) => {
      const exists = prev.colors.includes(colorName);
      return {
        ...prev,
        colors: exists ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName],
      };
    });
  }, []);

  const handleInStockToggle = useCallback(() => {
    setFilters((prev) => ({ ...prev, inStock: !prev.inStock }));
  }, []);

  const handleSliderMinChange = useCallback((e) => {
    setSliderMin((prev) => Math.min(Number(e.target.value), sliderMax - PRICE_GAP));
  }, [sliderMax]);

  const handleSliderMaxChange = useCallback((e) => {
    setSliderMax((prev) => Math.max(Number(e.target.value), sliderMin + PRICE_GAP));
  }, [sliderMin]);

  const handleClearAll = useCallback(() => {
    setSliderMin(PRICE_MIN_LIMIT);
    setSliderMax(PRICE_MAX_LIMIT);
    setFilters({
      category: "",
      colors: [],
      minPrice: "",
      maxPrice: "",
      inStock: false,
    });
    if (isRouteCategory) {
      navigate("/collection");
    }
  }, [isRouteCategory, navigate]);

  const getCategoryLabel = useCallback(
    (slug) => {
      if (!slug) return "";
      const found = categories.find((c) => c.slug?.toLowerCase() === slug.toLowerCase());
      return found ? found.name : slug.replace(/-/g, " ");
    },
    [categories]
  );

  const activeFilterCount = useMemo(() => {
    return [
      isRouteCategory || filters.category ? 1 : 0,
      filters.colors.length,
      filters.minPrice || filters.maxPrice ? 1 : 0,
      filters.inStock ? 1 : 0,
    ].reduce((a, b) => a + b, 0);
  }, [isRouteCategory, filters]);

  const colorCounts = useMemo(() => {
    const counts = {};
    FILTER_COLORS.forEach((color) => {
      counts[color.name] = products.filter((p) =>
        p.colors?.some((c) => matchesColorFamily(c.name, color.name))
      ).length;
    });
    return counts;
  }, [products]);

  const formattedProducts = useMemo(() => {
    return products.map((product) => {
      const firstColor = product.colors?.[0];
      return {
        id: product._id,
        title: product.title,
        slug: product.slug,
        price: product.price?.amount || 0,
        originalPrice: product.originalPrice?.amount,
        mainImage: firstColor?.images?.[0] || "",
        hoverImage: firstColor?.images?.[1] || firstColor?.images?.[0] || "",
        colors: (product.colors || []).map((c) => c.hex),
        colorsList: product.colors || [],
        colorName: firstColor?.name || "Default",
      };
    });
  }, [products]);

  const pageTitle = isRouteCategory
    ? getCategoryLabel(category)
    : title.replace(/-/g, " ");

  const filterProps = {
    categories,
    categoriesLoading,
    isRouteCategory,
    routeCategory: category,
    filters,
    openSections,
    toggleSection,
    handleCategoryChange,
    handleColorToggle,
    handleInStockToggle,
    sliderMin,
    sliderMax,
    handleSliderMinChange,
    handleSliderMaxChange,
    colorCounts,
  };

  return (
    <div className={styles.collection}>
      <div className={styles.toolbarWrapper}>
        <div className={`${styles.collectionContainer} ${styles.toolbar}`}>
          <div className={styles.toolbar__left}>
            {isRouteCategory ? (
              <div className={styles.breadcrumbs}>
                <Link to="/collection" className={styles.breadcrumbLink}>
                  All Collections
                </Link>
                <span className={styles.breadcrumbSep}>/</span>
                <h1 className={styles.pageTitle}>{pageTitle}</h1>
              </div>
            ) : (
              <h1 className={styles.pageTitle}>{pageTitle}</h1>
            )}
            <span className={styles.productCount}>
              {pagination.totalProducts > 0
                ? `${formattedProducts.length} of ${pagination.totalProducts} products`
                : `${formattedProducts.length} ${formattedProducts.length === 1 ? "product" : "products"}`}
            </span>
          </div>

          <div className={styles.toolbar__right}>
            <button
              type="button"
              className={styles.mobileFilterBtn}
              onClick={() => setMobileFilterOpen(true)}
              aria-label="Open filters"
            >
              <SlidersHorizontal size={20} strokeWidth={1.5} />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className={styles.filterBadge}>{activeFilterCount}</span>
              )}
            </button>

              <div className={styles.sortDropdown} ref={sortRef}>
              <button
                type="button"
                className={styles.sortToggleBtn}
                onClick={() => setSortOpen((prev) => !prev)}
                aria-expanded={sortOpen}
                aria-label="Sort products"
              >
                <ArrowDownUp size={19} strokeWidth={1.8} />
                <span>SORT</span>
              </button>
              {sortOpen && (
                <div className={styles.sortMenu} role="listbox">
                  {SORT_OPTIONS.map((option) => {
                    const isSelected = sort === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        className={`${styles.sortOption} ${isSelected ? styles.sortOptionSelected : ""}`}
                        onClick={() => {
                          setSort(option.value);
                          setSortOpen(false);
                        }}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check size={14} className={styles.sortCheckIcon} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className={styles.activeFiltersBar}>
          <div className={`${styles.collectionContainer} ${styles.activeFiltersInner}`}>
            {isRouteCategory ? (
              <button
                type="button"
                className={styles.filterPill}
                onClick={handleClearAll}
              >
                {getCategoryLabel(category)} <X size={14} />
              </button>
            ) : filters.category ? (
              <button
                type="button"
                className={styles.filterPill}
                onClick={() => handleCategoryChange("")}
              >
                {getCategoryLabel(filters.category)} <X size={14} />
              </button>
            ) : null}
            {filters.colors.map((c) => (
              <button
                key={c}
                type="button"
                className={styles.filterPill}
                onClick={() => handleColorToggle(c)}
              >
                {c} <X size={14} />
              </button>
            ))}
            {(filters.minPrice || filters.maxPrice) && (
              <button
                type="button"
                className={styles.filterPill}
                onClick={() => {
                  setSliderMin(PRICE_MIN_LIMIT);
                  setSliderMax(PRICE_MAX_LIMIT);
                  setFilters((prev) => ({ ...prev, minPrice: "", maxPrice: "" }));
                }}
              >
                ₹{Number(filters.minPrice || 0).toLocaleString("en-IN")} — ₹{Number(filters.maxPrice || PRICE_MAX_LIMIT).toLocaleString("en-IN")} <X size={14} />
              </button>
            )}
            {filters.inStock && (
              <button
                type="button"
                className={styles.filterPill}
                onClick={handleInStockToggle}
              >
                In Stock <X size={14} />
              </button>
            )}
            <button type="button" className={styles.clearAllBtn} onClick={handleClearAll}>
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className={`${styles.collectionContainer} ${styles.mainLayout}`}>
        <aside className={styles.sidebar} aria-label="Product filters">
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Filters</h2>
            {activeFilterCount > 0 && (
              <button type="button" className={styles.sidebarClear} onClick={handleClearAll}>
                Clear All
              </button>
            )}
          </div>
          <CollectionFilters {...filterProps} />
        </aside>

        <section className={styles.gridSection}>
          {loading ? (
            <div className={styles.grid}>
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : formattedProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No products found</p>
              <p className={styles.emptyText}>Try adjusting your filters to discover more products.</p>
              {activeFilterCount > 0 && (
                <button type="button" className={styles.emptyBtn} onClick={handleClearAll}>
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {formattedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
                {loadingMore &&
                  Array.from({ length: 4 }).map((_, idx) => (
                    <ProductCardSkeleton key={`more-${idx}`} />
                  ))}
              </div>
              {pagination.hasNextPage && (
                <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
              )}
              {!pagination.hasNextPage && formattedProducts.length > 0 && (
                <p className={styles.endOfResults}>You&apos;ve seen all {formattedProducts.length} products</p>
              )}
            </>
          )}
        </section>
      </div>

      <div
        className={`${styles.drawerOverlay} ${mobileFilterOpen ? styles.drawerOverlayVisible : ""}`}
        onClick={() => setMobileFilterOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`${styles.drawer} ${mobileFilterOpen ? styles.drawerOpen : ""}`}
        aria-label="Mobile filters"
        aria-hidden={!mobileFilterOpen}
      >
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>Filters</h2>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={() => setMobileFilterOpen(false)}
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>
        <div className={styles.drawerBody}>
          <CollectionFilters {...filterProps} />
        </div>
        <div className={styles.drawerFooter}>
          <button type="button" className={styles.drawerClearBtn} onClick={handleClearAll}>
            Clear All
          </button>
          <button
            type="button"
            className={styles.drawerApplyBtn}
            onClick={() => setMobileFilterOpen(false)}
          >
            Show {formattedProducts.length} Results
          </button>
        </div>
      </aside>
    </div>
  );
}
