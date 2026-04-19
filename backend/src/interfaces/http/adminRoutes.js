import { Router } from "express";
import { createAuthMiddleware } from "./middleware/authMiddleware.js";
import { requireRole } from "./middleware/requireRole.js";
import { ReportExporter, HtmlExporter, JsonExporter } from "../../patterns/bridge/ReportExporter.js";

export function createAdminRouter(deps) {
  const { store } = deps;
  const r = Router();
  const auth = createAuthMiddleware();

  r.use(auth, requireRole("admin"));

  r.get("/users", (_req, res) => {
    return res.json(store.platformUsers);
  });

  r.get("/reports/summary", (req, res) => {
    const model = {
      title: "Platform summary",
      summary: `Courses: ${store.courses.size}, Users: ${store.users.size}, Assignments: ${store.assignments.size}`,
    };
    const impl = req.query.format === "json" ? new JsonExporter() : new HtmlExporter();
    const exporter = new ReportExporter(impl);
    const body = exporter.exportReport(model);
    if (impl instanceof JsonExporter) {
      res.type("application/json");
      return res.send(body);
    }
    res.type("html");
    return res.send(body);
  });

  r.get("/activity", (_req, res) => {
    return res.json(store.activityLog);
  });

  return r;
}
