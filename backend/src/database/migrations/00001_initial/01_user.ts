export async function up(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(50) DEFAULT NULL,
      email VARCHAR(254) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      reset_password_token VARCHAR(255) DEFAULT NULL,
      reset_password_expires TIMESTAMP DEFAULT NULL,
      image_url TEXT DEFAULT 'https://picsum.photos/100/100',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  `;
}

export async function down(sql: any) {
  await sql`
      DROP TABLE IF EXISTS users;
    `;
}