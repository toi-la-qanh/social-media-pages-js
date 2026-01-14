import RetweetController from "../controllers/retweet.controllers";
import auth from "../middlewares/auth.middlewares";
import rateLimitMiddleware from "../middlewares/rate-limit.middlewares";
import BaseRoutes from "./base.routes";
import { PostValidator } from "../validators/post.validators";
import { validateMiddleware } from "../middlewares/validation.middlewares";
import { UserValidator } from "../validators/user.validators";
/**
 * Define the retweet routes
 */
export default class RetweetRoutes extends BaseRoutes {
    constructor() {
        super("/api/posts");
    }
    
    protected setupRoutes(): void {
        this.router.get("/:id/retweets/count", 
            PostValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            RetweetController.count);
            
        this.router.post("/:id/retweets", 
            auth, 
            PostValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            RetweetController.create);

        this.router.delete("/:id/retweets", 
            auth, 
            PostValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            RetweetController.destroy);

        this.router.get("/users/:id/retweets", 
            auth, 
            UserValidator.id(),
            validateMiddleware,
            rateLimitMiddleware(5 * 1000, 10), 
            RetweetController.index);
    }
}