import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const productDetailLatency = new Trend("product_detail_req_duration");
const errorRate = new Rate("product_detail_error_rate");

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
    product_detail_req_duration: ["p(95)<800"],
    product_detail_error_rate: ["rate<0.05"],
  },
};

const productSlugs = [
  "blazing-wild-relaxed-fit-t-shirt",
  "shadow-wings-black-oversized-t-shirt",
  "stallion-oversized-t-shirt",
  "sky-walker-navy-oversized-t-shirt",
  "the-glory-arc-relaxed-fit-t-shirt",
  "cotton-linen-white-mandarin-shirt",
];

const BASE_URL = "http://localhost:5000";

export default function () {
  const slug = productSlugs[__VU % productSlugs.length];

  const res = http.get(`${BASE_URL}/api/products/detail/${slug}`, {
    tags: { slug },
  });

  productDetailLatency.add(res.timings.duration);

  const isSuccess = check(res, {
    "status is 200": (r) => r.status === 200,
    "has product payload": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.product !== undefined && body.product.slug === slug;
      } catch {
        return false;
      }
    },
    "duration under 800ms": (r) => r.timings.duration < 800,
  });

  errorRate.add(!isSuccess);
  sleep(0.5);
}
