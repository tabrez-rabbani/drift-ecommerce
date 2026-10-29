import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { getOptimizedImageUrl } from "../../../../utils/imageOptimizer";
import styles from "./WishlistCard.module.css";

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const getPriceAmount = (val) => {
  if (!val) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "object" && typeof val.amount === "number") return val.amount;
  const parsed = Number(val);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export default function WishlistCard({ product, onRemove, onMoveToBag }) {
  const [isMoving, setIsMoving] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const productId = product._id || product.id;
  const productHref = product.slug ? `/product/${product.slug}` : `/product/${productId}`;

  const imageSrc =
    product.image ||
    product.colors?.[0]?.images?.[0] ||
    product.images?.[0] ||
    "";

  const price = getPriceAmount(product.price);
  const originalPrice = getPriceAmount(product.originalPrice);
  const availableSizes = Array.isArray(product.sizes)
    ? product.sizes.filter((s) => Boolean(s && typeof s === "string" && s.trim()))
    : [];
  const hasSizes = availableSizes.length > 0;

  async function handleMoveToBag() {
    setIsMoving(true);
    try {
      await onMoveToBag(product);
    } finally {
      if (isMountedRef.current) {
        setIsMoving(false);
      }
    }
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageBox}>
        <Link to={productHref} className={styles.imageLink}>
          {imageSrc ? (
            <img
              src={getOptimizedImageUrl(imageSrc, { width: 500 })}
              alt={product.title}
              className={styles.productImg}
              loading="lazy"
            />
          ) : (
            <div className={styles.noImage}>No Image</div>
          )}
        </Link>

        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => onRemove(productId)}
          aria-label="Remove from wishlist"
          title="Remove"
        >
          <X size={15} strokeWidth={2} />
        </button>

        {product.inStock === false && (
          <span className={styles.badgeStock}>Out of stock</span>
        )}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <Link
            to={productHref}
            className={styles.productTitle}
            title={product.title}
          >
            {product.title}
          </Link>

          <div className={styles.priceRow}>
            <span className={styles.price}>{formatINR(price)}</span>
            {originalPrice > price && (
              <span className={styles.originalPrice}>
                {formatINR(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {hasSizes && (
          <div className={styles.sizeRow}>
            <span className={styles.sizeLabel}>Size:</span>
            <div className={styles.sizePills}>
              {availableSizes.map((s, idx) => (
                <span key={`${s}-${idx}`} className={styles.sizePill}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          className={styles.addToBagBtn}
          disabled={product.inStock === false || isMoving}
          onClick={handleMoveToBag}
        >
          {product.inStock === false
            ? "Out of Stock"
            : isMoving
            ? "Moving..."
            : "Move to Bag"}
        </button>
      </div>
    </article>
  );
}
