import UserController from "../controllers/user.controllers";
import auth from "../middlewares/auth.middlewares";
import rateLimitMiddleware from "../middlewares/rate-limit.middlewares";
import BaseRoutes from "./base.routes";
import { UserValidator } from "../validators/user.validators";
import { validateMiddleware } from "../middlewares/validation.middlewares";

/**
 * Define the user routes
 */
export default class UserRoutes extends BaseRoutes {
    constructor() {
        super("/api/users");
    }

    protected setupRoutes(): void {
        // User info
        this.router.get("/me", auth, UserController.getCurrentUser);
        this.router.get("/profile/:username",
            UserValidator.username(),
            validateMiddleware,
            UserController.getUser);

        // Auth
        this.router.post("/signup",
            rateLimitMiddleware(5 * 60 * 1000, 20),
            UserValidator.email(),
            UserValidator.password(),
            UserValidator.username(),
            UserValidator.fullName(),
            validateMiddleware,
            UserController.create);

        this.router.post("/signin",
            rateLimitMiddleware(5 * 60 * 1000, 20),
            UserValidator.email(),
            UserValidator.password(),
            validateMiddleware,
            UserController.login);

        this.router.post("/logout", 
            auth, 
            rateLimitMiddleware(5 * 60 * 1000, 20),
            UserController.logout);

        // Account management
        this.router.delete("/", 
            auth, 
            validateMiddleware,
            UserController.delete);

        // Password reset
        this.router.post("/forgot-password", 
            rateLimitMiddleware(5 * 60 * 1000, 20),
            UserValidator.email(),
            validateMiddleware,
            UserController.forgotPassword);

        this.router.patch("/update-password/:token", 
            rateLimitMiddleware(5 * 60 * 1000, 20),
            UserValidator.token(),
            UserValidator.password(),
            UserValidator.passwordConfirm(),
            validateMiddleware,
            UserController.updatePassword);

        // Search
        this.router.get("/search", 
            rateLimitMiddleware(5 * 1000, 10),
            UserValidator.query(),
            validateMiddleware,
            UserController.search);
    }
}