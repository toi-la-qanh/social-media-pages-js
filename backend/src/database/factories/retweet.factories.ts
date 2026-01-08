import sql from "../config/postgres";
import { faker } from "@faker-js/faker";

/**
 * Generate some fake data for retweets table
 */
export default class RetweetFactory {
    /**
     * Generate some fake retweets
     * @param retweet_amount - The number of retweets to create
     * @param max_post - The maximum post ID
     * @param max_user - The maximum user ID
     */
    static async create(retweet_amount: number = 20, max_post: number = 20, max_user: number = 30) {
        console.log('Creating fake retweets');
        const retweets = faker.helpers.uniqueArray(() => ({
            post_id: faker.number.int({ min: 1, max: max_post }),
            user_id: faker.number.int({ min: 1, max: max_user }),
        }), retweet_amount);

        await sql`
            INSERT INTO retweets 
            ${sql(retweets, 'post_id', 'user_id')}
          `;

        console.log('Fake retweets created');
    }
}