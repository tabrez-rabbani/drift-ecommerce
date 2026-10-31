import authApiInstance from "@/lib/axios";

export async function fetchGlobalSearchApi(query, signal) {
  const response = await authApiInstance.get("/admin/search", {
    params: { q: query },
    signal,
  });
  return response.data;
}


