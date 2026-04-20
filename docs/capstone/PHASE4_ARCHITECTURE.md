# Phase 4 — Advanced architecture blueprint

## Layered + hexagonal influences

1. **Interfaces (HTTP)** — Express routers (`studentRoutes`, `instructorRoutes`, `adminRoutes`) translate HTTP to application calls.
2. **Application** — orchestration lives beside patterns (grading context, builder usage).
3. **Domain** — `StudentProfile`, `InstructorProfile`, `AdminProfile`, workflow state objects.
4. **Infrastructure** — `InMemoryStore`, `CourseRepository`, JWT middleware.

## Caching (pseudo-middleware)

```
GET /instructor/courses/:id
  -> CachedCourseRepository#getById
       if cacheHit && age < TTL: return cached
       else: value = inner.getById(id); cache.put(id, value); return value

PUT /instructor/courses/:id
  -> store.withWrite(() => upsert(course))
  -> cache.invalidate(id)   // recommended extension; decorator exposes invalidate today
```

## Concurrency handling

JavaScript runs single-threaded per process, but overlapping `async` handlers can still interleave awaits. `InMemoryStore.withWrite` chains a promise lock so mutations serialize:

```js
await store.withWrite(async () => {
  store.upsertCourse(next);
});
```

For a future multi-node deployment, this lock would be replaced by a distributed lock (Redis) or optimistic concurrency control (ETags on resources).

## Load balancing (deployment note)

Stateless API nodes behind an L7 load balancer can serve traffic round-robin once JWT validation does not depend on in-memory sessions. The current demo uses in-memory data for simplicity; production would externalize state to PostgreSQL + Redis.
