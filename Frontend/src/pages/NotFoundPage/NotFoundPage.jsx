import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <main className={styles.notFound}>
      <div className={styles.container}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primaryBtn}>
            Back to Home
          </Link>
          <Link to="/collection" className={styles.secondaryBtn}>
            Browse Collection
          </Link>
          <Link to="/search" className={styles.secondaryBtn}>
            Search Store
          </Link>
        </div>
      </div>
    </main>
  );
}
