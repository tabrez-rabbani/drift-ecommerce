import { Link } from "react-router-dom";
import styles from "./CampaignBanner.module.css";

export default function CampaignBanner() {
  return (
    <section className={styles.section} aria-label="T-Shirts Campaign">
      <Link to="/collection/t-shirts" className={styles.bannerLink}>
        <picture className={styles.picture}>
          <source
            media="(max-width: 768px)"
            srcSet="/images/hero/Glory-mob-resize.webp"
          />
          <img
            src="/images/hero/Glory-dek-resize.webp"
            alt="T-Shirts Collection"
            className={styles.bannerImage}
            loading="lazy"
            decoding="async"
            width={1672}
            height={941}
          />
        </picture>
      </Link>
    </section>
  );
}
