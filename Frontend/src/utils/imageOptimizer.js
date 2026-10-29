/**
 * Utility to optimize image URLs on the fly.
 *
 * For ImageKit URLs (e.g. `https://ik.imagekit.io/...`), it injects dynamic transformation parameters:
 * - `w-<width>`: Resizes the image to the exact width needed (e.g. 500px for product cards)
 * - `q-<quality>`: Compresses with high visual fidelity (default 80)
 * - `f-auto`: Automatically delivers next-gen WebP/AVIF format based on browser support
 *
 * For any other URLs (local public assets like `/images/...`, SVGs, external URLs),
 * it returns the original URL untouched so nothing ever breaks.
 *
 * @param {string} url - The image URL
 * @param {Object} [options]
 * @param {number} [options.width] - Desired width in pixels
 * @param {number} [options.height] - Optional desired height in pixels
 * @param {number} [options.quality=80] - Compression quality (1-100)
 * @param {string} [options.format="auto"] - Auto formats to WebP/AVIF
 * @returns {string} - The optimized URL (or original URL if not ImageKit or invalid)
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") return url || "";

  // Do not modify data URIs, blob URLs, or vector SVGs
  if (
    url.startsWith("data:") ||
    url.startsWith("blob:") ||
    url.endsWith(".svg") ||
    url.includes(".svg?")
  ) {
    return url;
  }

  // Handle ImageKit URLs
  if (url.includes("ik.imagekit.io")) {
    const { width, height, quality = 80, format = "auto" } = options;

    const transforms = [];
    if (width) transforms.push(`w-${width}`);
    if (height) transforms.push(`h-${height}`);
    if (quality) transforms.push(`q-${quality}`);
    if (format) transforms.push(`f-${format}`);

    if (transforms.length === 0) return url;

    // Avoid duplicate transformations if already present
    if (url.includes("tr=") || url.includes("tr:")) {
      return url;
    }

    const trQuery = `tr=${transforms.join(",")}`;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${trQuery}`;
  }

  // Fallback for non-ImageKit images (returns original unchanged)
  return url;
}
