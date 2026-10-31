import { Link } from "react-router-dom";
import { useCart } from "../../../features/cart/hooks/useCart";
import styles from "./Footer.module.css";

const FEATURES = [
  {
    id: 1,
    icon: "/images/svg/4-track.svg",
    title: "Free Shipping",
    subtitle: "On Orders over ₹999",
  },
  {
    id: 2,
    icon: "/images/svg/9-money.svg",
    title: "Money Back",
    subtitle: "Money back in 15 days",
  },
  {
    id: 3,
    icon: "/images/svg/10-credit-card.svg",
    title: "Secure Checkout",
    subtitle: "100% Payment Secure.",
  },
  {
    id: 4,
    icon: "/images/svg/7-support.svg",
    title: "Online Support",
    subtitle: "Ensure product quality",
  },
];

const SOCIAL_LINKS = [
  { id: "facebook", name: "Facebook", href: "https://facebook.com", icon: "/images/svg/facebook.svg" },
  { id: "twitter", name: "Twitter", href: "https://twitter.com", icon: "/images/svg/twitter.svg" },
  { id: "youtube", name: "YouTube", href: "https://youtube.com", icon: "/images/svg/youtube.svg" },
  { id: "instagram", name: "Instagram", href: "https://instagram.com", icon: "/images/svg/instagram.svg" },
];

export default function Footer() {
  const { handleOpenCart } = useCart();

  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.container}>
        <div className={styles.featuresCard}>
          {FEATURES.map((item) => (
            <div key={item.id} className={styles.featureItem}>
              <div className={styles.featureIconWrap}>
                <img src={item.icon} alt={item.title} className={styles.featureIcon} />
              </div>
              <div className={styles.featureText}>
                <h4 className={styles.featureTitle}>{item.title}</h4>
                <p className={styles.featureSubtitle}>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.mainContent}>
          <div className={styles.column}>
            <h3 className={`${styles.colTitle} ${styles.aboutTitle}`}>About Us</h3>
            <p className={`${styles.aboutText} ${styles.aboutDesc}`}>
              Drift is a dynamic and innovative online menswear platform that offers a wide range of
              contemporary apparel and everyday styles to customers.
            </p>
            <div className={styles.socialLinks} aria-label="Social media links">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className={styles.socialLink}
                >
                  <img src={item.icon} alt={item.name} className={styles.socialIcon} />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/collection" className={styles.footerLink}>All Collections</Link>
              </li>
              <li>
                <Link to="/collection/price-drop" className={styles.footerLink}>New Arrivals</Link>
              </li>
              <li>
                <Link to="/account" className={styles.footerLink}>My Account</Link>
              </li>
              <li>
                <button type="button" onClick={handleOpenCart} className={styles.footerActionBtn}>
                  My Cart
                </button>
              </li>
              <li>
                <Link to="/wishlist" className={styles.footerLink}>My Wishlist</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.colTitle}>Information</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/info/about-us" className={styles.footerLink}>About Us</Link>
              </li>
              <li>
                <Link to="/info/contact" className={styles.footerLink}>Contact & Support</Link>
              </li>
              <li>
                <Link to="/info/faq" className={styles.footerLink}>FAQ</Link>
              </li>
              <li>
                <Link to="/info/size-chart" className={styles.footerLink}>Size Chart</Link>
              </li>
              <li>
                <Link to="/info/shipping-policy" className={styles.footerLink}>Shipping & Delivery</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} <strong>Drift</strong>. All rights reserved.
          </p>
          <div className={styles.policyLinks}>
            <Link to="/info/privacy-policy" className={styles.policyLink}>Privacy Policy</Link>
            <Link to="/info/refund-policy" className={styles.policyLink}>Refund Policy</Link>
            <Link to="/info/shipping-policy" className={styles.policyLink}>Shipping Policy</Link>
            <Link to="/info/terms-of-service" className={styles.policyLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
