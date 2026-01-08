export async function up(sql: any) {
    await sql`
    CREATE TABLE IF NOT EXISTS follows (
        id SERIAL PRIMARY KEY,
        follower_id INT NOT NULL,
        following_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_follower_following UNIQUE (follower_id, following_id),
        CONSTRAINT fk_follows_follower_users FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_follows_following_users FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
    );`;

    await sql`
    CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
    `;

    await sql`
    CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
    `;
}

export async function down(sql: any) {
    await sql`
    DROP TABLE IF EXISTS follows;
    `;
}