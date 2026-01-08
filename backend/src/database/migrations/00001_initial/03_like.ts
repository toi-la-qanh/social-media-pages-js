export async function up(sql: any) {
    await sql`
    CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_post_user_like UNIQUE (post_id, user_id),
        CONSTRAINT fk_likes_posts FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        CONSTRAINT fk_likes_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`;

    await sql`
    CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
    `;

    await sql`
    CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
    `;
}

export async function down(sql: any) {
    await sql`
    DROP TABLE IF EXISTS likes;
    `;
}