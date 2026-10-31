import authApiInstance from "@/lib/axios";

export async function adminLoginApi({ email, password }) {
  const response = await authApiInstance.post("/auth/admin-login", {
    email,
    password,
  });
  return response.data;
}

export async function adminLogoutApi() {
  const response = await authApiInstance.get("/auth/logout");
  return response.data;
}

export async function fetchCurrentUserApi() {
  const response = await authApiInstance.get("/auth/get-me");
  return response.data;
}
