import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import styles from "./WishlistEmpty.module.css";

export default function WishlistEmpty({ isLoggedOut }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIconWrapper}>
        <Heart className={styles.emptyHeartIcon} strokeWidth={1.2} />
      </div>

      {isLoggedOut ? (
        <>
          <h2 className={styles.emptyTitle}>Sign in to view your wishlist</h2>
          <p className={styles.emptyDesc}>
            Log in to keep track of your favourite items and access them across
            all your devices.
          </p>
          <Link to="/login" className={styles.primaryBtn}>
            <span>Sign In to Account</span>
            <ArrowRight size={15} />
          </Link>
        </>
      ) : (
        <>
          <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
          <p className={styles.emptyDesc}>
            Explore our curated collection and add the pieces you love by
            tapping the heart icon.
          </p>
          <Link to="/collection" className={styles.primaryBtn}>
            <span>Explore Collection</span>
            <ArrowRight size={15} />
          </Link>
        </>
      )}
    </div>
  );
}
