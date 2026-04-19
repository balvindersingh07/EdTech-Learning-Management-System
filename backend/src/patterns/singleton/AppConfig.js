/**
 * Singleton: single application configuration instance (ports, TTL, feature flags).
 * Problem solved: avoid scattered magic strings and duplicate config reads.
 */
let instance;

export class AppConfig {
  constructor() {
    this.port = Number(process.env.PORT) || 4000;
    this.cacheTtlMs = Number(process.env.CACHE_TTL_MS) || 30_000;
    this.jwtSecret = process.env.JWT_SECRET || "dev-capstone-secret-change-me";
    this.apiPrefix = "/api/v1";
  }

  static getInstance() {
    if (!instance) {
      instance = new AppConfig();
    }
    return instance;
  }
}
