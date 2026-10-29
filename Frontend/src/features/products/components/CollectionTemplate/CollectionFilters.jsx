import { memo } from "react";
import { ChevronDown } from "lucide-react";
import {
  FILTER_COLORS,
  PRICE_MIN_LIMIT,
  PRICE_MAX_LIMIT,
  PRICE_STEP,
} from "../../../../constants/collectionFilters";
import styles from "./CollectionTemplate.module.css";

const SKELETON_ITEMS = Array.from({ length: 5 });

function CollectionFilters({
  categories,
  categoriesLoading,
  isRouteCategory,
  routeCategory,
  filters,
  openSections,
  toggleSection,
  handleCategoryChange,
  handleColorToggle,
  handleInStockToggle,
  sliderMin,
  sliderMax,
  handleSliderMinChange,
  handleSliderMaxChange,
  colorCounts,
}) {
  const progressLeft = (sliderMin / PRICE_MAX_LIMIT) * 100;
  const progressRight = 100 - (sliderMax / PRICE_MAX_LIMIT) * 100;

  return (
    <div className={styles.filterContent}>
      <div className={styles.filterGroup}>
        <button
          type="button"
          className={styles.filterGroupHeader}
          onClick={() => toggleSection("category")}
          aria-expanded={openSections.category}
        >
          <span>Category</span>
          <ChevronDown
            size={16}
            className={`${styles.chevron} ${openSections.category ? styles.chevronOpen : ""}`}
          />
        </button>
        <div
          className={`${styles.filterGroupBody} ${
            openSections.category ? styles.filterGroupBodyOpen : ""
          }`}
        >
          <label className={styles.checkboxLabel}>
            <input
              type="radio"
              name="filterCategory"
              checked={!isRouteCategory && !filters.category}
              onChange={() => handleCategoryChange("")}
              className={styles.hiddenInput}
            />
            <span
              className={`${styles.radioMark} ${
                !isRouteCategory && !filters.category ? styles.radioMarkActive : ""
              }`}
            />
            <span className={styles.filterLabel}>All Products</span>
          </label>

          {categoriesLoading && categories.length === 0 ? (
            <div
              className={styles.categorySkeletonList}
              aria-busy="true"
              aria-label="Loading categories"
            >
              {SKELETON_ITEMS.map((_, i) => (
                <div key={i} className={styles.categorySkeletonRow}>
                  <div className={styles.categorySkeletonRadio} />
                  <div className={styles.categorySkeletonBar} />
                </div>
              ))}
            </div>
          ) : (
            categories.map((cat) => {
              const isSelected = isRouteCategory
                ? routeCategory?.toLowerCase() === cat.slug?.toLowerCase()
                : filters.category?.toLowerCase() === cat.slug?.toLowerCase();
              return (
                <label key={cat._id || cat.slug} className={styles.checkboxLabel}>
                  <input
                    type="radio"
                    name="filterCategory"
                    checked={isSelected}
                    onChange={() => handleCategoryChange(cat.slug)}
                    className={styles.hiddenInput}
                  />
                  <span
                    className={`${styles.radioMark} ${
                      isSelected ? styles.radioMarkActive : ""
                    }`}
                  />
                  <span className={styles.filterLabel}>{cat.name}</span>
                </label>
              );
            })
          )}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <button
          type="button"
          className={styles.filterGroupHeader}
          onClick={() => toggleSection("price")}
          aria-expanded={openSections.price}
        >
          <span>Price</span>
          <ChevronDown
            size={16}
            className={`${styles.chevron} ${openSections.price ? styles.chevronOpen : ""}`}
          />
        </button>
        <div
          className={`${styles.filterGroupBody} ${
            openSections.price ? styles.filterGroupBodyOpen : ""
          }`}
        >
          <div className={styles.rangeSliderWrapper}>
            <div className={styles.rangeSliderTrack}>
              <div
                className={styles.rangeSliderProgress}
                style={{ left: `${progressLeft}%`, right: `${progressRight}%` }}
              />
            </div>
            <input
              type="range"
              min={PRICE_MIN_LIMIT}
              max={PRICE_MAX_LIMIT}
              step={PRICE_STEP}
              value={sliderMin}
              onChange={handleSliderMinChange}
              className={`${styles.rangeInput} ${styles.rangeInputMin} ${
                sliderMin > PRICE_MAX_LIMIT - 1000 ? styles["rangeInputMin--top"] : ""
              }`.trim()}
              aria-label="Minimum price"
            />
            <input
              type="range"
              min={PRICE_MIN_LIMIT}
              max={PRICE_MAX_LIMIT}
              step={PRICE_STEP}
              value={sliderMax}
              onChange={handleSliderMaxChange}
              className={`${styles.rangeInput} ${styles.rangeInputMax}`}
              aria-label="Maximum price"
            />
            <div className={styles.rangeLabels}>
              <span className={styles.rangeLabelMin}>
                ₹{sliderMin.toLocaleString("en-IN")}
              </span>
              <span className={styles.rangeLabelMax}>
                ₹{sliderMax.toLocaleString("en-IN")}
                {sliderMax >= PRICE_MAX_LIMIT ? "+" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <button
          type="button"
          className={styles.filterGroupHeader}
          onClick={() => toggleSection("color")}
          aria-expanded={openSections.color}
        >
          <span>Color</span>
          <ChevronDown
            size={16}
            className={`${styles.chevron} ${openSections.color ? styles.chevronOpen : ""}`}
          />
        </button>
        <div
          className={`${styles.filterGroupBody} ${
            openSections.color ? styles.filterGroupBodyOpen : ""
          }`}
        >
          <div className={styles.colorListWrapper}>
            {FILTER_COLORS.map((color) => {
              const isSelected = filters.colors.includes(color.name);
              const count = colorCounts[color.name] || 0;
              const isMulti = color.name.toLowerCase() === "multi";
              const isWhite = color.hex.toLowerCase() === "#ffffff";
              return (
                <label key={color.name} className={styles.colorRow}>
                  <div className={styles.colorRowLeft}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleColorToggle(color.name)}
                      className={styles.hiddenInput}
                    />
                    <span
                      className={`${styles.colorCheckbox} ${
                        isSelected ? styles.colorCheckboxActive : ""
                      }`}
                    >
                      {isSelected && (
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className={styles.colorName}>{color.name}</span>
                  </div>
                  <div className={styles.colorRowRight}>
                    <span className={styles.colorCount}>[{count}]</span>
                    <span
                      className={`${styles.colorCircleDot} ${
                        isMulti ? styles["colorCircleDot--multi"] : ""
                      } ${isWhite ? styles["colorCircleDot--white"] : ""}`.trim()}
                      style={!isMulti ? { backgroundColor: color.hex } : undefined}
                    />
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <button
          type="button"
          className={styles.filterGroupHeader}
          onClick={() => toggleSection("availability")}
          aria-expanded={openSections.availability}
        >
          <span>Availability</span>
          <ChevronDown
            size={16}
            className={`${styles.chevron} ${
              openSections.availability ? styles.chevronOpen : ""
            }`}
          />
        </button>
        <div
          className={`${styles.filterGroupBody} ${
            openSections.availability ? styles.filterGroupBodyOpen : ""
          }`}
        >
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={handleInStockToggle}
              className={styles.hiddenInput}
            />
            <span
              className={`${styles.checkMark} ${
                filters.inStock ? styles.checkMarkActive : ""
              }`}
            >
              {filters.inStock && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span className={styles.filterLabel}>In Stock Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default memo(CollectionFilters);
