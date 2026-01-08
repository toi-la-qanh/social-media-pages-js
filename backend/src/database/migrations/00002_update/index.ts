export async function up(sql: any) {
  await sql`
    ALTER TABLE users
    ADD COLUMN bio TEXT DEFAULT NULL;
  `;
}

export async function down(sql: any) {
  await sql`
    ALTER TABLE users
    DROP COLUMN bio;
  `;
}
