import api from "../../../services/api";

export async function fetchHeroSlides() {
  const response = await api.get("/hero");
  return response.data;
}
