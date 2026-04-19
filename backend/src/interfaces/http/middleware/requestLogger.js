/**
 * Lightweight request observability: one JSON line per finished response.
 * Pairs with Phase 6 “structured logs” — swap `console.log` for Winston/Pino or OTLP later.
 */
export function requestLogger() {
  return (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const line = {
        t: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl ?? req.url,
        role: req.user?.role ?? null,
        status: res.statusCode,
        ms: Date.now() - start,
      };
      console.log(JSON.stringify(line));
    });
    next();
  };
}
