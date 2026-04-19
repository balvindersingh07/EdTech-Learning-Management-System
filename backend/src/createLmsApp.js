/**
 * Express application factory — used by `server.js` (listen) and Vite dev (in-process API).
 */
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { AppConfig } from "./patterns/singleton/AppConfig.js";
import { InMemoryStore } from "./infrastructure/InMemoryStore.js";
import { seedData } from "./infrastructure/seedData.js";
import { CourseRepository } from "./infrastructure/CourseRepository.js";
import { CachedCourseRepository } from "./patterns/decorator/CachedCourseRepository.js";
import { LegacyEmailAdapter } from "./patterns/adapter/LegacyEmailAdapter.js";
import { registerNotificationObserver } from "./patterns/observer/DomainEvents.js";
import { UserFactory } from "./patterns/factory/UserFactory.js";
import { createAuthController } from "./interfaces/http/authController.js";
import { createStudentRouter } from "./interfaces/http/studentRoutes.js";
import { createInstructorRouter } from "./interfaces/http/instructorRoutes.js";
import { createAdminRouter } from "./interfaces/http/adminRoutes.js";

let singletonStore;

export function getLmsStore() {
  return singletonStore;
}

export function createLmsApp() {
  const config = AppConfig.getInstance();

  if (!singletonStore) {
    singletonStore = new InMemoryStore(seedData);
    const legacyAdapter = new LegacyEmailAdapter();
    registerNotificationObserver(singletonStore, legacyAdapter);
  }

  const store = singletonStore;
  const innerRepo = new CourseRepository(store);
  const courseRepo = new CachedCourseRepository(innerRepo, config.cacheTtlMs);

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  const authController = createAuthController(store);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.post(`${config.apiPrefix}/auth/login`, (req, res, next) => {
    authController.login(req, res).catch(next);
  });
  app.post(`${config.apiPrefix}/auth/signup`, (req, res, next) => {
    authController.signup(req, res).catch(next);
  });

  /**
   * Azure AD / Microsoft Entra ID — demo using ID token claims only.
   * Production: validate `idToken` signature + issuer + audience via Microsoft JWKS.
   */
  app.post(`${config.apiPrefix}/auth/azure`, (req, res, next) => {
    (async () => {
      const { idToken } = req.body ?? {};
      if (!idToken || typeof idToken !== "string") {
        return res.status(400).json({ message: "idToken required" });
      }
      const decoded = jwt.decode(idToken);
      if (!decoded || typeof decoded !== "object") {
        return res.status(400).json({ message: "Invalid token" });
      }
      const email =
        decoded.preferred_username ||
        decoded.email ||
        decoded.upn ||
        decoded.unique_name;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Token missing email claim" });
      }
      const record = store.getUserByEmail(String(email).trim());
      if (!record) {
        return res.status(404).json({
          message:
            "No LMS user matches this Microsoft account. Create an account with the same email or ask an admin.",
        });
      }
      const { password: _p, ...safe } = record;
      const profile = UserFactory.fromRecord(safe);
      const dto = profile.toPublicDTO();
      const token = jwt.sign({ sub: dto.id, role: dto.role, email: dto.email }, config.jwtSecret, {
        expiresIn: "7d",
      });
      return res.json({ user: dto, token });
    })().catch(next);
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
