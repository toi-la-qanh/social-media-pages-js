export async function up(sql: any) {
    await sql`
    CREATE TABLE IF NOT EXISTS retweets (
        id SERIAL PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_retweets_posts FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        CONSTRAINT fk_retweets_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`;

    await sql`
    CREATE INDEX IF NOT EXISTS idx_retweets_post_id ON retweets(post_id);
    `;

    await sql`
    CREATE INDEX IF NOT EXISTS idx_retweets_user_id ON retweets(user_id);
    `;
}
export async function down(sql: any) {
    await sql`
    DROP TABLE IF EXISTS retweets;
    `;
}