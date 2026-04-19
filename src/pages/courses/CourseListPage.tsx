import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Card } from "@/components/molecules/Card";
import { instructorPaths, studentPaths } from "@/lib/appPaths";
import { fetchCourseList, setFilters, type CourseListScope } from "@/store/slices/coursesSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Course } from "@/types";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

const categories = ["all", "Engineering", "Computer Science", "Product"];

function filterCourses(courses: Course[], filters: { category: string; q: string }) {
  let list = [...courses];
  if (filters.category !== "all") {
    list = list.filter((c) => c.category === filters.category);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.instructorName.toLowerCase().includes(q),
    );
  }
  return list;
}

export function CourseListPage() {
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.auth.user?.role);
  const { items, status, error, filters } = useAppSelector((s) => s.courses);

  const scope: CourseListScope | null =
    role === "student" ? "catalog" : role === "instructor" ? "teaching" : null;

  useEffect(() => {
    if (!scope) return;
    void dispatch(fetchCourseList({ scope }));
  }, [dispatch, scope]);

  const visible = useMemo(() => filterCourses(items, filters), [items, filters]);

  const heading = role === "student" ? "Course catalog" : "My courses";
  const sub =
    role === "student"
      ? "Browse published programs. Enrollment is handled in your student workspace only."
      : "Courses you own on the platform — separate from the public student catalog.";

  if (!role || !scope || (role !== "student" && role !== "instructor")) {
    return null;
  }

  const paths = role === "student" ? studentPaths() : instructorPaths();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{heading}</h1>
          <p className="text-[var(--muted)]">{sub}</p>
        </div>
        {role === "instructor" ? (
          <Link
            to={instructorPaths().courseNew}
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-700 px-4 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(34,197,94,0.45)] sm:self-start",
            )}
          >
            New course
          </Link>
        ) : null}
      </div>
      <Card padding="md" className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              variant={filters.category === c ? "primary" : "ghost"}
              size="sm"
              className="rounded-full"
              type="button"
              onClick={() => dispatch(setFilters({ category: c }))}
            >
              {c === "all" ? "All" : c}
            </Button>
          ))}
        </div>
        <div className="w-full max-w-md">
          <Input
            placeholder="Search title, instructor, or topic"
            value={filters.q}
            onChange={(e) => dispatch(setFilters({ q: e.target.value }))}
          />
        </div>
      </Card>
      {status === "loading" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-2xl" />
          ))}
        </div>
      ) : null}
      {status === "failed" ? (
        <Card title="Something went wrong" description={error ?? "Please retry."}>
          <Button className="mt-3" onClick={() => scope && void dispatch(fetchCourseList({ scope }))}>
            Retry
          </Button>
        </Card>
      ) : null}
      {status === "succeeded" && !visible.length ? (
        <Card title="No courses match" description="Try a different search or category." />
      ) : null}
      {status === "succeeded" && visible.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((course) => (
            <Link
              key={course.id}
              to={paths.course(course.id)}
              className="card-3d group overflow-hidden rounded-2xl border border-white/10 bg-[var(--card)]/80 p-0 shadow-[var(--shadow-3d)]"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={course.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex gap-2">
                  <Badge tone="info">{course.category}</Badge>
                  <Badge tone="neutral">{course.level}</Badge>
                </div>
              </div>
              <div className="space-y-2 p-4">
                <p className="text-lg font-semibold text-[var(--text)]">{course.title}</p>
                <p className="line-clamp-2 text-sm text-[var(--muted)]">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                  <span>{course.instructorName}</span>
                  <span>★ {course.rating.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
