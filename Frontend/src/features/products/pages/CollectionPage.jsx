import { useParams } from "react-router-dom";
import CollectionTemplate from "../components/CollectionTemplate/CollectionTemplate";

export default function CollectionPage() {
  const { category } = useParams();
  const currentCategory = category || "all";
  const title = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "All Products";

  return <CollectionTemplate title={title} category={currentCategory} />;
}
