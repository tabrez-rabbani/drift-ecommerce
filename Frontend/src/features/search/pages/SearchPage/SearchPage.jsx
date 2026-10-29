import { useSearch } from "../../hooks/useSearch";
import SearchBar from "../../components/SearchBar/SearchBar";
import SearchResults from "../../components/SearchResults/SearchResults";
import SearchEmpty from "../../components/SearchEmpty/SearchEmpty";
import SearchIdle from "../../components/SearchIdle/SearchIdle";
import styles from "./SearchPage.module.css";

export default function SearchPage() {
  const {
    query,
    inputVal,
    handleInputChange,
    handleSubmit,
    handleClear,
    handleSuggestionClick,
    products,
    totalResults,
    loading,
    hasQuery,
  } = useSearch();

  return (
    <main className={styles.page} id="search-main">
      <div className={styles.container}>
        <SearchBar
          value={inputVal}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />

        {loading ? (
          <SearchResults loading />
        ) : hasQuery && products.length > 0 ? (
          <SearchResults
            query={query}
            products={products}
            totalResults={totalResults}
          />
        ) : hasQuery && products.length === 0 ? (
          <SearchEmpty query={query} />
        ) : null}
      </div>

      {!hasQuery && !loading && (
        <SearchIdle onSelectSuggestion={handleSuggestionClick} />
      )}
    </main>
  );
}
