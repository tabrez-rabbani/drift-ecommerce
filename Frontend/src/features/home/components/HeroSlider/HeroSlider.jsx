import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { fetchHeroSlides } from "../../services/home.api";
import { fadeIn } from "../../../../utils/animations";

import "swiper/css";
import styles from "./HeroSlider.module.css";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadSlides() {
      try {
        const data = await fetchHeroSlides();
        if (isMounted && data?.success && Array.isArray(data.slides)) {
          setSlides(data.slides);
        }
      } catch {
        if (isMounted) setSlides([]);
      }
    }

    loadSlides();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleSlideClick(slide) {
    if (!slide.ctaLink) return;
    const link = slide.ctaLink.trim();
    if (link.startsWith("http://") || link.startsWith("https://")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  }

  if (slides.length === 0) {
    return (
      <section className={styles.heroWrapper} aria-label="Hero Carousel" aria-busy="true">
        <div className={styles.heroSkeleton} />
      </section>
    );
  }

  return (
    <motion.section
      className={styles.heroWrapper}
      aria-label="Hero Carousel"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={slides.length > 1}
        speed={3000}
        grabCursor={true}
        slidesPerView={1}
        className={styles.swiper}
      >
        {slides.map((slide, idx) => {
          const desktopSrc = (slide.desktopImage || "").replace(/\.png$/i, ".webp");
          const mobileSrc = (slide.mobileImage || slide.desktopImage || "").replace(/\.png$/i, ".webp");
          const isFirst = idx === 0;

          return (
            <SwiperSlide
              key={slide._id || slide.id}
              className={`${styles.slide} ${slide.ctaLink ? styles.slideClickable : ""}`}
              onClick={() => handleSlideClick(slide)}
            >
              <picture>
                <source media="(max-width: 1024px)" srcSet={mobileSrc} />
                <img
                  src={desktopSrc}
                  alt={slide.title || ""}
                  className={styles.slideImage}
                  draggable={false}
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : "low"}
                  decoding="async"
                />
              </picture>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </motion.section>
  );
}
