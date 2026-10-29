/**
 * Subcategories grouped by their parent category slug.
 * Admin selects a category first, then picks a subcategory from this map.
 * The `value` is the slug stored in DB and used in collection URLs.
 */
export const SUBCATEGORIES_BY_CATEGORY = {
  shirts: [
    { label: "Formal Shirts", value: "formal-shirts" },
    { label: "Hand Embroidered", value: "embroidered-shirts" },
    { label: "Jacquard Shirts", value: "jacquard-shirts" },
    { label: "Striped Shirts", value: "striped-shirts" },
    { label: "Printed Shirts", value: "printed-shirts" },
    { label: "Checked Shirts", value: "checked-shirts" },
    { label: "Linen Shirts", value: "linen-shirts" },
  ],
  // Add more parent categories here as the store grows:
  // pants: [
  //   { label: "Chinos", value: "chinos" },
  //   { label: "Joggers", value: "joggers" },
  // ],
};
