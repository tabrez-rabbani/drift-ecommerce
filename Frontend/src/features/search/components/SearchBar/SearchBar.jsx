import { useRef, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import styles from "./SearchBar.module.css";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Only auto-focus on non-touch devices to avoid jarring mobile virtual keyboard popup
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) {
      inputRef.current?.focus();
    }
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
    // Blur on mobile to close keyboard and reveal results
    if (window.matchMedia("(max-width: 768px)").matches) {
      inputRef.current?.blur();
    }
  };

  return (
    <section className={styles.searchHero} aria-label="Search products">
      <span className={styles.searchEyebrow}>Explore The Collection</span>
      <h1 className={styles.searchHeading}>Search Drift</h1>

      <form
        className={styles.inputWrapper}
        onSubmit={handleFormSubmit}
        role="search"
        action="/search"
      >
        <SearchIcon size={19} className={styles.searchIcon} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          name="q"
          className={styles.searchInput}
          placeholder="Search for oversized shirts, baggy jeans, cargos..."
          value={value}
          onChange={onChange}
          aria-label="Search products"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
          enterKeyHint="search"
        />
        {value && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            aria-label="Clear search input"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        )}
      </form>
    </section>
  );
}
