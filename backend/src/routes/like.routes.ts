import LikeController from "../controllers/like.controllers";
import auth from "../middlewares/auth.middlewares";
import rateLimitMiddleware from "../middlewares/rate-limit.middlewares";
import BaseRoutes from "./base.routes";
import { PostValidator } from "../validators/post.validators";
import { validateMiddleware } from "../middlewares/validation.middlewares";
/**
 * Define the like routes
 */
export default class LikeRoutes extends BaseRoutes {
    constructor() {
        super("/api/posts");
    }

    protected setupRoutes(): void {
        this.router.get("/:id/likes", 
            PostValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            LikeController.count);

        this.router.post("/:id/likes", auth, 
            PostValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            LikeController.create);

        this.router.delete("/:id/likes", auth, 
            PostValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            LikeController.destroy);
            
        this.router.get("/:id/likes/me", 
            auth, 
            PostValidator.id(), 
            validateMiddleware, 
            rateLimitMiddleware(5 * 1000, 10), 
            LikeController.isLiked);
    }
}