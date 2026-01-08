import UserFactory from "./user.factories";
import PostFactory from "./post.factories";
import LikeFactory from "./like.factories";
import FollowFactory from "./follow.factories";
import RetweetFactory from "./retweet.factories";

/**
 * Generate some fake data for testing. 
 * @param createData - Set to true if you want to create fake data
 */
export default class IndexFactory {
    /**
     * Run the factory
     */
    static async run(createData: boolean = false) {
        if (process.env.NODE_ENV !== 'local') {
            throw new Error('Are you sure you want to create fake data in production?');
        }
        if (!createData) return;

        await UserFactory.create(10);
        await PostFactory.create(10, 10);
        await LikeFactory.create(10, 10, 10);
        await FollowFactory.create(10, 10, 10);
        await RetweetFactory.create(10, 10, 10);
    }
}