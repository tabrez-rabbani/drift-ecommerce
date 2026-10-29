const STORAGE_KEY = "drift_recently_viewed";
const MAX_ITEMS = 15;
const EXPIRY_DAYS = 7;
const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

/**
 * Extracts a lightweight representation of a product for storage
 */
function toMinimalProduct(product) {
  if (!product) return null;

  return {
    _id: product._id,
    title: product.title || "",
    slug: product.slug || "",
    price: product.price || null,
    originalPrice: product.originalPrice || null,
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
  };
}

/**
 * Reads recently viewed products from localStorage with 7-day auto-expiry
 */
export function getRecentlyViewed(excludeId = null) {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return [];

    // Check 7-day expiry
    if (parsed.timestamp && Date.now() - parsed.timestamp > EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    if (!excludeId) {
      return parsed.items;
    }

    return parsed.items.filter((item) => item && item._id !== excludeId);
  } catch {
    return [];
  }
}

/**
 * Adds or updates a product in recently viewed list (max 15 items, FIFO queue)
 */
export function recordRecentlyViewed(product) {
  if (typeof window === "undefined" || !product || !product._id) return;

  try {
    const minimal = toMinimalProduct(product);
    if (!minimal) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    let existingItems = [];

    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        // If not expired, keep existing
        if (!parsed.timestamp || Date.now() - parsed.timestamp <= EXPIRY_MS) {
          existingItems = parsed.items;
        }
      }
    }

    // Deduplicate: remove if already exists
    const filtered = existingItems.filter((item) => item && item._id !== minimal._id);

    // Prepend to top and clamp strictly to MAX_ITEMS (15)
    const updated = [minimal, ...filtered].slice(0, MAX_ITEMS);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        items: updated,
      })
    );
  } catch {
    // Graceful fallback if localStorage is full or disabled (incognito mode quota)
  }
}
