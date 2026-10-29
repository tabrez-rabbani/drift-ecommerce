import { useParams } from "react-router-dom";
import ProductDetail from "../components/ProductDetail/ProductDetail";

export default function ProductDetailPage() {
  const { slug } = useParams();

  return <ProductDetail slug={slug} />;
}
