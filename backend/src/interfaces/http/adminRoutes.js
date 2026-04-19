import { Router } from "express";
import { createAuthMiddleware } from "./middleware/authMiddleware.js";
import { requireRole } from "./middleware/requireRole.js";
import { ReportExporter, HtmlExporter, JsonExporter } from "../../patterns/bridge/ReportExporter.js";
import { RoleGuardedHandlerDecorator } from "../../patterns/decorator/RoleGuardedHandlerDecorator.js";

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

  const activityInner = (_req, res) => res.json(store.activityLog);
  const activityDecorated = new RoleGuardedHandlerDecorator(["admin"], activityInner, {
    onAccess: (evt) => {
      console.log(
        JSON.stringify({
          kind: "rbac_decorator",
          ...evt,
          t: new Date().toISOString(),
        }),
      );
    },
  });
  r.get("/activity", activityDecorated.asMiddleware());

  return r;
}
