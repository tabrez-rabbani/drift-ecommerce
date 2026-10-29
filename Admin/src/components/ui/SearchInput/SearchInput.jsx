import styles from "./SearchInput.module.css";

export default function SearchInput({
  label = "Search:",
  value = "",
  onChange,
  placeholder = "Search...",
  id = "admin-search",
  className = "",
}) {
  return (
    <div className={`${styles.searchGroup} ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className={styles.searchLabel}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        className={styles.searchInput}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

