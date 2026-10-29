import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../../../components/ui/ProductCard/ProductCard";
import { getRecentlyViewed } from "../../utils/recentlyViewed";
import { fadeUp } from "../../../../utils/animations";
import styles from "./RecentlyViewed.module.css";

export default function RecentlyViewed({ currentProductId }) {
  const [items, setItems] = useState(() => getRecentlyViewed(currentProductId));

  useEffect(() => {
    setItems(getRecentlyViewed(currentProductId));
  }, [currentProductId]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} aria-label="Recently viewed products">
      <motion.h2
        className={styles.heading}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        Recently Viewed
      </motion.h2>

      <div className={styles.grid}>
        {items.map((product) => {
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
              price={product.price?.amount ?? product.price}
              originalPrice={product.originalPrice?.amount ?? product.originalPrice}
              mainImage={mainImage}
              hoverImage={hoverImage}
              colors={colors}
              colorsList={product.colors}
              sizes={product.sizes}
              slug={product.slug}
            />
          );
        })}
      </div>
    </section>
  );
}
