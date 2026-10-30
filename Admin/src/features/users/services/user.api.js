import authApiInstance from "@/lib/axios";

export async function fetchUsersApi(params = {}) {
  const response = await authApiInstance.get("/admin/users", { params });
  return response.data;
}

export async function deleteUserApi(id) {
  const response = await authApiInstance.delete(`/admin/users/${id}`);
  return response.data;
}

