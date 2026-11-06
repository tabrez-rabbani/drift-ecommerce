import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 20 },
    { duration: "20s", target: 50 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<300"],
    http_req_failed: ["rate<0.02"],
  },
};

const BASE_URL = "http://localhost:5000";

export default function () {
  const res = http.get(`${BASE_URL}/api/products`);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "payload verified": (r) => r.body.includes("Products fetched successfully"),
  });

  sleep(0.1);
}
