import authApiInstance from "@/lib/axios";

export async function fetchProductsApi(params = {}) {
  const response = await authApiInstance.get("/products", { params });
  return response.data;
}

export async function fetchAdminProductByIdApi(id) {
  const response = await authApiInstance.get(`/products/admin/${id}`);
  return response.data;
}

export async function createProductApi(formData) {
  const response = await authApiInstance.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function updateProductApi(id, formData) {
  const response = await authApiInstance.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteProductApi(id) {
  const response = await authApiInstance.delete(`/products/${id}`);
  return response.data;
}

export async function fetchCategoriesApi() {
  const response = await authApiInstance.get("/categories");
  return response.data;
}
