import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Card } from "@/components/molecules/Card";
import { instructorPaths } from "@/lib/appPaths";
import { instructorAssignmentService } from "@/services/instructor/instructorAssignmentService";
import type { Assignment } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export function GradingPage() {
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("studentId");
  const navigate = useNavigate();
  const p = instructorPaths();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<{
    studentName: string;
    fileName: string;
    studentId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ score?: string }>({});

  useEffect(() => {
    if (!assignmentId || !studentId) {
      setLoading(false);
      return;
    }
    let mounted = true;
    instructorAssignmentService
      .getSubmission(assignmentId, studentId)
      .then((bundle) => {
        if (!mounted) return;
        setAssignment(bundle.assignment);
        setSubmission({
          studentId: bundle.submission.studentId,
          studentName: bundle.submission.studentName,
          fileName: bundle.submission.fileName,
        });
        setScore(bundle.submission.score?.toString() ?? "");
        setFeedback(bundle.submission.feedback ?? "");
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [assignmentId, studentId]);

  if (!studentId) {
    return (
      <Card title="Select a learner" description="Open the grading queue and pick a submission.">
        <Button className="mt-3" onClick={() => navigate(p.assignments)}>
          Back to queue
        </Button>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-10 w-1/2 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    );
  }

  if (!assignment || !submission) {
    return (
      <Card title="Submission not found">
        <Button className="mt-3" onClick={() => navigate(p.assignments)}>
          Back to queue
        </Button>
      </Card>
    );
  }

  const validate = () => {
    const next: { score?: string } = {};
    const parsed = Number(score);
    if (Number.isNaN(parsed)) next.score = "Enter a valid number";
    else if (parsed < 0 || parsed > assignment.maxScore) {
      next.score = `Score must be between 0 and ${assignment.maxScore}`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await instructorAssignmentService.grade(assignment.id, submission.studentId, {
        score: Number(score),
        feedback: feedback.trim() || undefined,
        strategy: "numeric",
      });
      toast.success("Grade saved");
      navigate(p.assignments);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to save grade");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Grading workspace</h1>
        <p className="text-[var(--muted)]">{assignment.title}</p>
      </div>
      <Card
        title="Submission"
        description={`${submission.studentName} · ${submission.fileName}`}
      >
        <form className="mt-4 space-y-4" onSubmit={onSave}>
          <Input
            label={`Score (out of ${assignment.maxScore})`}
            name="score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            error={errors.score}
            type="number"
          />
          <Textarea label="Feedback (optional)" name="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Publish grade
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
