import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Card } from "@/components/molecules/Card";
import { instructorPaths } from "@/lib/appPaths";
import { catalogService } from "@/services/catalogService";
import { instructorSubjectService } from "@/services/instructor/instructorSubjectService";
import { saveCourse, fetchCourseById, clearSelected } from "@/store/slices/coursesSlice";
import type { Course, SubjectOption } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface FieldErrors {
  title?: string;
  description?: string;
  subject?: string;
}

export function CourseFormPage({ mode }: { mode: "create" | "edit" }) {
  const { courseId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const existing = useAppSelector((s) => s.courses.selected);
  const user = useAppSelector((s) => s.auth.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [level, setLevel] = useState<Course["level"]>("Beginner");
  const [subjectCode, setSubjectCode] = useState("lms-subj-general");
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [addingSubject, setAddingSubject] = useState(false);

  const paths = user?.role === "instructor" ? instructorPaths() : null;

  useEffect(() => {
    catalogService
      .listSubjects()
      .then(setSubjects)
      .catch(() => toast.error("Could not load subjects"));
  }, []);

  useEffect(() => {
    if (mode === "edit" && courseId) {
      void dispatch(fetchCourseById({ id: courseId, scope: "teaching" }));
    }
    return () => {
      dispatch(clearSelected());
    };
  }, [courseId, dispatch, mode]);

  useEffect(() => {
    if (mode === "edit" && existing) {
      setTitle(existing.title);
      setDescription(existing.description);
      setCategory(existing.category);
      setLevel(existing.level);
      if (existing.subject) setSubjectCode(existing.subject);
      else if (existing.category === "Computer Science") setSubjectCode("lms-subj-computer-science");
      else if (existing.category === "Product") setSubjectCode("lms-subj-product");
      else if (existing.category === "Engineering") setSubjectCode("lms-subj-engineering");
    }
  }, [existing, mode]);

  const validate = () => {
    const next: FieldErrors = {};
    if (!title.trim()) next.title = "Title is required";
    if (!description.trim()) next.description = "Description is required";
    if (!subjectCode) next.subject = "Pick a subject";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const addCustomSubject = async () => {
    const name = newSubjectName.trim();
    if (!name) {
      toast.error("Enter a subject name");
      return;
    }
    setAddingSubject(true);
    try {
      const created = await instructorSubjectService.create(name);
      setSubjects((prev) => [...prev, created]);
      setSubjectCode(created.code);
      setNewSubjectName("");
      toast.success("Subject added");
    } catch {
      toast.error("Could not add subject");
    } finally {
      setAddingSubject(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const payload: Partial<Course> = {
      title,
      description,
      category,
      level,
      subject: subjectCode,
      instructorId: user?.id,
      instructorName: user?.name,
    };
    try {
      const saved = await dispatch(
        saveCourse({ id: mode === "edit" ? courseId : undefined, data: payload }),
      ).unwrap();
      toast.success(mode === "create" ? "Course created" : "Course updated");
      if (paths) navigate(paths.course(saved.id));
    } catch {
      toast.error("Unable to save course");
    } finally {
      setSubmitting(false);
    }
  };

  if (!paths) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">
          {mode === "create" ? "Create a course" : "Edit course"}
        </h1>
        <p className="text-[var(--muted)]">
          Pick a subject (built-in <code className="text-[var(--text)]">lms-subj-*</code> codes) or add your own. New
          courses get <code className="text-[var(--text)]">lms-course-*</code> ids from the API.
        </p>
      </div>
      <Card>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <Input label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
          <Textarea
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
          />
          <label className="space-y-1 text-sm font-medium text-[var(--text)]">
            Subject
            <select
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text)]"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
            >
              {subjects.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                  {s.builtIn ? " (built-in)" : ""}
                </option>
              ))}
            </select>
            {errors.subject ? <p className="text-xs text-red-400">{errors.subject}</p> : null}
          </label>
          <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-dashed border-white/15 bg-white/5 p-3">
            <div className="min-w-[12rem] flex-1">
              <Input
                label="New subject name"
                placeholder="e.g. UX Research"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            <Button type="button" variant="secondary" loading={addingSubject} onClick={() => void addCustomSubject()}>
              Add subject
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-[var(--text)]">
              Category (display)
              <select
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text)]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {["Engineering", "Computer Science", "Product", "General"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm font-medium text-[var(--text)]">
              Level
              <select
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text)]"
                value={level}
                onChange={(e) => setLevel(e.target.value as Course["level"])}
              >
                {(["Beginner", "Intermediate", "Advanced"] as const).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save course
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
