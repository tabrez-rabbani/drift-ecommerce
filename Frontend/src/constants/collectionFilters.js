export const FILTER_COLORS = [
  { name: "Beige", hex: "#D4B896", synonyms: ["beige", "cream", "sand", "tan", "ecru", "nude", "ivory", "oatmeal"] },
  { name: "Black", hex: "#000000", synonyms: ["black", "noir", "onyx", "jet"] },
  { name: "Blue", hex: "#1D4ED8", synonyms: ["blue", "navy", "denim", "indigo", "cobalt", "cyan", "sky", "azure"] },
  { name: "Bronze", hex: "#A86F3E", synonyms: ["bronze", "copper", "metallic"] },
  { name: "Brown", hex: "#6B3A2A", synonyms: ["brown", "chocolate", "mocha", "latte", "camel", "coffee", "chestnut"] },
  { name: "Gold", hex: "#D4AF37", synonyms: ["gold", "golden", "champagne"] },
  { name: "Green", hex: "#2D7D46", synonyms: ["green", "olive", "sage", "emerald", "mint", "khaki", "lime", "forest"] },
  { name: "Grey", hex: "#78716C", synonyms: ["grey", "gray", "silver", "charcoal", "slate", "ash"] },
  { name: "Multi", hex: "#1F2937", synonyms: ["multi", "multicolor", "multicolour", "print", "pattern", "floral", "stripe"] },
  { name: "Orange", hex: "#EA580C", synonyms: ["orange", "rust", "coral", "peach", "apricot", "terracotta"] },
  { name: "Pink", hex: "#EC4899", synonyms: ["pink", "rose", "blush", "magenta", "fuchsia", "salmon", "powder"] },
  { name: "Purple", hex: "#7E22CE", synonyms: ["purple", "violet", "lavender", "lilac", "plum", "mauve"] },
  { name: "Red", hex: "#DC2626", synonyms: ["red", "maroon", "burgundy", "crimson", "wine", "ruby"] },
  { name: "Turquoise", hex: "#14B8A6", synonyms: ["turquoise", "teal", "aqua"] },
  { name: "White", hex: "#FFFFFF", synonyms: ["white", "snow", "pearl", "off-white"] },
  { name: "Yellow", hex: "#EAB308", synonyms: ["yellow", "mustard", "lemon", "canary"] },
];

export const matchesColorFamily = (productColorName, parentColorName) => {
  if (!productColorName || !parentColorName) return false;
  const pLower = productColorName.toLowerCase().trim();
  const targetLower = parentColorName.toLowerCase().trim();
  if (pLower === targetLower || pLower.includes(targetLower)) return true;
  const colorDef = FILTER_COLORS.find((c) => c.name.toLowerCase() === targetLower);
  if (colorDef?.synonyms) {
    return colorDef.synonyms.some((s) => pLower.includes(s));
  }
  return false;
};

export const PRICE_MIN_LIMIT = 0;
export const PRICE_MAX_LIMIT = 10000;
export const PRICE_STEP = 100;
export const PRICE_GAP = 200;
