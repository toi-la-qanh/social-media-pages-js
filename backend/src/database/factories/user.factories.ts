import { faker } from "@faker-js/faker";
import sql from "../config/postgres";
import bcrypt from "bcrypt";

/**
 * Generate some fake data for users table
 */
export default class UserFactory {
    /**
     * Generate some fake users
     * @param amount - The number of users to create
     */
    static async create(amount: number = 10) {
        console.log('Creating fake users');
        const users = await Promise.all(Array.from({ length: amount }, async () => {
            return {
                email: faker.internet.email(),
                username: faker.internet.username(),
                full_name: faker.person.fullName(),
                password: await bcrypt.hash(faker.internet.password(), 10),
                bio: faker.lorem.sentences({ min: 1, max: 7 }),
            };
        }));

        await sql`
        INSERT INTO users 
        ${sql(users, 'email', 'username', 'full_name', 'password', 'bio')} 
        RETURNING id`;

        console.log('Fake users created');
    }
}
