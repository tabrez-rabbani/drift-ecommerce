// Trending category tabs for the homepage Trending section.
// `categories` is an array of DB category slugs to query (supports multi-slug OR).
export const TRENDING_CATEGORIES = [
  {
    id: "all",
    label: "ALL",
    categories: [],
  },
  {
    id: "shirts",
    label: "SHIRTS",
    categories: ["shirts"],
  },
  {
    id: "jeans",
    label: "JEANS",
    categories: ["jeans"],
  },
  {
    id: "t-shirts",
    label: "T-SHIRTS",
    categories: ["t-shirts", "polos", "tees"],
  },
  {
    id: "trousers",
    label: "TROUSERS",
    categories: ["trousers", "cargos"],
  },
  {
    id: "jackets",
    label: "JACKETS",
    categories: ["jackets", "outerwear"],
  },
  {
    id: "shoes",
    label: "SHOES",
    categories: ["shoes", "footwear", "sneakers"],
  },
];
