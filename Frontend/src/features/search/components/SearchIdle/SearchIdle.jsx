import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../../products/hooks/useProducts";
import TrendingSection from "../../../home/components/TrendingSection/TrendingSection";
import styles from "./SearchIdle.module.css";

// Optimizes ImageKit CDN URLs for lightweight, fast thumbnail delivery
const getOptimizedThumb = (url) => {
  if (!url || typeof url !== "string") return "";
  if (url.includes("ik.imagekit.io")) {
    return url.includes("?")
      ? `${url}&tr=w-320,q-80,f-auto`
      : `${url}?tr=w-320,q-80,f-auto`;
  }
  return url;
};

export default function SearchIdle({ onSelectSuggestion }) {
  const { categories, handleGetCategories, categoriesLoading } = useProducts();

  useEffect(() => {
    if (!categories || categories.length === 0) {
      handleGetCategories();
    }
  }, [categories, handleGetCategories]);

  const isLoading = categoriesLoading && (!categories || categories.length === 0);

  return (
    <div className={styles.idleContainer}>
      <div className={styles.topSearchesContainer}>
        <section className={styles.topSearchesSection} aria-label="Top Searches">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Popular Right Now</span>
            <h2 className={styles.sectionTitle}>Top Searches</h2>
          </div>

          <div className={styles.searchesGrid}>
            {isLoading
              ? Array.from({ length: 9 }).map((_, idx) => (
                  <div key={idx} className={styles.searchCard}>
                    <div className={`${styles.imageContainer} ${styles.skeleton}`} />
                  </div>
                ))
              : (categories || []).map((cat) => (
                  <Link
                    key={cat._id || cat.slug}
                    to={`/search?q=${encodeURIComponent(cat.name)}`}
                    className={styles.searchCard}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectSuggestion?.(cat.name);
                    }}
                    aria-label={`Search for ${cat.name}`}
                  >
                    <div className={styles.imageContainer}>
                      <img
                        src={getOptimizedThumb(cat.image)}
                        alt={cat.name}
                        className={styles.image}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        <div className={styles.sectionDivider} role="separator" aria-hidden="true" />
      </div>

      <TrendingSection />
    </div>
  );
}
