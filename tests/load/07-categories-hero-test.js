import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const categoriesLatency = new Trend("categories_req_duration");
const heroLatency = new Trend("hero_req_duration");
const errorRate = new Rate("endpoint_error_rate");

export const options = {
  stages: [
    { duration: "20s", target: 10 },
    { duration: "30s", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "40s", target: 200 },
    { duration: "10s", target: 10 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    categories_req_duration: ["p(95)<1000"],
    hero_req_duration: ["p(95)<1000"],
    endpoint_error_rate: ["rate<0.05"],
  },
};

const BASE_URL = "http://localhost:5000";

export default function () {
  group("Categories API", () => {
    const res = http.get(`${BASE_URL}/api/categories`, {
      tags: { endpoint: "categories" },
    });

    categoriesLatency.add(res.timings.duration);

    const ok = check(res, {
      "categories status is 200": (r) => r.status === 200,
      "categories has array": (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.categories) && body.categories.length > 0;
        } catch {
          return false;
        }
      },
    });

    errorRate.add(!ok);
  });

  sleep(0.2);

  group("Hero API", () => {
    const res = http.get(`${BASE_URL}/api/hero`, {
      tags: { endpoint: "hero" },
    });

    heroLatency.add(res.timings.duration);

    const ok = check(res, {
      "hero status is 200": (r) => r.status === 200,
      "hero has array": (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.slides) && body.slides.length > 0;
        } catch {
          return false;
        }
      },
    });

    errorRate.add(!ok);
  });

  sleep(0.3);
}
