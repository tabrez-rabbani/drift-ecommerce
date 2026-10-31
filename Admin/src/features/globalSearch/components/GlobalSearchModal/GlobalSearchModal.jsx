import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, X } from "lucide-react";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import styles from "./GlobalSearchModal.module.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='60' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='1.5'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E";

function formatCurrency(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function GlobalSearchModal({ onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  const { query, results, loading, hasResults, handleQueryChange, resetSearch } =
    useGlobalSearch();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        resetSearch();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [resetSearch, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      resetSearch();
      onClose();
    }
  };

  const handleClose = () => {
    resetSearch();
    onClose();
  };

  const go = (path) => {
    navigate(path);
    resetSearch();
    onClose();
  };

  const showEmpty = query.trim().length >= 2 && !loading && !hasResults;

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
    >
      <div className={styles.modal}>
        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search products, orders, users..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            autoComplete="off"
          />
          {loading ? (
            <Loader size={20} className={styles.spinner} />
          ) : (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleClose}
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {(hasResults || showEmpty) && (
          <div className={styles.results}>
            {showEmpty && (
              <p className={styles.emptyNote}>No results for "{query}"</p>
            )}

            {results.products.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>Products</div>
                {results.products.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    className={styles.resultRow}
                    onClick={() => go("/admin/products")}
                  >
                    <img
                      src={p.colors?.[0]?.images?.[0] || FALLBACK_IMAGE}
                      alt={p.title}
                      className={styles.productThumb}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className={styles.rowInfo}>
                      <span className={styles.rowTitle}>{p.title}</span>
                      <span className={styles.rowMeta}>
                        {p.price?.amount ? formatCurrency(p.price.amount) : "—"} &bull;{" "}
                        <span className={p.inStock ? styles.inStock : styles.outOfStock}>
                          {p.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </span>
                    </div>
                  </button>
                ))}
              </section>
            )}

            {results.orders.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>Orders</div>
                {results.orders.map((o) => (
                  <button
                    key={o._id}
                    type="button"
                    className={styles.resultRow}
                    onClick={() => go("/admin/orders/users-orders")}
                  >
                    <div className={styles.rowInfo}>
                      <span className={styles.rowTitle}>
                        {o.shippingAddress?.fullName || o.user?.name || "Unknown"} &mdash; {formatCurrency(o.totalAmount)}
                      </span>
                      <span className={styles.rowMeta}>
                        {o.orderStatus} &bull; {formatDate(o.createdAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </section>
            )}

            {results.users.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>Users</div>
                {results.users.map((u) => (
                  <button
                    key={u._id}
                    type="button"
                    className={styles.resultRow}
                    onClick={() => go("/admin/users")}
                  >
                    <div className={styles.rowInfo}>
                      <span className={styles.rowTitle}>{u.name}</span>
                      <span className={styles.rowMeta}>{u.email}</span>
                    </div>
                  </button>
                ))}
              </section>
            )}
          </div>
        )}

        {!query && (
          <p className={styles.hint}>
            Type to search across products, orders and users
          </p>
        )}
      </div>
    </div>
  );
}
