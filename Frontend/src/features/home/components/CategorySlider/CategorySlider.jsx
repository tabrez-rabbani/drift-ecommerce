import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useProducts } from "../../../products/hooks/useProducts";
import { fadeUp, fadeIn } from "../../../../utils/animations";

import "swiper/css";
import styles from "./CategorySlider.module.css";

const PREFERRED_MOBILE_ORDER = [
  "shirts",
  "trousers",
  "t-shirts",
  "jeans",
  "cargos",
  "polos",
  "outerwear",
  "plus-size",
  "sneakers",
];

export default function CategorySlider() {
  const { categories, handleGetCategories } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    handleGetCategories();
  }, [handleGetCategories]);

  function handleCategoryClick(slug) {
    navigate(`/collection/${slug}`);
  }

  const isLoading = !categories || categories.length === 0;

  if (isLoading) {
    return (
      <section className={styles.section} aria-label="Shop by Category" aria-busy="true">
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.titleWrap}>
              <div className={styles.skelEyebrow} />
              <div className={styles.skelTitle} />
              <div className={styles.accentBar} />
            </div>
          </div>

          <div className={styles.skeletonRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.skelCard} />
            ))}
          </div>

          <div className={styles.mobileSkeletonGrid}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={styles.mobileSkelCard}>
                <div className={styles.mobileSkelContent} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const mobileCategories = [...categories].sort((a, b) => {
    const idxA = PREFERRED_MOBILE_ORDER.indexOf(a.slug);
    const idxB = PREFERRED_MOBILE_ORDER.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return (a.order || 0) - (b.order || 0);
  });

  return (
    <section className={styles.section} aria-label="Shop by Category">
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className={styles.titleWrap}>
            <span className={styles.titleEyebrow}>SHOP BY</span>
            <h2 className={styles.titleMain}>CATEGORY</h2>
            <div className={styles.accentBar} />
          </div>
        </motion.div>

        <motion.div
          className={styles.sliderWrapper}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className={styles.desktopSlider}>
            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={categories.length > 5}
              speed={700}
              grabCursor={true}
              slidesPerView={5}
              spaceBetween={24}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 12 },
                576: { slidesPerView: 2.5, spaceBetween: 16 },
                768: { slidesPerView: 3.5, spaceBetween: 20 },
                1024: { slidesPerView: 4.5, spaceBetween: 22 },
                1280: { slidesPerView: 5, spaceBetween: 24 },
              }}
              className={styles.swiper}
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat._id || cat.slug} className={styles.slide}>
                  <div
                    className={styles.card}
                    onClick={() => handleCategoryClick(cat.slug)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCategoryClick(cat.slug);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.imageWrapper}>
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className={styles.image}
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className={styles.mobileGrid}>
            {mobileCategories.map((cat) => (
              <div
                key={cat._id || cat.slug}
                className={styles.mobileCard}
                onClick={() => handleCategoryClick(cat.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCategoryClick(cat.slug);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={cat.name}
              >
                <div className={styles.mobileImageWrapper}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={styles.mobileImage}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.footer}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
        >
          <Link to="/collection" className={styles.shopAll}>
            SHOP ALL
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
