import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Plus, Minus, X } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "../../hooks/useProducts";
import { useRelatedProducts } from "../../hooks/useRelatedProducts";
import { useCart } from "../../../cart/hooks/useCart";
import { useWishlist } from "../../../wishlist/hooks/useWishlist";
import { Button } from "../../../../components/ui";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import RecentlyViewed from "../RecentlyViewed/RecentlyViewed";
import { recordRecentlyViewed } from "../../utils/recentlyViewed";
import { getOptimizedImageUrl } from "../../../../utils/imageOptimizer";
import styles from "./ProductDetail.module.css";

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function ProductDetail({ slug }) {
  const navigate = useNavigate();
  const { handleGetProductBySlug } = useProducts();
  const { handleAddToCart } = useCart();
  const { isInWishlist, handleToggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const [zoomIndex, setZoomIndex] = useState(null);
  const [activeZoomThumb, setActiveZoomThumb] = useState(0);

  const sliderRef = useRef(null);
  const zoomScrollRef = useRef(null);
  const zoomImageRefs = useRef([]);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const isSwipingRef = useRef(false);

  const categoryId = product?.category?._id || product?.category || null;
  const {
    related,
    loading: relatedLoading,
    loadingMore: relatedLoadingMore,
    hasMore: relatedHasMore,
    loadMore: loadMoreRelated,
  } = useRelatedProducts(categoryId, product?._id);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setLoading(true);
      setSelectedColor(0);
      setSelectedSize(null);
      setActiveSlide(0);
      setZoomIndex(null);
      zoomImageRefs.current = [];
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      const data = await handleGetProductBySlug(slug);
      if (isMounted) {
        setProduct(data);
        setLoading(false);
        if (data?._id) {
          recordRecentlyViewed(data);
        }
      }
    }

    if (slug) {
      loadProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [slug, handleGetProductBySlug]);

  const availableSizes = Array.isArray(product?.sizes)
    ? product.sizes.filter((s) => Boolean(s && typeof s === "string" && s.trim()))
    : [];
  const hasSizes = availableSizes.length > 0;

  const availableColors = Array.isArray(product?.colors) ? product.colors : [];
  const currentColorObj = availableColors[selectedColor] || availableColors[0] || {};
  const currentImages = Array.isArray(currentColorObj.images) && currentColorObj.images.length > 0
    ? currentColorObj.images
    : (Array.isArray(product?.images) && product.images.length > 0 ? product.images : []);

  const firstImage = currentImages[0] || "";

  function openZoom(idx) {
    setZoomIndex(idx);
    setActiveZoomThumb(idx);
  }

  useEffect(() => {
    if (zoomIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const rafId = requestAnimationFrame(() => {
      const targetEl = zoomImageRefs.current[zoomIndex];
      if (targetEl && zoomScrollRef.current) {
        targetEl.scrollIntoView({ behavior: "instant", block: "start" });
      }
    });

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setZoomIndex(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(rafId);
    };
  }, [zoomIndex]);

  function handleZoomScroll(e) {
    const container = e.currentTarget;
    if (!container) return;
    const centerY = container.scrollTop + container.clientHeight / 2;

    for (let i = 0; i < currentImages.length; i++) {
      const el = zoomImageRefs.current[i];
      if (el) {
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (centerY >= top && centerY <= bottom) {
          if (activeZoomThumb !== i) {
            setActiveZoomThumb(i);
          }
          break;
        }
      }
    }
  }

  function handleThumbClick(idx, e) {
    e.stopPropagation();
    setActiveZoomThumb(idx);
    const targetEl = zoomImageRefs.current[idx];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleColorChange(idx) {
    setSelectedColor(idx);
    setActiveSlide(0);
    setZoomIndex(null);
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0;
    }
  }

  function handleSliderScroll(e) {
    const el = e.currentTarget;
    if (!el || !el.clientWidth) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== activeSlide && index >= 0 && index < currentImages.length) {
      setActiveSlide(index);
    }
  }

  function handleTouchStart(e) {
    if (e.touches && e.touches[0]) {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      isSwipingRef.current = false;
    }
  }

  function handleTouchMove(e) {
    if (e.touches && e.touches[0]) {
      const diffX = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
      const diffY = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
      if (diffX > 8 || diffY > 8) {
        isSwipingRef.current = true;
      }
    }
  }

  function handleMobileSlideClick(idx) {
    if (isSwipingRef.current) return;
    openZoom(idx);
  }

  function scrollToSlide(idx) {
    if (sliderRef.current && sliderRef.current.clientWidth) {
      sliderRef.current.scrollTo({
        left: idx * sliderRef.current.clientWidth,
        behavior: "smooth",
      });
      setActiveSlide(idx);
    }
  }

  function toggleAccordion(key) {
    setOpenAccordion((prev) => (prev === key ? null : key));
  }

  async function handleAddToBag(isBuyNow = false) {
    if (hasSizes && !selectedSize) {
      toast.warning("Please select a size first");
      return;
    }

    const itemToAdd = {
      id: product._id,
      title: product.title,
      slug: product.slug,
      price: product.price?.amount || 0,
      image: firstImage,
      color: currentColorObj.name || "Default",
      size: selectedSize || "One Size",
      quantity: 1,
    };

    if (isBuyNow) {
      try {
        setIsBuyingNow(true);
        await handleAddToCart(itemToAdd, false);
        navigate("/cart");
      } catch {
        toast.error("Could not proceed to cart. Please try again.");
      } finally {
        setIsBuyingNow(false);
      }
    } else {
      try {
        setIsAddingToCart(true);
        await handleAddToCart(itemToAdd, true);
        toast.success("Added to bag!");
      } catch {
        toast.error("Could not add to bag. Please try again.");
      } finally {
        setIsAddingToCart(false);
      }
    }
  }

  function handleWishlistClick() {
    if (product?._id) {
      handleToggleWishlist(product._id, product);
    }
  }

  if (loading) {
    return (
      <div className={styles.detail}>
        <div className={styles.skeletonLayout}>
          <div className={styles.skeletonGalleryGrid}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
          <div className={styles.skeletonInfo}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonPrice} />
            <div className={styles.skeletonSubtext} />
            <div className={styles.skeletonColors}>
              <div className={styles.skeletonColor} />
              <div className={styles.skeletonColor} />
              <div className={styles.skeletonColor} />
            </div>
            <div className={styles.skeletonSizes}>
              <div className={styles.skeletonSize} />
              <div className={styles.skeletonSize} />
              <div className={styles.skeletonSize} />
              <div className={styles.skeletonSize} />
            </div>
            <div className={styles.skeletonActions}>
              <div className={styles.skeletonBtn} />
              <div className={styles.skeletonBtn} />
              <div className={styles.skeletonWishlistBtn} />
            </div>
            <div className={styles.skeletonAccordions}>
              <div className={styles.skeletonAccordion} />
              <div className={styles.skeletonAccordion} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.detail}>
        <div className={styles.detail__notFound}>Product not found</div>
      </div>
    );
  }

  const accordionItems = [
    { key: "description", title: "DESCRIPTION & DETAILS", content: product.description },
    { key: "materials", title: "MATERIAL & CARE", content: product.material },
    { key: "delivery", title: "SHIPPING & RETURNS", content: product.deliveryInfo },
  ].filter((item) => Boolean(item.content && item.content.trim()));

  return (
    <div className={styles.detail}>
      <div className={styles.detail__layout}>
        <div className={styles.gallery}>
          <div className={styles.gallery__desktopGrid}>
            {currentImages.map((img, idx) => (
              <div
                key={`${img}-${idx}`}
                className={styles.gallery__gridItem}
                onClick={() => openZoom(idx)}
              >
                <img
                  src={getOptimizedImageUrl(img, { width: 1000, quality: 85 })}
                  alt={`${product.title} ${idx + 1}`}
                  className={styles.gallery__gridImage}
                  loading={idx < 2 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : undefined}
                  decoding="async"
                />
              </div>
            ))}
          </div>

          <div className={styles.gallery__mobileSliderWrapper}>
            <div
              ref={sliderRef}
              className={styles.gallery__mobileSlider}
              onScroll={handleSliderScroll}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              {currentImages.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  className={styles.gallery__mobileSlide}
                  onClick={() => handleMobileSlideClick(idx)}
                >
                  <img
                    src={getOptimizedImageUrl(img, { width: 800, quality: 80 })}
                    alt={`${product.title} ${idx + 1}`}
                    className={styles.gallery__mobileImage}
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "high" : undefined}
                    decoding="async"
                  />
                </div>
              ))}
            </div>

            {currentImages.length > 1 && (
              <div className={styles.gallery__dots}>
                {currentImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.gallery__dot} ${idx === activeSlide ? styles["gallery__dot--active"] : ""}`}
                    onClick={() => scrollToSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.info}>
          <h1 className={styles.info__title}>{product.title}</h1>

          <div className={styles.info__priceRow}>
            <span className={styles.info__price}>{formatINR(product.price?.amount)}</span>
            {product.originalPrice?.amount && (
              <span className={styles.info__originalPrice}>
                {formatINR(product.originalPrice.amount)}
              </span>
            )}
          </div>
          <p className={styles.info__tax}>MRP inclusive of all taxes</p>

          {availableColors.length > 0 && (
            <div className={styles.info__section}>
              <p className={styles.info__label}>
                COLOUR: <span className={styles.info__labelValue}>{currentColorObj.name || "Default"}</span>
              </p>
              <div className={styles.info__colors}>
                {availableColors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.info__colorThumbBtn} ${idx === selectedColor ? styles["info__colorThumbBtn--active"] : ""}`}
                    onClick={() => handleColorChange(idx)}
                    aria-label={`Select ${color.name}`}
                  >
                    {color.images && color.images.length > 0 ? (
                      <div className={styles.info__colorThumbWrapper}>
                        <img
                          src={color.images[0]}
                          alt={color.name}
                          className={styles.info__colorThumbImg}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <span
                        className={styles.info__colorFallback}
                        style={{ backgroundColor: color.hex || "#e5e5e5" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasSizes && (
            <div className={styles.info__section}>
              <p className={styles.info__label}>
                SIZE {selectedSize && <span className={styles.info__labelValue}>({selectedSize})</span>}
              </p>
              <div className={styles.info__sizes}>
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`${styles.info__sizeBtn} ${selectedSize === size ? styles["info__sizeBtn--active"] : ""}`}
                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.info__actions}>
            <Button
              variant="primary"
              size="lg"
              className={styles.info__actionBtn}
              onClick={() => handleAddToBag(false)}
              loading={isAddingToCart}
              disabled={isAddingToCart || isBuyingNow}
            >
              ADD TO BAG
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={styles.info__actionBtn}
              onClick={() => handleAddToBag(true)}
              loading={isBuyingNow}
              disabled={isAddingToCart || isBuyingNow}
            >
              BUY IT NOW
            </Button>
            <button
              type="button"
              className={`${styles.info__wishlistBtn} ${isInWishlist(product?._id) ? styles["info__wishlistBtn--active"] : ""}`}
              aria-label={isInWishlist(product?._id) ? "Remove from wishlist" : "Add to wishlist"}
              onClick={handleWishlistClick}
            >
              <Heart
                size={20}
                strokeWidth={1.5}
                fill={isInWishlist(product?._id) ? "#dc2626" : "none"}
                color={isInWishlist(product?._id) ? "#dc2626" : "currentColor"}
              />
            </button>
          </div>

          <div className={styles.accordions}>
            {accordionItems.map((item) => (
              <div key={item.key} className={styles.accordion}>
                <button
                  type="button"
                  className={styles.accordion__trigger}
                  onClick={() => toggleAccordion(item.key)}
                  aria-expanded={openAccordion === item.key}
                >
                  <span>{item.title}</span>
                  {openAccordion === item.key ? (
                    <Minus size={18} strokeWidth={2} />
                  ) : (
                    <Plus size={18} strokeWidth={2} />
                  )}
                </button>
                <div
                  className={`${styles.accordion__collapse} ${
                    openAccordion === item.key ? styles["accordion__collapse--open"] : ""
                  }`}
                  aria-hidden={openAccordion !== item.key}
                >
                  <div className={styles.accordion__inner}>
                    <div className={styles.accordion__content}>
                      <p>{item.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {zoomIndex !== null && currentImages.length > 0 && (
        <div
          ref={zoomScrollRef}
          className={styles.zoomModal}
          onScroll={handleZoomScroll}
          onClick={() => setZoomIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Product zoom view"
        >
          <button
            type="button"
            className={styles.zoomModal__closeBtn}
            onClick={(e) => {
              e.stopPropagation();
              setZoomIndex(null);
            }}
            aria-label="Close zoom view"
          >
            <X size={26} strokeWidth={1.5} />
          </button>

          <div className={styles.zoomModal__scrollTrack}>
            {currentImages.map((img, idx) => (
              <div
                key={`${img}-${idx}`}
                ref={(el) => (zoomImageRefs.current[idx] = el)}
                className={styles.zoomModal__imageWrapper}
              >
                <img
                  src={getOptimizedImageUrl(img, { width: 1800, quality: 90 })}
                  alt={`${product.title} zoom ${idx + 1}`}
                  className={styles.zoomModal__image}
                  loading={idx < 2 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          {currentImages.length > 1 && (
            <div
              className={styles.zoomModal__thumbnails}
              onClick={(e) => e.stopPropagation()}
            >
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.zoomModal__thumb} ${idx === activeZoomThumb ? styles["zoomModal__thumb--active"] : ""}`}
                  onClick={(e) => handleThumbClick(idx, e)}
                  aria-label={`View angle ${idx + 1}`}
                >
                  <img
                    src={getOptimizedImageUrl(img, { width: 140, quality: 75 })}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    className={styles.zoomModal__thumbImg}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {product?._id && <RecentlyViewed currentProductId={product._id} />}

      <RelatedProducts
        products={related}
        loading={relatedLoading}
        loadingMore={relatedLoadingMore}
        hasMore={relatedHasMore}
        onLoadMore={loadMoreRelated}
      />
    </div>
  );
}
