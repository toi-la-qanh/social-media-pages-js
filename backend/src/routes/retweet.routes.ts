import RetweetController from "../controllers/retweet.controllers";
import auth from "../middlewares/auth.middlewares";
import rateLimitMiddleware from "../middlewares/rate-limit.middlewares";
import BaseRoutes from "./base.routes";

/**
 * Define the retweet routes
 */
export default class RetweetRoutes extends BaseRoutes {
    constructor() {
        super("/api/posts");
    }
    
    protected setupRoutes(): void {
        this.router.get("/:post_id/retweets/count", rateLimitMiddleware(5 * 1000, 10), RetweetController.count);
        this.router.post("/:post_id/retweets", auth, rateLimitMiddleware(5 * 1000, 10), RetweetController.create);
        this.router.delete("/:post_id/retweets", auth, rateLimitMiddleware(5 * 1000, 10), RetweetController.destroy);
        this.router.get("/users/:user_id/retweets", auth, rateLimitMiddleware(5 * 1000, 10), RetweetController.index);
    }
}