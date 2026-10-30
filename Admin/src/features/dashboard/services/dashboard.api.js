import authApiInstance from "@/lib/axios";

export async function fetchDashboardStatsApi() {
  const response = await authApiInstance.get("/admin/dashboard-stats");
  return response.data;
}

