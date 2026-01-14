import FollowController from "../controllers/follow.controllers";
import auth from "../middlewares/auth.middlewares";
import rateLimitMiddleware from "../middlewares/rate-limit.middlewares";
import BaseRoutes from "./base.routes";
import { UserValidator } from "../validators/user.validators";
import { validateMiddleware } from "../middlewares/validation.middlewares";

/**
 * Define the follow routes
 */
export default class FollowRoutes extends BaseRoutes {
    constructor() {
        super("/api/users");
    }

    protected setupRoutes(): void {
        this.router.post("/:following_id/follow", 
            UserValidator.followingId(),
            validateMiddleware,
            auth, 
            rateLimitMiddleware(5 * 1000, 10), 
            FollowController.create);

        this.router.delete("/:following_id/follow", 
            auth, 
            UserValidator.followingId(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            FollowController.destroy);

        this.router.get("/:following_id/follow/me", 
            auth, 
            UserValidator.followingId(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            FollowController.isFollowing);

        this.router.get("/:id/followers", 
            UserValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            FollowController.getFollowers);

        this.router.get("/:id/following", 
            UserValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            FollowController.getFollowing);
    }
}