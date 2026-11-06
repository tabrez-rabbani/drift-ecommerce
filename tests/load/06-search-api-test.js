import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("search_error_rate");

export const options = {
  stages: [
    { duration: "20s", target: 10 },
    { duration: "30s", target: 50 },
    { duration: "30s", target: 150 },
    { duration: "40s", target: 300 },
    { duration: "10s", target: 10 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<1500"],
    search_error_rate: ["rate<0.05"],
  },
};

const searchKeywords = ["shirt", "jeans", "jacket", "black", "white", "cotton"];
const BASE_URL = "http://localhost:5000";

export default function () {
  const keyword = searchKeywords[__VU % searchKeywords.length];

  const res = http.get(`${BASE_URL}/api/products/search?q=${keyword}`, {
    headers: { "Content-Type": "application/json" },
    tags: { keyword },
  });

  const isSuccess = check(res, {
    "status is 200": (r) => r.status === 200,
    "has products array": (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.products);
      } catch {
        return false;
      }
    },
    "duration under 1500ms": (r) => r.timings.duration < 1500,
  });

  errorRate.add(!isSuccess);
  sleep(0.5);
}
