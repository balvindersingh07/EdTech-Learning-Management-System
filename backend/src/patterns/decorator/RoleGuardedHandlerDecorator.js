/**
 * Decorator (structural): wraps a route handler with explicit role checks and optional hooks
 * (audit / metrics). Same responsibility shape as `requireRole` middleware, but object-oriented:
 * inner handler stays pure; this class adds RBAC + cross-cutting behavior without modifying
 * the inner function’s source (Open/Closed).
 *
 * Use with Express: `new RoleGuardedHandlerDecorator(...).asMiddleware()`.
 * Router-level `requireRole` may still apply; this decorator documents the pattern for
 * operation-level policies or when the inner delegate is reused outside Express.
 */
export class RoleGuardedHandlerDecorator {
  /**
   * @param {string[]} allowedRoles
   * @param {(req: import('express').Request, res: import('express').Response) => void | Promise<void>} innerHandler
   * @param {{ onAccess?: (evt: { allowed: boolean; role?: string; path: string }) => void }} [hooks]
   */
  constructor(allowedRoles, innerHandler, hooks = {}) {
    this._allowed = new Set(allowedRoles);
    this._inner = innerHandler;
    this._onAccess = hooks.onAccess ?? (() => {});
  }

  async handle(req, res, next) {
    try {
      const role = req.user?.role;
      const path = req.path ?? req.url ?? "";
      if (!role || !this._allowed.has(role)) {
        this._onAccess({ allowed: false, role, path });
        res.status(403).json({ message: "Forbidden for this role" });
        return;
      }
      this._onAccess({ allowed: true, role, path });
      await this._inner(req, res, next);
    } catch (e) {
      next(e);
    }
  }

  /** @returns {import('express').RequestHandler} */
  asMiddleware() {
    return (req, res, next) => {
      Promise.resolve(this.handle(req, res, next)).catch(next);
    };
  }
}
