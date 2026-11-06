import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "15s", target: 50 },
    { duration: "15s", target: 100 },
    { duration: "15s", target: 200 },
    { duration: "15s", target: 350 },
    { duration: "10s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
  },
};

const BASE_URL = "http://localhost:5000";

export default function () {
  const res = http.get(`${BASE_URL}/api/products`, {
    timeout: "5s",
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(0.05);
}
