import Redis from "ioredis";
import { config } from "./config.js";

let redisClient = null;

try {
    redisClient = new Redis(config.REDIS_URL, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: false,
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    });

    redisClient.on("connect", () => {
        // Connected to Redis
    });

    redisClient.on("error", (err) => {
        // Log but don't crash the Node.js process if Redis temporarily disconnects
        console.error("Redis connection error:", err.message);
    });
} catch (error) {
    console.error("Failed to initialize Redis client:", error.message);
}

export default redisClient;

