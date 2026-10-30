import authApiInstance from "@/lib/axios";

export async function fetchHeroSlidesApi() {
  const response = await authApiInstance.get("/hero/admin/all");
  return response.data;
}

export async function createHeroSlideApi(formData) {
  const response = await authApiInstance.post("/hero", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateHeroSlideApi(id, formData) {
  const response = await authApiInstance.put(`/hero/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function toggleHeroStatusApi(id) {
  const response = await authApiInstance.patch(`/hero/${id}/toggle`);
  return response.data;
}

export async function deleteHeroSlideApi(id) {
  const response = await authApiInstance.delete(`/hero/${id}`);
  return response.data;
}
