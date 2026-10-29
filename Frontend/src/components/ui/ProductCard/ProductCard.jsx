import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Plus, X, Heart } from "lucide-react";
import { useCart } from "../../../features/cart/hooks/useCart";
import { useWishlist } from "../../../features/wishlist/hooks/useWishlist";
import { getOptimizedImageUrl } from "../../../utils/imageOptimizer";
import styles from "./ProductCard.module.css";

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ProductCard({
  id,
  title,
  price,
  originalPrice,
  mainImage,
  hoverImage,
  colors = [],
  colorsList,
  sizes = [],
  slug,
}) {
  const cardRef = useRef(null);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [selectedColorIdx, setSelectedColorIdx] = useState(null);
  const { handleAddToCart } = useCart();
  const { isInWishlist, handleToggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(id);

  const availableSizes = Array.isArray(sizes)
    ? sizes.filter((s) => Boolean(s && typeof s === "string" && s.trim()))
    : [];
  const hasSizes = availableSizes.length > 0;

  const activeColor =
    selectedColorIdx !== null && colorsList && colorsList[selectedColorIdx]
      ? colorsList[selectedColorIdx]
      : colorsList?.[0] ?? null;
  const displayMainImage = activeColor?.images?.[0] || mainImage;
  const displayHoverImage =
    activeColor?.images?.[1] || activeColor?.images?.[0] || hoverImage;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) {
      handleToggleWishlist(id, {
        _id: id,
        id,
        title,
        slug,
        price,
        originalPrice,
        image: displayMainImage || mainImage,
        colors: colorsList || colors,
        sizes,
      });
    }
  };

  const optimizedMainImage = getOptimizedImageUrl(displayMainImage, { width: 500 });
  const optimizedHoverImage = getOptimizedImageUrl(displayHoverImage, { width: 500 });

  useEffect(() => {
    if (!isSizeOpen) return;
    const handleOutsideClick = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setIsSizeOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsSizeOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSizeOpen]);

  const handlePlusClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasSizes) setIsSizeOpen((prev) => !prev);
  };

  const handleColorClick = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColorIdx(idx);
  };

  const handleSizeSelect = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSizeOpen(false);
    const colorName = activeColor?.name || "";
    const image = activeColor?.images?.[0] || mainImage || "";
    handleAddToCart({ id, title, slug, price, image, color: colorName, size, quantity: 1 });
  };

  const productHref = slug ? `/product/${slug}` : `/product/${id}`;

  return (
    <div className={styles.card} ref={cardRef}>
      <div className={styles.card__imageContainer}>
        <Link to={productHref} className={styles.card__imageLink} tabIndex={-1}>
          <div className={styles.card__imageWrapper}>
            {displayMainImage ? (
              <img
                src={optimizedMainImage}
                alt={title}
                className={`${styles.card__image} ${styles["card__image--main"]}`}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className={styles.card__noImage}>No Image</div>
            )}
            {displayHoverImage && displayHoverImage !== displayMainImage ? (
              <img
                src={optimizedHoverImage}
                alt={`${title} alternate view`}
                className={`${styles.card__image} ${styles["card__image--hover"]}`}
                loading="lazy"
                decoding="async"
              />
            ) : null}
          </div>
        </Link>

        <button
          type="button"
          className={`${styles.card__wishlistBtn} ${inWishlist ? styles["card__wishlistBtn--active"] : ""}`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          onClick={handleWishlistClick}
        >
          <Heart size={17} strokeWidth={1.5} />
        </button>

        {isSizeOpen && hasSizes && (
          <div
            className={styles.card__sizeOverlay}
            role="dialog"
            aria-label="Size selection"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <div className={styles.card__sizeHeader}>
              <span className={styles.card__sizeTitle}>Select Size</span>
              <button
                type="button"
                className={styles.card__sizeCloseBtn}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSizeOpen(false); }}
                aria-label="Close size selector"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
            <div className={styles.card__sizeList}>
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={styles.card__sizeBtn}
                  aria-label={`Select size ${sz}`}
                  onClick={(e) => handleSizeSelect(e, sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.card__content}>
        <Link to={productHref} className={styles.card__titleLink}>
          <h3 className={styles.card__title}>{title}</h3>
        </Link>

        <div className={styles.card__footer}>
          <div className={styles.card__priceGroup}>
            <span className={styles.card__price}>{formatINR(price)}</span>
            {originalPrice ? (
              <span className={styles.card__originalPrice}>
                {formatINR(originalPrice)}
              </span>
            ) : null}
          </div>
          {hasSizes && (
            <button
              type="button"
              className={`${styles.card__addToCart} ${isSizeOpen ? styles["card__addToCart--open"] : ""}`}
              aria-label={isSizeOpen ? "Close size selection" : `Select size to add ${title} to cart`}
              onClick={handlePlusClick}
            >
              <Plus
                size={18}
                strokeWidth={2}
                className={`${styles.card__plusIcon} ${isSizeOpen ? styles["card__plusIcon--active"] : ""}`}
              />
            </button>
          )}
        </div>

        {colors.length > 0 && (
          <div className={styles.card__colors}>
            {colors.map((color, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.card__colorSwatch} ${selectedColorIdx === idx ? styles["card__colorSwatch--active"] : ""}`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${colorsList?.[idx]?.name || color}`}
                aria-pressed={selectedColorIdx === idx}
                onClick={(e) => handleColorClick(e, idx)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}