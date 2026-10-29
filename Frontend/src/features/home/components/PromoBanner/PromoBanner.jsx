import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { scaleUp } from "../../../../utils/animations";
import styles from "./PromoBanner.module.css";

export default function PromoBanner() {
  return (
    <motion.section
      className={styles.banner}
      aria-label="Promotional Banner"
      variants={scaleUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <Link to="/collection" className={styles.banner__link}>
        <img
          src="/images/drift_style_up_save_big.webp"
          alt="Last few bestsellers left Up to 30% off"
          className={styles.banner__image}
          loading="lazy"
        />
      </Link>
    </motion.section>
  );
}
