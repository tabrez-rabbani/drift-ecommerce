import ProductCard from "../../../../components/ui/ProductCard/ProductCard";
import ProductCardSkeleton from "../../../../components/ui/Skeleton/ProductCardSkeleton";
import styles from "./SearchResults.module.css";

const SKELETON_COUNT = 8;

export default function SearchResults({
  loading = false,
  query = "",
  products = [],
  totalResults = 0,
}) {
  if (loading) {
    return (
      <section aria-label="Loading search results" aria-busy="true">
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>Searching...</h2>
        </div>
        <div className={styles.grid}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Search results">
      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>
          Results for <span className={styles.resultsQuery}>"{query}"</span>
        </h2>
        <span className={styles.resultsCount}>
          {totalResults} {totalResults === 1 ? "Product" : "Products"} Found
        </span>
      </div>

      <div className={styles.grid}>
        {products.map((product) => {
          const firstColor = product.colors?.[0];
          const cardProps = {
            id: product._id || product.id,
            title: product.title,
            slug: product.slug,
            price: product.price?.amount || 0,
            originalPrice: product.originalPrice?.amount,
            mainImage: firstColor?.images?.[0] || "",
            hoverImage: firstColor?.images?.[1] || firstColor?.images?.[0] || "",
            colors: (product.colors || []).map((c) => c.hex),
            colorsList: product.colors || [],
            sizes: (product.sizes || [])
              .map((s) => (typeof s === "string" ? s : s?.size || s?.name || ""))
              .filter(Boolean),
          };

          return <ProductCard key={cardProps.id || cardProps.slug} {...cardProps} />;
        })}
      </div>
    </section>
  );
}
