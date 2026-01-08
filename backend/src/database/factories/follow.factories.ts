import { faker } from "@faker-js/faker";
import sql from "../config/postgres";

/**
 * Generate some fake data for follows table
 */
export default class FollowFactory {
    /**
     * Generate some fake follows
     * @param follow_amount - The number of follows to create
     * @param max_follower - The maximum follower ID
     * @param max_following - The maximum following ID
     */
    static async create(follow_amount: number = 10, max_follower: number = 30, max_following: number = 30) {
        console.log('Creating fake follows');
        const follows = faker.helpers.uniqueArray(() => ({
                follower_id: faker.number.int({ min: 1, max: max_follower }),
                following_id: faker.number.int({ min: 1, max: max_following }),
            }), follow_amount);

        await sql`
        INSERT INTO follows 
        ${sql(follows, 'follower_id', 'following_id')} 
          `;

        console.log('Fake follows created');
    }
}