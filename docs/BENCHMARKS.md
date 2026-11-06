# Backend Performance & Load Testing Report

> **Project:** Drift — Full-Stack E-Commerce Platform  
> **Testing Suite:** Grafana k6 v2.3.0  
> **Environment:** Node.js, Express.js, MongoDB, Redis (v3.0.504 on Windows)  
> **Architecture Mode:** Single-instance Node.js process + Redis Caching Middleware  
> **Hardware:** 8 Cores (Single-core utilized in Baseline and Caching stages)

---

## 1. Key Terminology & Concepts (Glossary)

To ensure this report is easy to understand for developers, recruiters, and engineering managers, here is a breakdown of the standard terminology used throughout this document:

| Term / Acronym | Full Form | What It Means in Plain English |
|---|---|---|
| **VU / VUs** | **Virtual Users** | Simulated concurrent shoppers. Unlike human visitors who browse and pause for 5–10 seconds, these automated virtual users continuously request pages every few milliseconds without stopping. |
| **RPS** | **Requests Per Second** | Throughput metric: The exact number of HTTP requests the backend server processes and completes in a single second. |
| **Latency** | **Response Time** | The total time (in milliseconds or seconds) it takes between sending a request and receiving the full response back from the server. |
| **p(95) Latency** | **95th Percentile Latency** | The maximum response time experienced by 95% of users. Only the slowest 5% of requests took longer than this number. This is the industry standard for measuring user experience. |
| **Breakpoint Test** | **Breaking Point Test** | A stress test where traffic is stepped up continuously (e.g. 50 → 200 → 500 → 1,000 users) to find the exact threshold where the server begins timing out or dropping connections. |
| **Cache Hit** | **Redis Cache Hit** | When requested data is already stored in Redis memory (RAM) and served immediately in microseconds without touching the database. |
| **Cache Miss** | **Redis Cache Miss** | When requested data is not yet in Redis memory, requiring Node.js to query MongoDB, return the result, and save it to Redis for future hits. |
| **Hit Ratio** | **Cache Hit Percentage** | The percentage of requests fulfilled entirely from RAM without querying the database ($\frac{\text{Hits}}{\text{Hits} + \text{Misses}} \times 100$). |
| **TTL** | **Time-To-Live** | The duration (e.g., 300 seconds / 5 minutes) that cached data stays alive in Redis before automatically expiring. |

---

## 2. Executive Summary

This report documents the real-world performance, concurrency limits, and breaking points of the **Drift E-Commerce Backend**.

Using automated load testing scripts written in **k6**, we tested the core transactional catalog endpoint (`GET /api/products`) across varying traffic conditions—from single-core database baselines to extreme high-concurrency flash sale traffic (1,000 concurrent virtual users) backed by Redis in-memory caching.

### Key Highlights:
- **100,000+ Transactions Handled with 0% Failures:** Processed **102,304 requests** at a peak of **1,130 req/sec (1,076.28 sustained RPS)** under **1,000 concurrent virtual users** with a **0.00% failure rate**.
- **21.4x Throughput Multiplier:** Throughput surged from **50.22 req/sec (baseline)** to **1,076.28 req/sec (Redis cached)** on a single Node.js core.
- **Single-Core Ceiling Extended Beyond 1,000 Users:** Proved that with in-memory caching, a single Node.js event-loop process can effortlessly sustain 1,000 concurrent users with a p(95) latency under 800 ms (**795.87 ms**).
- **Single-Digit Telemetry Alignment:** Redis verified an exact **>99.9% Cache Hit Ratio** while consuming only **695 KB** of system RAM.

---

## 3. Before vs. After Optimization Matrix

| Metric | Baseline (MongoDB Only) | Breakpoint (No Cache) | Phase 1 (Redis 350 Users) | Phase 1 (Redis 700 Users) | Phase 1 (Redis 1,000 Users) |
|---|---|---|---|---|---|
| **Max Concurrent Users (VUs)** | 50 Users | 350 Users | 350 Users | 700 Users | **1,000 Users** |
| **Total Completed Requests** | 2,017 | 4,328 (choked) | 32,315 | 41,836 | **102,304** |
| **Throughput (Requests/Second)** | 50.22 req/s | Saturation | 461.52 req/s | 522.91 req/s | **1,076.28 req/s (Peak: 1.13k/s)** |
| **Error / Timeout Rate** | 0.00% | **Failures at 250 Users (>5s)** | **0.00%** | **0.00%** | **0.00%** |
| **Average Latency** | 424.20 ms | High | 248.56 ms | 605.58 ms | **462.30 ms** |
| **p(95) Latency** | 913.12 ms | > 5,000 ms (Timeout) | 599.45 ms | 1,120 ms (1.12s) | **795.87 ms** |
| **Max Latency** | 1.80 s | > 5,000 ms | 1.05 s | 1.59 s | **1.05 s** |
| **Network Data Transferred** | 31 MB | ~65 MB | 502 MB | 650 MB | **1.6 GB (17.6 MB/s)** |
| **Redis Cache Hit Ratio** | N/A | N/A | 99.99% | 99.995% | **>99.9%** |

---

## 4. Test Methodology & Implementation

### A. Non-Intrusive Express Caching Middleware
Instead of altering core controller or DAO logic, a modular Express caching middleware (`src/middlewares/cacheMiddleware.js`) was engineered:
- Intercepts incoming `GET /api/products` requests.
- Checks Redis using namespace key pattern (`products:/api/products...`).
- Injects standard caching headers: `X-Cache: HIT` and `X-Cache: MISS`.
- **Fail-Open Resilience:** If the Redis service is unavailable, the middleware transparently falls back to MongoDB without throwing errors.

### B. Automated Cache Invalidation
To prevent stale reads, write operations (`createProduct`, `editProduct`, `removeProduct`) trigger pattern-based invalidation:
```javascript
await clearCachePattern("products:*");
```

---

## 5. Benchmark Stages & Detailed Results

### Stage 1: Smoke / Baseline Sanity (10 Virtual Users, 15s)
- **Goal:** Verify endpoint health and baseline database connectivity.
- **Results:** 250 requests, 100% success rate, 118.12 ms avg latency, 218.79 ms p(95).

### Stage 2: Single-Core Capacity Baseline (50 Virtual Users, 40s)
- **Configuration:** No caching, direct MongoDB read queries.
- **Results:** 2,017 requests processed at 50.22 RPS with 0.00% error rate.
- **Observation:** Median latency was 235 ms, but p(95) reached 913 ms due to database query serialization of 39 items per request.

### Stage 3: Breakpoint Stress Test Without Caching (50 → 350 Virtual Users, 70s)
- **Results:** At second 52 (~250 concurrent users), the single-core Node.js event-loop and MongoDB connection pool reached complete saturation.
- **Outcome:** Subsequent requests timed out exceeding the 5,000 ms limit (`Request Failed: request timeout`).

### Stage 4: Flash Sale Concurrency Test (Ramping to 700 Virtual Users, 80s)
- **Results:** 41,836 requests processed at 522.91 RPS with 0.00% error rate and 1.12s p(95) latency.

### Stage 5: Mega 1,000 Virtual Users Stress Test (95s)
- **Configuration:** Redis caching active, stats reset prior to execution via `CONFIG RESETSTAT`.
- **Traffic Profile:**
  - 0–15s: 200 Virtual Users
  - 15–35s: 500 Virtual Users
  - 35–60s: 800 Virtual Users
  - 60–85s: 1,000 Virtual Users (Peak 1,000 concurrent shoppers)
  - 85–95s: Graceful cool down to 0
- **Results:**
  - **Total Iterations:** **102,304 requests** completed.
  - **Sustained RPS:** **1,076.28 requests/second** (Peak: **1,130 req/sec**).
  - **Error Rate:** Exactly **0.00%** (0 errors out of 102,304 requests).
  - **p(95) Latency:** Controlled at **795.87 ms** (Under 800 ms!).
  - **Peak Max Latency:** **1.05 seconds** (well below the 5-second failure threshold).
  - **Network Throughput:** **1.6 GB** transferred at a peak rate of **17.6 MB/s**.

---

## 6. Redis Internal Verification (`INFO STATS` & `INFO MEMORY`)

Following Stage 5, Redis internal telemetry was polled directly via `redis-cli`:

```
# Stats (Post-test telemetry)
total_connections_received: 1
total_commands_processed: 101244
keyspace_hits: 101211
keyspace_misses: 16
total_net_output_bytes: 4,041,616,517 (~4.04 GB)
rejected_connections: 0

# Memory
used_memory_human: 695.49K (< 700 KB)
used_memory_peak_human: 28.40M
```

$$\text{Cache Hit Ratio} = \frac{101,211}{101,211 + 16} \times 100 = \frac{101,211}{101,227} \times 100 = \mathbf{99.984\%}$$

**Key Architectural Insight:**  
Serving 101,227 requests and transmitting over **4.04 GB of data** required only **695 KB of RAM**, proving world-class memory and throughput efficiency.

---

## 7. Individual API Benchmark Results

After establishing the Product Catalog baseline, each critical API endpoint was tested independently to measure its unique performance characteristics.

---

### Test 6 — Search API (`GET /api/products/search?q=`)

**Script:** `06-search-api-test.js`  
**Traffic Profile:** 10 → 50 → 150 → 300 Virtual Users over 2m 10s  
**Keywords Rotated:** `shirt`, `jeans`, `jacket`, `black`, `white`, `cotton` (6 unique cache keys)

| Metric | Result |
|---|---|
| **Max Concurrent Users** | 300 |
| **Total Requests Completed** | 28,483 |
| **Sustained RPS** | 218.3 req/s *(includes 500ms think time per iteration)* |
| **Error Rate** | **0.00%** (0 out of 28,483) |
| **Average Latency** | **10.28 ms** |
| **p(90) Latency** | **24.21 ms** |
| **p(95) Latency** | **36.02 ms** 🏆 |
| **Max Latency** | 622.39 ms (cold cache first hit only) |
| **Network Data Received** | 214 MB |

**Key Insight — Why Search is 23x Faster than Products Catalog:**

The Search API uses a 60-second TTL cache keyed by query string. With only 6 rotating keywords, all 6 Redis cache keys warm up within the **first 20 seconds (Stage 1, 10 Virtual Users)**. For the remaining **1m50s** of the test, MongoDB received **approximately 6 total queries** — one per unique keyword — while Redis served **28,477 requests from RAM** at sub-millisecond speed.

$$\text{Effective Cache Hit Ratio} = \frac{28,477}{28,483} \approx \mathbf{99.98\%}$$

This demonstrates a core caching principle: **the fewer unique cache keys a workload generates, the higher the cache efficiency and the lower the database load.**

---

### Test 7 — Categories & Hero API (`GET /api/categories` + `GET /api/hero`)

**Script:** `07-categories-hero-test.js`  
**Traffic Profile:** 10 → 50 → 100 → 200 Virtual Users over 2m 10s  
**Cache Status:** ❌ No Redis caching — every request hits MongoDB directly  
**Dataset Size:** 9 categories + 5 hero slides

| Metric | Categories API | Hero API |
|---|---|---|
| **Threshold Passed?** | ❌ **FAILED** (p95 > 1000ms) | ✅ Passed |
| **p(95) Latency** | **1,608 ms** | **854 ms** |
| **p(90) Latency** | 854 ms | 817 ms |
| **Average Latency** | 561 ms | 428 ms |
| **Max Latency** | 1,788 ms | 1,727 ms |
| **Error Rate** | **0.00%** | **0.00%** |
| **Total Requests** | 6,985 iterations × 2 = 13,970 total | ← same test |
| **Network Data** | 44 MB total | ← same test |

**Key Findings:**

1. **Zero errors, but threshold breached:** The server did not crash or drop connections at 200 VUs. However, the Categories API p(95) crossed 1,608 ms — 60% over the 1,000 ms SLA target. This means the **slow tail (5% of requests) is unacceptable for production UX.**

2. **Hero is faster despite being uncached:** Hero slides (5 documents, mostly URL strings) are leaner documents than categories (9 documents with nested slugs, image metadata, and display ordering). Smaller documents = faster MongoDB cursor = lower latency.

3. **The Caching Gap — 44x Latency Difference:**

| Endpoint | Cache Status | p(95) at Load |
|---|---|---|
| Search API | ✅ Redis (60s TTL) | **36 ms** |
| Hero API | ❌ No cache | **854 ms** |
| Categories API | ❌ No cache | **1,608 ms** |

$$\text{Caching Speedup} = \frac{1608\text{ ms}}{36\text{ ms}} \approx \mathbf{44.7\times}$$

**Recommendation:** Both `GET /api/categories` and `GET /api/hero` are read-heavy, rarely-updated endpoints — ideal caching candidates with a long TTL (600s+). Adding `cacheMiddleware` to these routes would bring their p(95) latency down to the 30–50ms range observed in the Search API test.

---

### Test 8 — Product Detail Page API (`GET /api/products/detail/:slug`)

**Script:** `08-product-detail-test.js`  
**Traffic Profile:** 10 → 50 → 150 → 300 Virtual Users over 2m 10s  
**Cache Status:** ✅ Redis caching active (TTL: 300s), keyed per product slug  
**Slugs Rotated:** 6 real product slugs (6 unique Redis cache keys)

| Metric | Result |
|---|---|
| **Threshold Passed?** | ✅ All thresholds passed |
| **p(95) Latency** | **21.56 ms** 🏆 |
| **p(90) Latency** | 12.65 ms |
| **Average Latency** | **6.5 ms** |
| **Max Latency** | 178.61 ms (cold cache first hit only) |
| **Error Rate** | **0.00%** (0 out of 28,740) |
| **Total Requests** | 28,740 |
| **Network Data** | 79 MB received |

**Key Finding — Single-Document Cache is the Fastest Pattern:**

Product detail fetches a single document by a unique indexed field (`slug`). This is MongoDB's most efficient query type — O(1) index lookup. Combined with Redis caching (6 slugs → 6 keys, warmed in Stage 1), the endpoint becomes essentially a RAM read for the entire test duration.

**Cumulative API Performance Leaderboard (cached endpoints at 300 VUs):**

| Rank | Endpoint | p(95) Latency | Cache? |
|---|---|---|---|
| 🥇 1st | `GET /api/products/detail/:slug` | **21.56 ms** | ✅ Redis |
| 🥈 2nd | `GET /api/products/search?q=` | **36.02 ms** | ✅ Redis |
| 🥉 3rd | `GET /api/hero` | **854 ms** | ❌ None |
| 4th | `GET /api/categories` | **1,608 ms** | ❌ None |

---

## 8. Next Optimization Roadmap

While Redis in-memory caching eliminated the database bottleneck and handled 1,000 users at 1,065 RPS, the architecture is still constrained to **1 single CPU core (leaving 7 of the host machine's 8 cores idle)**.

- [x] **Phase 1: In-Memory Caching (Redis)** — **COMPLETED (1,065 RPS, 99.984% Hit Ratio, 1,000 Users, 0% Errors)**
- [ ] **Phase 2: Vertical Scaling (Multi-Core Cluster / PM2)**  
  Utilize Node.js `cluster` mode to fork 8 worker processes across all 8 CPU cores. Target: **3,000+ Requests Per Second**.
- [ ] **Phase 3: Payload Size Optimization**  
  Add field projection to catalog queries to reduce per-item payload size from 14.5 KB to ~4 KB.
