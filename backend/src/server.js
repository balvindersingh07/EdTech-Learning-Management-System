/**
 * Production / standalone API entry — listens on PORT (default 4000).
 * Prisma SQLite snapshot persists LMS state across restarts when migrations are applied.
 */
import { PrismaClient } from "@prisma/client";
import { AppConfig } from "./patterns/singleton/AppConfig.js";
import { createLmsApp, initLmsBackend } from "./createLmsApp.js";

async function main() {
  const config = AppConfig.getInstance();
  const prisma = new PrismaClient();

  await initLmsBackend(prisma);
  const app = createLmsApp();

  const server = app.listen(config.port, () => {
    console.log(`LMS API listening on http://localhost:${config.port}${config.apiPrefix} (Prisma snapshot on)`);
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
