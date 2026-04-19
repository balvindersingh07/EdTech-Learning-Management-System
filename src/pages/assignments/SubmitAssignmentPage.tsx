import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/molecules/Card";
import { studentPaths } from "@/lib/appPaths";
import { studentAssignmentService } from "@/services/student/studentAssignmentService";
import type { Assignment } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export function SubmitAssignmentPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const p = studentPaths();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) return;
    let mounted = true;
    studentAssignmentService
      .list()
      .then((list) => {
        if (!mounted) return;
        setAssignment(list.find((a) => a.id === assignmentId) ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setAssignment(null);
      });
    return () => {
      mounted = false;
    };
  }, [assignmentId]);

  if (!assignment) {
    return (
      <Card title="Assignment not found">
        <Button className="mt-3" onClick={() => navigate(p.assignments)}>
          Back
        </Button>
      </Card>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please attach a file");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      await studentAssignmentService.submit(assignment.id, file.name);
      toast.success("Submission received");
      navigate(p.assignments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Submit assignment</h1>
        <p className="text-[var(--muted)]">{assignment.title}</p>
      </div>
      <Card>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center">
            <input type="file" className="hidden" id="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <label htmlFor="file" className="cursor-pointer text-sm font-semibold text-[var(--link)] hover:underline">
              Choose file
            </label>
            <p className="mt-2 text-xs text-[var(--muted)]">{file ? file.name : "PDF, ZIP, or DOCX up to 25MB"}</p>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" loading={uploading}>
              Upload submission
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
