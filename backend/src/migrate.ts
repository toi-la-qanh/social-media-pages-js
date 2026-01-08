import postgres from "postgres";
import fs from "fs";
import path from "path";

const sql = postgres(process.env.DATABASE_URL as string);

const migrationsDir = path.join(__dirname, "database", "migrations");

async function runMigrations(direction: "up" | "down") {
  const folders = fs
    .readdirSync(migrationsDir)
    .sort(); // ensures order: 00001, 00002, etc.

  for (const folder of folders) {
    const folderPath = path.join(migrationsDir, folder);
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;

      const migration = await import(path.join(folderPath, file));
      await migration[direction](sql);

      console.log(`Migrated ${direction}: ${folder}/${file}`);
    }
  }
}

runMigrations("up")
  .then(() => console.log("All migrations up completed"))
  .catch((err) => {
    console.error("Migration up failed:", err);
    process.exit(1);
  });
