const GUEST_WISHLIST_KEY = "drift_guest_wishlist";
export const MAX_GUEST_WISHLIST_ITEMS = 50;


function isStorageAvailable() {
  try {
    const testKey = "__test_storage__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}


function sanitizeProduct(product) {
  if (!product) return null;
  const id = String(product._id || product.id || "");
  if (!id) return null;


  const image =
    product.image ||
    product.colors?.[0]?.images?.[0] ||
    product.images?.[0] ||
    "";

  const price =
    typeof product.price === "object"
      ? product.price?.amount || 0
      : Number(product.price) || 0;

  const originalPrice =
    typeof product.originalPrice === "object"
      ? product.originalPrice?.amount || null
      : product.originalPrice
        ? Number(product.originalPrice)
        : null;

  return {
    _id: id,
    id,
    title: product.title || "Product",
    slug: product.slug || "",
    price,
    originalPrice,
    image,
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    inStock: product.inStock !== false,
    category: product.category || null,
    addedAt: Date.now(),
  };
}


export function getGuestWishlist() {
  if (!isStorageAvailable()) return [];
  try {
    const raw = window.localStorage.getItem(GUEST_WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => Boolean(item && (item._id || item.id)));
  } catch {
    return [];
  }
}


export function getGuestWishlistIds() {
  const items = getGuestWishlist();
  return items.map((item) => String(item._id || item.id));
}


export function isProductInGuestWishlist(productId) {
  if (!productId) return false;
  const targetId = String(productId);
  return getGuestWishlistIds().includes(targetId);
}


export function addToGuestWishlist(product) {
  if (!isStorageAvailable()) return [];
  const clean = sanitizeProduct(product);
  if (!clean) return getGuestWishlist();

  try {
    const current = getGuestWishlist();
    const existingIndex = current.findIndex(
      (item) => String(item._id || item.id) === clean._id
    );

    let updated;
    if (existingIndex !== -1) {

      updated = [clean, ...current.filter((_, i) => i !== existingIndex)];
    } else {

      updated = [clean, ...current].slice(0, MAX_GUEST_WISHLIST_ITEMS);
    }

    window.localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getGuestWishlist();
  }
}


export function removeFromGuestWishlist(productId) {
  if (!isStorageAvailable() || !productId) return getGuestWishlist();
  const targetId = String(productId);

  try {
    const current = getGuestWishlist();
    const updated = current.filter(
      (item) => String(item._id || item.id) !== targetId
    );
    window.localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getGuestWishlist();
  }
}


export function toggleGuestWishlist(productOrId, productData = null) {
  const isObject = typeof productOrId === "object" && productOrId !== null;
  const targetId = String(isObject ? productOrId._id || productOrId.id : productOrId);
  const fullProduct = isObject ? productOrId : productData || { _id: targetId, id: targetId };

  if (isProductInGuestWishlist(targetId)) {
    const updatedItems = removeFromGuestWishlist(targetId);
    return {
      action: "removed",
      items: updatedItems,
      productIds: updatedItems.map((item) => String(item._id || item.id)),
    };
  } else {
    const updatedItems = addToGuestWishlist(fullProduct);
    return {
      action: "added",
      items: updatedItems,
      productIds: updatedItems.map((item) => String(item._id || item.id)),
    };
  }
}


export function clearGuestWishlist() {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(GUEST_WISHLIST_KEY);
  } catch {
    // empty
  }
}


export async function syncGuestWishlistToBackend(toggleApiFn, getBackendIdsApiFn) {
  const guestItems = getGuestWishlist();
  if (!guestItems || guestItems.length === 0) return 0;

  try {

    let existingBackendIds = [];
    if (typeof getBackendIdsApiFn === "function") {
      const res = await getBackendIdsApiFn();
      if (res?.success && Array.isArray(res.productIds)) {
        existingBackendIds = res.productIds.map((id) => String(id));
      }
    }


    const itemsToSync = guestItems.filter(
      (item) => !existingBackendIds.includes(String(item._id || item.id))
    );


    if (typeof toggleApiFn === "function" && itemsToSync.length > 0) {
      await Promise.allSettled(
        itemsToSync.map((item) => toggleApiFn(String(item._id || item.id)))
      );
    }

    clearGuestWishlist();
    return itemsToSync.length;
  } catch {
    return 0;
  }
}
