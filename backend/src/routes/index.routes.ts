import UserRoutes from "./user.routes";
import PostRoutes from "./post.routes";
import FollowRoutes from "./follow.routes";
import LikeRoutes from "./like.routes";
import RetweetRoutes from "./retweet.routes";
import BaseRoutes from "./base.routes";

/**
 * Index routes - extends BaseRoutes and automatically registers all other routes
 */
export default class IndexRoutes extends BaseRoutes {
    constructor() {
        super("/");
    }

    protected setupRoutes(): void {
        // Root endpoint
        this.router.get("/", (req, res) => {
            res.send("Hello from the backend!");
        });

        // Automatically register all routes
        const userRoutes = new UserRoutes();
        this.router.use(userRoutes.getUrl(), userRoutes.getRouter());

        const postRoutes = new PostRoutes();
        this.router.use(postRoutes.getUrl(), postRoutes.getRouter());

        const followRoutes = new FollowRoutes();
        this.router.use(followRoutes.getUrl(), followRoutes.getRouter());

        const likeRoutes = new LikeRoutes();
        this.router.use(likeRoutes.getUrl(), likeRoutes.getRouter());

        const retweetRoutes = new RetweetRoutes();
        this.router.use(retweetRoutes.getUrl(), retweetRoutes.getRouter());
    }
}