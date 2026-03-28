import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Navbar from "../components/Navbar";
import { fetchLevel, type Level } from "../api/levels";
import { fetchMyProgress, type PlayerProgress } from "../api/progression";
import {
  createSubmission,
  runCode,
  type Submission,
  type RunCodeResult,
} from "../api/submissions";

export default function LevelDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [level, setLevel] = useState<Level | null>(null);
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [runResult, setRunResult] = useState<RunCodeResult | null>(null);
  const [submissionResult, setSubmissionResult] = useState<Submission | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!slug) {
        setError("Missing level slug");
        setLoading(false);
        return;
      }

      try {
        const [levelData, progressData] = await Promise.all([
          fetchLevel(slug),
          fetchMyProgress(),
        ]);

        setLevel(levelData);
        setProgress(progressData);
        setCode(levelData.starter_code_python || "");
      } catch {
        setError("Could not load level");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  async function handleRun() {
    if (!level) return;

    setRunning(true);
    setError("");
    setRunResult(null);

    try {
      const result = await runCode({
        level: level.id,
        language: "python",
        code,
      });

      setRunResult(result);
    } catch {
      setError("Failed to run code");
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    if (!level) return;

    setSubmitting(true);
    setError("");
    setSubmissionResult(null);

    try {
      const result = await createSubmission({
        level: level.id,
        language: "python",
        code,
      });

      setSubmissionResult(result);

      const updatedProgress = await fetchMyProgress();
      setProgress(updatedProgress);
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
    <>
      <Navbar progress={progress} />

      <main style={{ padding: "0 2rem 2rem" }}>
        <Link to="/">← Back to levels</Link>

        <h1>{level.title}</h1>
        <p><strong>Difficulty:</strong> {level.difficulty}</p>
        <p><strong>Function:</strong> {level.function_name}</p>

        <h2>Description</h2>
        <p>{level.description}</p>

        <h2>Sample Test Cases</h2>
        {level.sample_test_cases && level.sample_test_cases.length > 0 ? (
          <div>
            {level.sample_test_cases.map((testCase) => (
              <div
                key={testCase.id}
                style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}
              >
                <p><strong>Test {testCase.order}</strong></p>
                <p><strong>Input:</strong> {JSON.stringify(testCase.input_data)}</p>
                <p><strong>Expected Output:</strong> {JSON.stringify(testCase.expected_output)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No sample test cases available.</p>
        )}

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
          <button type="button" onClick={handleRun} disabled={running}>
            {running ? "Running..." : "Run"}
          </button>

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

        {runResult && (
          <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
            <h3>Run Result</h3>
            <p><strong>Verdict:</strong> {runResult.verdict}</p>
            <p><strong>Sample tests:</strong> {runResult.total_sample_tests}</p>
          </div>
        )}

        {submissionResult && (
          <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
            <h3>Submission Result</h3>
            <p><strong>Verdict:</strong> {submissionResult.verdict}</p>

            {submissionResult.unlocked_next_level && (
              <p>Unlocked next level: {submissionResult.unlocked_next_level}</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}