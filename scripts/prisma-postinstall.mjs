/**
 * Prisma generate needs DATABASE_URL in schema; Azure/Oryx may not set it before postinstall.
 * Default to local dev SQLite; production must set DATABASE_URL in App Service configuration.
 */
import { spawnSync } from "node:child_process";

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = "file:./prisma/dev.db";
}

const result = spawnSync("npx", ["prisma", "generate"], {
  env,
  stdio: "inherit",
  shell: true,
});

process.exit(typeof result.status === "number" && result.status === 0 ? 0 : 1);
