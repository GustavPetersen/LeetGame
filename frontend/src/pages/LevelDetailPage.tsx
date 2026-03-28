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
        <div style={{ marginBottom: "1rem" }}>
          <Link to="/">← Back to levels</Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          <section
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "1.25rem",
              background: "#fff",
            }}
          >
            <h1 style={{ marginTop: 0 }}>{level.title}</h1>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <span>
                <strong>Difficulty:</strong> {level.difficulty}
              </span>
              <span>
                <strong>Function:</strong> {level.function_name}
              </span>
            </div>

            <h2>Description</h2>
            <p style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{level.description}</p>

            <h2>Sample Test Cases</h2>
            {level.sample_test_cases && level.sample_test_cases.length > 0 ? (
              <div>
                {level.sample_test_cases.map((testCase) => (
                  <div
                    key={testCase.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "1rem",
                      marginBottom: "1rem",
                      background: "#f8f8f8",
                    }}
                  >
                    <p style={{ marginTop: 0 }}>
                      <strong>Test {testCase.order}</strong>
                    </p>
                    <p>
                      <strong>Input:</strong>
                    </p>
                    <pre
                      style={{
                        background: "#eee",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        overflowX: "auto",
                      }}
                    >
                      {JSON.stringify(testCase.input_data, null, 2)}
                    </pre>

                    <p>
                      <strong>Expected Output:</strong>
                    </p>
                    <pre
                      style={{
                        background: "#eee",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        overflowX: "auto",
                      }}
                    >
                      {JSON.stringify(testCase.expected_output, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <p>No sample test cases available.</p>
            )}
          </section>

          <section
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "1.25rem",
              background: "#fff",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Code Editor</h2>

            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Editor
                height="500px"
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

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
              <button type="button" onClick={handleRun} disabled={running}>
                {running ? "Running..." : "Run"}
              </button>

              <button type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            {error && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  border: "1px solid #f5c2c7",
                  borderRadius: "10px",
                  background: "#f8d7da",
                  color: "#842029",
                }}
              >
                {error}
              </div>
            )}

            {runResult && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Run Result</h3>
                <p>
                  <strong>Verdict:</strong> {runResult.verdict}
                </p>
                <p>
                  <strong>Sample tests:</strong> {runResult.total_sample_tests}
                </p>

                {runResult.verdict === "accepted" && (
                  <p>All visible sample tests passed.</p>
                )}

                {runResult.judge_result?.failed_test_case && (
                  <p>
                    <strong>Failed test case:</strong>{" "}
                    {runResult.judge_result.failed_test_case}
                  </p>
                )}

                {runResult.judge_result?.expected !== undefined && (
                  <>
                    <p>
                      <strong>Expected:</strong>
                    </p>
                    <pre
                      style={{
                        background: "#f4f4f4",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        overflowX: "auto",
                      }}
                    >
                      {JSON.stringify(runResult.judge_result.expected, null, 2)}
                    </pre>
                  </>
                )}

                {runResult.judge_result?.got !== undefined && (
                  <>
                    <p>
                      <strong>Got:</strong>
                    </p>
                    <pre
                      style={{
                        background: "#f4f4f4",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        overflowX: "auto",
                      }}
                    >
                      {JSON.stringify(runResult.judge_result.got, null, 2)}
                    </pre>
                  </>
                )}

                {runResult.judge_result?.error && (
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "red",
                      background: "#f4f4f4",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      overflowX: "auto",
                    }}
                  >
                    {runResult.judge_result.error}
                  </pre>
                )}
              </div>
            )}

            {submissionResult && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Submission Result</h3>
                <p>
                  <strong>Verdict:</strong> {submissionResult.verdict}
                </p>

                {submissionResult.unlocked_next_level && (
                  <p>Unlocked next level: {submissionResult.unlocked_next_level}</p>
                )}

                {submissionResult.judge_result?.failed_test_case && (
                  <p>
                    <strong>Failed test case:</strong>{" "}
                    {submissionResult.judge_result.failed_test_case}
                  </p>
                )}

                {submissionResult.judge_result?.expected !== undefined && (
                  <>
                    <p>
                      <strong>Expected:</strong>
                    </p>
                    <pre
                      style={{
                        background: "#f4f4f4",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        overflowX: "auto",
                      }}
                    >
                      {JSON.stringify(submissionResult.judge_result.expected, null, 2)}
                    </pre>
                  </>
                )}

                {submissionResult.judge_result?.got !== undefined && (
                  <>
                    <p>
                      <strong>Got:</strong>
                    </p>
                    <pre
                      style={{
                        background: "#f4f4f4",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        overflowX: "auto",
                      }}
                    >
                      {JSON.stringify(submissionResult.judge_result.got, null, 2)}
                    </pre>
                  </>
                )}

                {submissionResult.judge_result?.error && (
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "red",
                      background: "#f4f4f4",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      overflowX: "auto",
                    }}
                  >
                    {submissionResult.judge_result.error}
                  </pre>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}