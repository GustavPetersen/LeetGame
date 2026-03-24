import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { fetchLevel, type Level } from "../api/levels";
import { createSubmission, type Submission } from "../api/submissions";

export default function LevelDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [level, setLevel] = useState<Level | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submissionResult, setSubmissionResult] = useState<Submission | null>(null);

  useEffect(() => {
    async function loadLevel() {
      if (!slug) {
        setError("Missing level slug");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchLevel(slug);
        setLevel(data);
        setCode(data.starter_code_python || "");
      } catch {
        setError("Could not load level");
      } finally {
        setLoading(false);
      }
    }

    loadLevel();
  }, [slug]);

  async function handleSubmit() {
    if (!level) return;

    setSubmitting(true);
    setError("");
    setSubmissionResult(null);

    try {
      const result = await createSubmission({
        user: 1,
        level: level.id,
        language: "python",
        code: code,
      });

      setSubmissionResult(result);
    } catch {
      setError("Failed to submit solution");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading level...</p>;
  if (error && !level) return <p>{error}</p>;
  if (!level) return <p>Level not found.</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <Link to="/">← Back to levels</Link>

      <h1>{level.title}</h1>
      <p><strong>Difficulty:</strong> {level.difficulty}</p>
      <p><strong>Function:</strong> {level.function_name}</p>

      <h2>Description</h2>
      <p>{level.description}</p>

      <h2>Code Editor</h2>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
        <Editor
          height="400px"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button type="button">Run</button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ marginLeft: "0.5rem" }}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {error && <p style={{ marginTop: "1rem", color: "red" }}>{error}</p>}

      {submissionResult && (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
            <h3>Submission Result</h3>
            <p><strong>Submission ID:</strong> {submissionResult.id}</p>
            <p><strong>Verdict:</strong> {submissionResult.verdict}</p>

            {submissionResult.verdict === "accepted" && (
            <p>Level completed.</p>
            )}

            {submissionResult.unlocked_next_level && (
            <p>Unlocked next level: {submissionResult.unlocked_next_level}</p>
            )}
        </div>
        )}
    </main>
  );
}