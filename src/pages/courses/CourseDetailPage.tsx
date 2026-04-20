import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/molecules/Card";
import { instructorPaths, studentPaths } from "@/lib/appPaths";
import { studentCourseService } from "@/services/student/studentCourseService";
import { clearSelected, fetchCourseById, type CourseListScope } from "@/store/slices/coursesSlice";
import { addToCart } from "@/store/slices/enrollmentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { cn } from "@/lib/cn";

export function CourseDetailPage() {
  const { courseId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const course = useAppSelector((s) => s.courses.selected);
  const status = useAppSelector((s) => s.courses.status);
  const error = useAppSelector((s) => s.courses.error);
  const role = useAppSelector((s) => s.auth.user?.role);
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const scope: CourseListScope | undefined =
    role === "instructor" ? "teaching" : role === "student" ? "catalog" : undefined;

  useEffect(() => {
    if (!courseId || !scope) return;
    void dispatch(fetchCourseById({ id: courseId, scope }));
    return () => {
      dispatch(clearSelected());
    };
  }, [courseId, dispatch, scope]);

  if (!role || !scope || (role !== "student" && role !== "instructor")) return null;

  const listHref = role === "student" ? studentPaths().courses : instructorPaths().courses;

  if (status === "loading" || !course) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-10 w-1/3 rounded-2xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <Card title="Unable to load course" description={error ?? "Not found"}>
        <Button className="mt-3" onClick={() => navigate(listHref)}>
          Back to list
        </Button>
      </Card>
    );
  }

  const toggle = (id: string) => setOpenModule((prev) => (prev === id ? null : id));

  return (
    <div className="space-y-6">
      <div className="card-3d overflow-hidden rounded-2xl border border-white/10 bg-[var(--card)]/90 shadow-[var(--shadow-3d)]">
        <div className="relative h-64 w-full">
          <img src={course.thumbnailUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
            <div className="flex flex-wrap gap-2">
              {course.subjectName ? <Badge tone="warning">{course.subjectName}</Badge> : null}
              {course.isBuiltIn ? <Badge tone="neutral">Built-in catalog</Badge> : null}
              <Badge tone="info">{course.category}</Badge>
              <Badge tone="neutral">{course.level}</Badge>
              <Badge tone="success">★ {course.rating.toFixed(1)}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-sm text-white/90">
              Instructor · <span className="font-semibold">{course.instructorName}</span>
            </p>
          </div>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text)]">About this course</h2>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{course.description}</p>
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-[var(--text)]">Curriculum</h3>
              <div className="divide-y divide-white/10 rounded-2xl border border-white/10">
                {course.modules.map((mod) => {
                  const open = openModule === mod.id;
                  return (
                    <div key={mod.id} className="bg-transparent">
                      <button
                        type="button"
                        onClick={() => toggle(mod.id)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[var(--text)]"
                      >
                        <span>{mod.title}</span>
                        <span className="text-[var(--muted)]">{open ? "−" : "+"}</span>
                      </button>
                      {open ? (
                        <div className="space-y-2 border-t border-white/10 px-4 py-3">
                          {mod.lectures.map((lec) => (
                            <div
                              key={lec.id}
                              className="space-y-2 rounded-xl bg-white/5 px-3 py-3 text-sm"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <p className="font-medium text-[var(--text)]">{lec.title}</p>
                                  <p className="text-xs text-[var(--muted)]">
                                    {lec.type} · {lec.durationMin} min
                                  </p>
                                </div>
                              </div>
                              {lec.type === "video" && lec.contentUrl ? (
                                <video
                                  controls
                                  className="w-full max-w-xl rounded-xl border border-white/10 bg-black/50"
                                  preload="metadata"
                                  src={lec.contentUrl}
                                />
                              ) : lec.type === "video" ? (
                                <p className="text-xs text-[var(--muted)]">
                                  No stream URL on this lecture (add <code>contentUrl</code> in course data).
                                </p>
                              ) : lec.type === "reading" ? (
                                <p className="text-xs text-[var(--muted)]">
                                  Reading — attach PDF/links in a full content pipeline.
                                </p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Card title="Actions" description="Role-specific tools stay separated." padding="md">
            <p className="text-sm text-[var(--muted)]">
              {course.enrolledCount.toLocaleString()} learners enrolled
            </p>
            {role === "student" ? (
              <Button
                className="mt-4 w-full"
                loading={enrolling}
                onClick={async () => {
                  setEnrolling(true);
                  try {
                    await studentCourseService.enroll(course.id);
                    dispatch(addToCart(course));
                    toast.success("Enrolled successfully");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Enrollment failed");
                  } finally {
                    setEnrolling(false);
                  }
                }}
              >
                Enroll in course
              </Button>
            ) : null}
            {role === "instructor" ? (
              <Link
                to={instructorPaths().courseEdit(course.id)}
                className={cn(
                  "mt-4 flex h-11 w-full items-center justify-center rounded-2xl text-sm font-semibold text-[var(--text)] ring-1 ring-white/15 hover:bg-white/10",
                )}
              >
                Edit course
              </Link>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
