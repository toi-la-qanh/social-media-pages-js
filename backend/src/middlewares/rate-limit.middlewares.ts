import { rateLimit } from "express-rate-limit";

/**
 * Set the rate limit
 * @param timeLimit - Time limit in milliseconds
 * @param limitCount - Limit of requests per window
 * @param message - Message to return when rate limit is exceeded
 * @returns Rate limit middleware
 */
export default function rateLimitMiddleware(timeLimit: number, limitCount: number, message: string = 'Too many attempts, please try again in a few minutes !') {
    return rateLimit({
        windowMs: timeLimit,
        limit: limitCount,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: { errors: message },
    })
};