import styles from "./AdminTable.module.css";

export default function AdminTable({
  columns = [],
  isLoading = false,
  loadingText = "Loading data...",
  emptyMessage = "No records found.",
  isEmpty = false,
  children,
  className = "",
}) {
  const colSpan = columns.length || 1;

  return (
    <div className={`${styles.tableWrapper} ${className}`.trim()}>
      <table className={styles.table}>
        {columns.length > 0 && (
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={colSpan} className={styles.emptyState}>
                {loadingText}
              </td>
            </tr>
          ) : isEmpty ? (
            <tr>
              <td colSpan={colSpan} className={styles.emptyState}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
