import sql from "../config/postgres";
import { faker } from "@faker-js/faker";

/**
 * Generate some fake data for likes table
 */
export default class LikeFactory {
    /**
     * Generate some fake likes
     * @param like_amount - The number of likes to create
     * @param max_post - The maximum post ID
     * @param max_user - The maximum user ID
     */
    static async create(like_amount: number = 20, max_post: number = 20, max_user: number = 30) {
        console.log('Creating fake likes');
        const likes = faker.helpers.uniqueArray(() => ({
            post_id: faker.number.int({ min: 1, max: max_post }),
            user_id: faker.number.int({ min: 1, max: max_user }),
        }), like_amount);

        await sql`
            INSERT INTO likes 
            ${sql(likes, 'post_id', 'user_id')}
          `;

        console.log('Fake likes created');
    }
}