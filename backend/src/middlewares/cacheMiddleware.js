import redisClient from "../config/redis.js";

/**
 * Cache middleware for Express GET endpoints.
 * @param {string} namespace - Cache key namespace (e.g. 'products', 'categories')
 * @param {number} ttlSeconds - Cache Time-To-Live in seconds (default: 300 = 5 mins)
 */
export const cacheMiddleware = (namespace, ttlSeconds = 300) => {
    return async (req, res, next) => {
        // Only cache GET requests when Redis is operational
        if (req.method !== "GET" || !redisClient || redisClient.status !== "ready") {
            return next();
        }

        const cacheKey = `${namespace}:${req.originalUrl || req.url}`;

        try {
            const cachedResponse = await redisClient.get(cacheKey);

            if (cachedResponse) {
                res.setHeader("X-Cache", "HIT");
                return res.json(JSON.parse(cachedResponse));
            }

            // Cache MISS: Intercept res.json to store the response in Redis before sending
            res.setHeader("X-Cache", "MISS");
            const originalJson = res.json.bind(res);

            res.json = (body) => {
                res.json = originalJson;

                // Cache successful responses asynchronously
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redisClient.set(cacheKey, JSON.stringify(body), "EX", ttlSeconds).catch((err) => {
                        console.error(`[Redis] Error setting key ${cacheKey}:`, err.message);
                    });
                }

                return originalJson(body);
            };

            next();
        } catch (error) {
            // Fail open: fallback to database gracefully if Redis read throws
            next();
        }
    };
};

/**
 * Invalidate cached keys matching a specific pattern.
 * @param {string} pattern - Glob pattern, e.g. 'products:*'
 */
export const clearCachePattern = async (pattern) => {
    if (!redisClient || redisClient.status !== "ready") return;

    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (err) {
        console.error(`[Redis] Failed to clear pattern ${pattern}:`, err.message);
    }
};

export default cacheMiddleware;

