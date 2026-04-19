import jwt from "jsonwebtoken";
import { AppConfig } from "../../../patterns/singleton/AppConfig.js";

export function createAuthMiddleware() {
  const secret = AppConfig.getInstance().jwtSecret;

  return function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }
    const token = header.slice("Bearer ".length);
    try {
      req.user = jwt.verify(token, secret);
      return next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

export function createOptionalAuthMiddleware() {
  const secret = AppConfig.getInstance().jwtSecret;
  return function optionalAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return next();
    const token = header.slice("Bearer ".length);
    try {
      req.user = jwt.verify(token, secret);
    } catch {
      req.user = undefined;
    }
    next();
  };
}
