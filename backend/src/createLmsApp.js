/**
 * Express application factory — used by `server.js` (listen) and Vite dev (in-process API).
 */
import express from "express";
import cors from "cors";
import { AppConfig } from "./patterns/singleton/AppConfig.js";
import { InMemoryStore } from "./infrastructure/InMemoryStore.js";
import { seedData } from "./infrastructure/seedData.js";
import { CourseRepository } from "./infrastructure/CourseRepository.js";
import { CachedCourseRepository } from "./patterns/decorator/CachedCourseRepository.js";
import { LegacyEmailAdapter } from "./patterns/adapter/LegacyEmailAdapter.js";
import { clearAssignmentSubmittedListeners, registerNotificationObserver } from "./patterns/observer/DomainEvents.js";
import { createAuthController } from "./interfaces/http/authController.js";
import { createAuthMiddleware } from "./interfaces/http/middleware/authMiddleware.js";
import { createStudentRouter } from "./interfaces/http/studentRoutes.js";
import { createInstructorRouter } from "./interfaces/http/instructorRoutes.js";
import { createAdminRouter } from "./interfaces/http/adminRoutes.js";
import { requestLogger } from "./interfaces/http/middleware/requestLogger.js";
import { applyAdminEnvOverrides } from "./infrastructure/bootstrapAdmin.js";

let singletonStore;
let initialized = false;

export function getLmsStore() {
  return singletonStore;
}

/**
 * Standalone API: load/save full LMS state via Prisma `AppStateSnapshot` after each `withWrite`.
 * @param {import("@prisma/client").PrismaClient} prisma
 */
export async function initLmsBackend(prisma) {
  if (initialized) return;
  try {
    const row = await prisma.appStateSnapshot.findUnique({ where: { id: 1 } });
    const json = row?.payload;
    singletonStore = json ? InMemoryStore.fromExportedState(JSON.parse(json)) : new InMemoryStore(seedData);
    const origWithWrite = singletonStore.withWrite.bind(singletonStore);
    singletonStore.withWrite = async (fn) => {
      const result = await origWithWrite(fn);
      const payload = JSON.stringify(singletonStore.exportState());
      await prisma.appStateSnapshot.upsert({
        where: { id: 1 },
        create: { id: 1, payload },
        update: { payload },
      });
      return result;
    };
  } catch (e) {
    console.warn("[LMS] Prisma snapshot unavailable, using in-memory seed:", e?.message ?? e);
    singletonStore = new InMemoryStore(seedData);
  }
  applyAdminEnvOverrides(singletonStore);
  registerNotificationObserver(singletonStore, new LegacyEmailAdapter());
  initialized = true;
}

function initLmsBackendSyncFromSeed() {
  if (initialized) return;
  singletonStore = new InMemoryStore(seedData);
  applyAdminEnvOverrides(singletonStore);
  registerNotificationObserver(singletonStore, new LegacyEmailAdapter());
  initialized = true;
}

/** Vitest / isolated runs */
export function resetLmsBackendForTests() {
  clearAssignmentSubmittedListeners();
  initialized = false;
  singletonStore = undefined;
}

export function createLmsApp() {
  if (!initialized) {
    initLmsBackendSyncFromSeed();
  }

  const config = AppConfig.getInstance();
  const store = singletonStore;
  const innerRepo = new CourseRepository(store);
  const courseRepo = new CachedCourseRepository(innerRepo, config.cacheTtlMs);

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(requestLogger());

  const authController = createAuthController(store);
  const bearerAuth = createAuthMiddleware();

  app.get("/health", (_req, res) => res.json({ ok: true }));

  /** Human-readable pointers (no Swagger bundle in this capstone). */
  app.get("/docs", (_req, res) => {
    const p = config.apiPrefix;
    const repo = "https://github.com/balvindersingh07/EdTech-Learning-Management-System/tree/main/docs/capstone";
    res.type("html").send(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>LMS API</title>
<style>body{font-family:system-ui,sans-serif;max-width:44rem;margin:2rem;line-height:1.5}</style></head><body>
<h1>EdTech LMS API</h1>
<p>This server does not serve OpenAPI at <code>/docs</code>. Capstone write-ups (phases, patterns) live in the repo: <a href="${repo}">docs/capstone</a>.</p>
<h2>Useful routes</h2>
<ul>
<li><code>GET /health</code> — liveness</li>
<li><code>GET ${p}/catalog/subjects</code> — public catalog</li>
<li><code>POST ${p}/auth/login</code> — JSON body <code>{ "email", "password" }</code></li>
<li><code>POST ${p}/auth/signup</code> — register (student/instructor; admin approval flow)</li>
<li>Role APIs under <code>${p}/student</code>, <code>${p}/instructor</code>, <code>${p}/admin</code> (JWT)</li>
</ul>
<p><strong>SPA / Vercel:</strong> set <code>VITE_API_URL</code> to this host + <code>/api</code> (axios adds <code>/v1/...</code>).</p>
</body></html>`);
  });

  app.get(`${config.apiPrefix}/catalog/subjects`, (_req, res) => {
    return res.json(store.listSubjects());
  });

  app.get(`${config.apiPrefix}/notifications`, bearerAuth, (_req, res) => {
    return res.json(store.notifications);
  });

  app.post(`${config.apiPrefix}/auth/login`, (req, res, next) => {
    authController.login(req, res).catch(next);
  });
  app.post(`${config.apiPrefix}/auth/signup`, (req, res, next) => {
    authController.signup(req, res).catch(next);
  });

  app.use(`${config.apiPrefix}/student`, createStudentRouter({ store, courseRepo }));
  app.use(`${config.apiPrefix}/instructor`, createInstructorRouter({ store }));
  app.use(`${config.apiPrefix}/admin`, createAdminRouter({ store }));

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: err?.message ?? "Internal error" });
  });

  return app;
}
