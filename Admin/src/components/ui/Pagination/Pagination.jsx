import styles from "./Pagination.module.css";

export default function Pagination({
  page = 1,
  totalPages = 1,
  total = 0,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [8, 10, 20, 50],
}) {
  if (total === 0) return null;

  const safeTotalPages = Math.max(totalPages, 1);
  const startItem = total > 0 ? (page - 1) * (pageSize || 10) + 1 : 0;
  const endItem = pageSize ? Math.min(page * pageSize, total) : total;

  const getPageNumbers = () => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", safeTotalPages];
    }

    if (page >= safeTotalPages - 3) {
      return [
        1,
        "...",
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      ];
    }

    return [1, "...", page - 1, page, page + 1, "...", safeTotalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className={styles.pagination}>
      <div className={styles.leftGroup}>
        <span className={styles.summary}>
          {pageSize
            ? `Showing ${startItem}–${endItem} of ${total} products`
            : `Page ${page} of ${safeTotalPages} (${total} total)`}
        </span>

        {onPageSizeChange && (
          <div className={styles.pageSizeWrapper}>
            <label htmlFor="page-size-select">Per page:</label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={styles.pageSizeSelect}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`${styles.btn} ${p === page ? styles.btnActive : ""}`}
              onClick={() => onPageChange(p)}
              disabled={p === page}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className={styles.btn}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= safeTotalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
