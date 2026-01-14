import PostController from "../controllers/post.controllers";
import auth from "../middlewares/auth.middlewares";
import rateLimitMiddleware from "../middlewares/rate-limit.middlewares";
import BaseRoutes from "./base.routes";
import { PostValidator } from "../validators/post.validators";
import { validateMiddleware } from "../middlewares/validation.middlewares";
import { UserValidator } from "../validators/user.validators";
/**
 * Define the post routes
 */
export default class PostRoutes extends BaseRoutes {
    constructor() {
        super("/api/posts");
    }

    protected setupRoutes(): void {
        this.router.get("/", rateLimitMiddleware(5 * 1000, 10), PostController.index);
        this.router.get("/:id", 
            PostValidator.id(), 
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            PostController.show);

        this.router.post("/", auth, 
            PostValidator.content(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            PostController.create);

        this.router.patch("/:id", auth, 
            PostValidator.content(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            PostController.update);

        this.router.delete("/:id", auth, rateLimitMiddleware(5 * 1000, 10), PostController.destroy);

        this.router.get("/:id/replies/count", 
            PostValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            PostController.getCountOfReplies);

        this.router.get("/:id/replies", 
            PostValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            PostController.showReplies);

        this.router.post("/:id/replies", 
            auth, 
            PostValidator.id(),
            PostValidator.content(), 
            validateMiddleware, 
            rateLimitMiddleware(5 * 1000, 10), 
            PostController.createReply);

        this.router.get("/users/:username/posts", 
            UserValidator.username(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            PostController.getUserPosts);
            
        this.router.get("/users/:username/replies", 
            UserValidator.username(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            PostController.getUserReplies);
    }
}