import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "15s",
  thresholds: {
    http_req_duration: ["p(95)<200"],
    http_req_failed: ["rate<0.01"],
  },
};

const BASE_URL = "http://localhost:5000";

export default function () {
  const productsRes = http.get(`${BASE_URL}/api/products`);
  check(productsRes, {
    "products status is 200": (r) => r.status === 200,
    "products returns json": (r) =>
      r.headers["Content-Type"] && r.headers["Content-Type"].includes("application/json"),
  });

  sleep(0.5);

  const categoriesRes = http.get(`${BASE_URL}/api/categories`);
  check(categoriesRes, {
    "categories status is 200": (r) => r.status === 200,
  });

  sleep(0.5);
}
