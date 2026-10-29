import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { scaleUp, fadeUp } from "../../../../utils/animations";

import "swiper/css";
import styles from "./SaleBanner.module.css";

const DEAL_CARDS = [
  { id: 1, src: "/images/sale_banner/image1.webp", alt: "3 Top Wear ₹2699", href: "/collection/t-shirts" },
  { id: 2, src: "/images/sale_banner/image2.webp", alt: "2 Bottom Wear ₹2899", href: "/collection/trousers" },
  { id: 3, src: "/images/sale_banner/image3.webp", alt: "Shirts under ₹999", href: "/collection/shirts" },
  { id: 4, src: "/images/sale_banner/image4.webp", alt: "Jeans Bestsellers", href: "/collection/jeans" },
  { id: 5, src: "/images/sale_banner/image5.webp", alt: "Sneakers Collection", href: "/collection/sneakers" },
];

export default function SaleBanner() {
  return (
    <section className={styles.section} aria-label="Sale Deals">
      <motion.div
        variants={scaleUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-70px" }}
      >
        <Link to="/collection" className={styles.bannerLink}>
          <img
            src="/images/sale_banner/drift_modern_summer_style_banner.webp"
            alt="Look Good Live More — Drift Summer Sale"
            className={styles.bannerImage}
            loading="lazy"
          />
        </Link>
      </motion.div>

      <motion.div
        className={styles.dealsStrip}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        <Swiper
          modules={[FreeMode]}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.5 }}
          grabCursor={true}
          speed={500}
          breakpoints={{
            0:    { slidesPerView: 1.15, spaceBetween: 8 },
            480:  { slidesPerView: 2.1, spaceBetween: 10 },
            768:  { slidesPerView: 4.3, spaceBetween: 12 },
            1024: { slidesPerView: 4.5, spaceBetween: 14 },
          }}
          className={styles.swiper}
        >
          {DEAL_CARDS.map((card) => (
            <SwiperSlide key={card.id} className={styles.dealSlide}>
              <Link to={card.href} className={styles.dealLink}>
                <img
                  src={card.src}
                  alt={card.alt}
                  className={styles.dealImage}
                  draggable={false}
                  loading="lazy"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
}
