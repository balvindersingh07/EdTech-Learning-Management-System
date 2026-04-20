import http from "node:http";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createLmsApp, resetLmsBackendForTests } from "../src/createLmsApp.js";

/**
 * @param {import("express").Express} app
 * @param {string} method
 * @param {string} path
 * @param {object} [opts]
 */
function httpRequest(app, method, path, opts = {}) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const { port } = /** @type {import("node:net").AddressInfo} */ (server.address());
      const bodyStr = opts.body ? JSON.stringify(opts.body) : undefined;
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path,
          method,
          headers: {
            ...(opts.headers ?? {}),
            ...(bodyStr ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(bodyStr) } : {}),
          },
        },
        (res) => {
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => {
            const raw = Buffer.concat(chunks).toString("utf8");
            server.close(() => {
              let json;
              try {
                json = raw ? JSON.parse(raw) : null;
              } catch {
                json = raw;
              }
              resolve({ status: res.statusCode ?? 0, json, raw });
            });
          });
        },
      );
      req.on("error", (e) => {
        server.close(() => reject(e));
      });
      if (bodyStr) req.write(bodyStr);
      req.end();
    });
  });
}

describe("LMS API smoke", () => {
  beforeEach(() => {
    resetLmsBackendForTests();
  });

  afterEach(() => {
    resetLmsBackendForTests();
  });

  it("GET /health returns ok", async () => {
    const app = createLmsApp();
    const { status, json } = await httpRequest(app, "GET", "/health");
    expect(status).toBe(200);
    expect(json).toEqual({ ok: true });
  });

  it("GET /api/v1/catalog/subjects lists built-in lms-subj codes", async () => {
    const app = createLmsApp();
    const { status, json } = await httpRequest(app, "GET", "/api/v1/catalog/subjects");
    expect(status).toBe(200);
    expect(Array.isArray(json)).toBe(true);
    const codes = json.map((s) => s.code);
    expect(codes).toContain("lms-subj-engineering");
  });

  it("POST /api/v1/auth/login succeeds for bootstrap admin", async () => {
    const app = createLmsApp();
    const { status, json } = await httpRequest(app, "POST", "/api/v1/auth/login", {
      body: { email: "admin@lms.local", password: "Admin@123" },
    });
    expect(status).toBe(200);
    expect(json?.token).toBeTruthy();
    expect(json?.user?.role).toBe("admin");
  });

  it("GET /api/v1/admin/stats requires admin token", async () => {
    const app = createLmsApp();
    const login = await httpRequest(app, "POST", "/api/v1/auth/login", {
      body: { email: "admin@lms.local", password: "Admin@123" },
    });
    const token = login.json.token;
    const { status, json } = await httpRequest(app, "GET", "/api/v1/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(status).toBe(200);
    expect(json?.courses).toBeGreaterThanOrEqual(3);
    expect(json?.users).toBeGreaterThanOrEqual(1);
  });
});
