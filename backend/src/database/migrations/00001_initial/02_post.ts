export async function up(sql: any) {
    await sql`
    CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        parent_id INT NULL REFERENCES posts(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        user_id INT NOT NULL,
        image_url TEXT DEFAULT NULL,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_content UNIQUE (content),
        CONSTRAINT fk_posts_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`;

    await sql`
    CREATE INDEX IF NOT EXISTS idx_posts_parent_id ON posts(parent_id);
  `;
}

export async function down(sql: any) {
    await sql`
      DROP TABLE IF EXISTS posts;
    `;
}