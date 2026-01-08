import LikeController from "../controllers/like.controllers";
import auth from "../middlewares/auth.middlewares";
import rateLimitMiddleware from "../middlewares/rate-limit.middlewares";
import BaseRoutes from "./base.routes";

/**
 * Define the like routes
 */
export default class LikeRoutes extends BaseRoutes {
    constructor() {
        super("/api/posts");
    }

    protected setupRoutes(): void {
        this.router.get("/:post_id/likes", rateLimitMiddleware(5 * 1000, 10), LikeController.count);
        this.router.post("/:post_id/likes", auth, rateLimitMiddleware(5 * 1000, 10), LikeController.create);
        this.router.delete("/:post_id/likes", auth, rateLimitMiddleware(5 * 1000, 10), LikeController.destroy);
        this.router.get("/:post_id/likes/me", auth, rateLimitMiddleware(5 * 1000, 10), LikeController.isLiked);
    }
}