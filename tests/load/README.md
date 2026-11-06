# Drift — K6 Load Testing Suite

This directory contains automated load testing scripts written for [Grafana k6](https://k6.io/) to measure concurrency limits, response latency, and breaking points of the Drift backend API.

---

## Prerequisites

1. **Install k6:**
   ```powershell
   winget install GrafanaLabs.k6
   ```

2. **Ensure backend is running locally:**
   ```powershell
   cd backend
   npm run dev
   ```

3. **Ensure Redis is running:**
   ```powershell
   redis-cli ping
   # Expected output: PONG
   ```

---

## Test Suite Overview

| Script | Target Endpoint | Concurrency (VUs) | Purpose |
|---|---|---|---|
| `01-smoke-test.js` | `/api/products`, `/api/categories` | 10 VUs | Smoke test — verify basic server health |
| `02-products-load.js` | `/api/products` | 50 VUs | Baseline load test without caching |
| `03-breakpoint-test.js` | `/api/products` | 50 → 350 VUs | Breakpoint hunting without caching (choked at ~250 VUs) |
| `04-extreme-breakpoint-700.js` | `/api/products` | 100 → 700 VUs | High concurrency stress test with Redis caching |
| `05-mega-1000-vus.js` | `/api/products` | 200 → 1,000 VUs | Flash sale concurrency test (100k+ requests, 1,076 RPS, 0% errors) |
| `06-search-api-test.js` | `/api/products/search?q=` | 10 → 300 VUs | Search queries load test (6 rotated keywords, 36ms p95) |
| `07-categories-hero-test.js` | `/api/categories`, `/api/hero` | 10 → 200 VUs | Uncached direct database reads stress test |
| `08-product-detail-test.js` | `/api/products/detail/:slug` | 10 → 300 VUs | Product detail page (PDP) cached endpoint test (21ms p95) |

---

## How to Run a Test

Run any test script using the k6 CLI with optional real-time web dashboard:

```powershell
# Run with interactive web dashboard at http://127.0.0.1:5665
k6 run --out web-dashboard tests/load/05-mega-1000-vus.js

# Run terminal-only
k6 run tests/load/05-mega-1000-vus.js
```

---

## Documentation

Full results, latency percentiles, Redis telemetry, and architectural analysis are documented in:
[`docs/BENCHMARKS.md`](../../docs/BENCHMARKS.md)

