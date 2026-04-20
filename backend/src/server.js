/**
 * Production / standalone API entry — listens on PORT (default 4000).
 * Prisma SQLite snapshot persists LMS state across restarts when migrations are applied.
 */
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { AppConfig } from "./patterns/singleton/AppConfig.js";
import { createLmsApp, initLmsBackend } from "./createLmsApp.js";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

/** Best-effort migrate so Azure never fails startup if migrate exits 1 (cwd/env). */
function tryMigrateDeploy() {
  try {
    execSync("npx prisma migrate deploy", {
      cwd: repoRoot,
      stdio: "inherit",
      env: process.env,
      shell: true,
    });
  } catch (e) {
    console.warn("[LMS] prisma migrate deploy failed (API will still start; Prisma may fall back to seed):", e?.message ?? e);
  }
}

async function main() {
  tryMigrateDeploy();

  const config = AppConfig.getInstance();
  const prisma = new PrismaClient();

  await initLmsBackend(prisma);
  const app = createLmsApp();

  const server = app.listen(config.port, "0.0.0.0", () => {
    console.log(`LMS API listening on 0.0.0.0:${config.port}${config.apiPrefix} (Prisma snapshot on)`);
  });

  const shutdown = async () => {
    await new Promise((resolve) => server.close(resolve));
    await prisma.$disconnect();
  };

  process.on("SIGINT", () => void shutdown().then(() => process.exit(0)));
  process.on("SIGTERM", () => void shutdown().then(() => process.exit(0)));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
