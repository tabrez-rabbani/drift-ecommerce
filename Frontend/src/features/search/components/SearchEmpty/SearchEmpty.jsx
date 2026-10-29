import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import styles from "./SearchEmpty.module.css";

export default function SearchEmpty({ query = "" }) {
  return (
    <div className={styles.emptyState} role="status">
      <div className={styles.emptyIconCircle}>
        <SearchX size={34} strokeWidth={1.5} />
      </div>
      <h2 className={styles.emptyTitle}>No Products Found</h2>
      <p className={styles.emptySubtext}>
        We couldn't find anything matching "<strong>{query}</strong>". Check your spelling or try different keywords like <em>oversized</em>, <em>jacket</em>, or <em>cargo</em>.
      </p>
      <Link to="/collection" className={styles.browseBtn}>
        Browse All Products
      </Link>
    </div>
  );
}
