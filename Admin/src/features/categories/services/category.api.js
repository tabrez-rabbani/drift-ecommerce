import authApiInstance from "@/lib/axios";

export async function fetchCategoriesApi() {
  const res = await authApiInstance.get("/categories");
  return res.data;
}

export async function createCategoryApi(formData) {
  const res = await authApiInstance.post("/categories", formData);
  return res.data;
}

export async function updateCategoryApi(id, formData) {
  const res = await authApiInstance.put(`/categories/${id}`, formData);
  return res.data;
}

export async function deleteCategoryApi(id) {
  const res = await authApiInstance.delete(`/categories/${id}`);
  return res.data;
}

