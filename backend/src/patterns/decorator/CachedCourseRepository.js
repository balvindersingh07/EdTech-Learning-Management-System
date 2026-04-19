/**
 * Decorator: transparently adds caching to a repository without modifying its code (OCP).
 */
export class CachedCourseRepository {
  constructor(inner, ttlMs) {
    this._inner = inner;
    this._ttlMs = ttlMs;
    this._cache = new Map();
  }

  async getById(id) {
    const hit = this._cache.get(id);
    const now = Date.now();
    if (hit && now - hit.at < this._ttlMs) {
      return hit.value;
    }
    const value = await this._inner.getById(id);
    this._cache.set(id, { at: now, value });
    return value;
  }

  invalidate(id) {
    this._cache.delete(id);
  }
}
