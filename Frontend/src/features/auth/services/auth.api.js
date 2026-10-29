import api, { getApiBaseUrl } from "../../../services/api";

export async function registerUser({ name, email, password, phone }) {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    phone,
  });
  return response.data;
}

export async function loginUser({ email, password }) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  return response.data;
}

export async function getMe() {
  const response = await api.get("/auth/get-me");
  return response.data;
}

export async function logoutUser() {
  const response = await api.get("/auth/logout");
  return response.data;
}

export async function updateProfile(profileData) {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
}

export function redirectToGoogleAuth() {
  const apiUrl = getApiBaseUrl();
  window.location.href = `${apiUrl}/auth/google`;
}

export async function resendVerificationEmail(email) {
  const response = await api.post("/auth/resend-verification", { email });
  return response.data;
}