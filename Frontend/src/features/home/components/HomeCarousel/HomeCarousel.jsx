import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { fadeUp } from "../../../../utils/animations";

import "swiper/css";
import styles from "./HomeCarousel.module.css";

const SLIDES = [
  { id: 1, src: "/images/home_crasole/image1.webp", alt: "Formal Shirts", href: "/collection/formal-shirts" },
  { id: 2, src: "/images/home_crasole/image2.webp", alt: "Hand Embroidered", href: "/collection/embroidered-shirts" },
  { id: 3, src: "/images/home_crasole/image3.webp", alt: "Jacquard Shirts", href: "/collection/jacquard-shirts" },
  { id: 4, src: "/images/home_crasole/image4.webp", alt: "Striped Shirts", href: "/collection/striped-shirts" },
  { id: 5, src: "/images/home_crasole/image5.webp", alt: "Printed Shirts", href: "/collection/printed-shirts" },
  { id: 6, src: "/images/home_crasole/image6.webp", alt: "Checked Shirts", href: "/collection/checked-shirts" },
  { id: 7, src: "/images/home_crasole/image7.webp", alt: "Linen Shirts", href: "/collection/linen-shirts" },
];

export default function HomeCarousel() {
  return (
    <motion.section
      className={styles.carousel}
      aria-label="Featured Categories"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        speed={800}
        spaceBetween={8}
        grabCursor={true}
        className={styles.swiper}
        breakpoints={{
          0:    { slidesPerView: 1.2 },
          640:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id} className={styles.slide}>
            <Link to={slide.href} className={styles.slideLink}>
              <img
                src={slide.src}
                alt={slide.alt}
                className={styles.slideImage}
                draggable={false}
                loading="lazy"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
}
