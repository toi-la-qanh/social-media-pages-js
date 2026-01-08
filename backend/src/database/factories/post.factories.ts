import sql from "../config/postgres";
import { faker } from "@faker-js/faker";

/**
 * Generate some fake data for posts table
 */
export default class PostFactory {
    /**
     * Generate some fake posts
     * @param post_amount - The number of posts to create
     * @param max_user - The maximum user ID
     */
    static async create(post_amount: number = 20, max_user: number = 30) {
        console.log('Creating fake posts');
        const rootPosts = Array.from({ length: post_amount }, () => ({
            content: faker.lorem.paragraphs({ min: 1, max: 5 }),
            user_id: faker.number.int({ min: 1, max: max_user }),
            image_url: faker.helpers.maybe(() => faker.image.url(), { probability: 0.5 }) ?? null,
            created_at: faker.date.recent()
        }));

        await sql`
            INSERT INTO posts 
            ${sql(rootPosts, 'user_id', 'content', 'image_url', 'created_at')}
          `;

        console.log('Fake posts created');
    }

    /**
     * Generate some fake replies
     * @param reply_amount - The number of replies to create
     * @param max_user - The maximum user ID
     * @param max_root_post - The maximum root post ID
     */
    static async createReply(reply_amount: number = 5, max_user: number = 30, max_root_post: number = 20) {
        console.log('Creating fake replies');
        const replyPosts = Array.from({ length: reply_amount }, () => ({
            parent_id: faker.number.int({ min: 1, max: max_root_post }),
            content: faker.lorem.sentence(),
            user_id: faker.number.int({ min: 1, max: max_user }),
            image_url: faker.helpers.maybe(() => faker.image.url(), { probability: 0.3 }) ?? null,
            created_at: faker.date.recent()
        }));

        await sql`
            INSERT INTO posts 
            ${sql(replyPosts, 'user_id', 'parent_id', 'content', 'image_url', 'created_at')}
          `;

        console.log('Fake replies created');
    }
}