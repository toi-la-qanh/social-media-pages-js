import FollowController from "../controllers/follow.controllers";
import auth from "../middlewares/auth.middlewares";
import rateLimitMiddleware from "../middlewares/rate-limit.middlewares";
import BaseRoutes from "./base.routes";

/**
 * Define the follow routes
 */
export default class FollowRoutes extends BaseRoutes {
    constructor() {
        super("/api/users");
    }

    protected setupRoutes(): void {
        this.router.post("/:following_id/follow", auth, rateLimitMiddleware(5 * 1000, 10), FollowController.create);
        this.router.delete("/:following_id/follow", auth, rateLimitMiddleware(5 * 1000, 10), FollowController.destroy);
        this.router.get("/:following_id/follow/me", auth, rateLimitMiddleware(5 * 1000, 10), FollowController.isFollowing);
        this.router.get("/:user_id/followers", rateLimitMiddleware(5 * 1000, 10), FollowController.getFollowers);
        this.router.get("/:user_id/following", rateLimitMiddleware(5 * 1000, 10), FollowController.getFollowing);
    }
}