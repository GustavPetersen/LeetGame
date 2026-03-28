import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Navbar from "../components/Navbar";
import { fetchLevel, type Level } from "../api/levels";
import { fetchMyProgress, type PlayerProgress } from "../api/progression";
import {
  createSubmission,
  fetchSubmissionsByLevel,
  runCode,
  type Submission,
  type RunCodeResult,
} from "../api/submissions";

import {
  saveCodeDraft,
  loadCodeDraft,
  clearCodeDraft,
} from "../lib/codeDrafts";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StatusPanel from "../components/ui/StatusPanel";
import Badge from "../components/ui/Badge";

export default function LevelDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [level, setLevel] = useState<Level | null>(null);
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState<Submission[]>([]);
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
        const levelData = await fetchLevel(slug);
        const [progressData, submissionHistoryData] = await Promise.all([
          fetchMyProgress(),
          fetchSubmissionsByLevel(levelData.id),
        ]);

        setLevel(levelData);
        setProgress(progressData);
        setSubmissionHistory(submissionHistoryData);

        const savedDraft = loadCodeDraft(levelData.slug);
        setCode(savedDraft ?? levelData.starter_code_python ?? "");

        setRunResult(null);
        setSubmissionResult(null);
        setError("");
      } catch {
        setError("Could not load level");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  useEffect(() => {
    if (!level) return;
    saveCodeDraft(level.slug, code);
  }, [level, code]);

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

      if (result.verdict === "accepted") {
        clearCodeDraft(level.slug);
      }

      const updatedProgress = await fetchMyProgress();
      setProgress(updatedProgress);
      
      const updatedHistory = await fetchSubmissionsByLevel(level.id);
      setSubmissionHistory(updatedHistory);
    } catch {
      setError("Failed to submit solution");
    } finally {
      setSubmitting(false);
    }
  }

  function handleResetCode() {
    if (!level) return;

    setCode(level.starter_code_python || "");
    clearCodeDraft(level.slug);
  }

  const navigate = useNavigate();
  function handleGoToNextLevel() {
    if (submissionResult?.unlocked_next_level) {
      navigate(`/levels/${submissionResult.unlocked_next_level}`);
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

            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <Badge
                variant={
                  level.difficulty.toLowerCase() === "easy"
                    ? "easy"
                    : level.difficulty.toLowerCase() === "medium"
                    ? "medium"
                    : level.difficulty.toLowerCase() === "hard"
                    ? "hard"
                    : "neutral"
                }
              >
                {level.difficulty}
              </Badge>
              
              <Badge variant="neutral">{level.function_name}</Badge>
            </div>

            <h2>Description</h2>
            <p style={{ lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{level.description}</p>

            <h2>Sample Test Cases</h2>
            {level.sample_test_cases && level.sample_test_cases.length > 0 ? (
              <div>
                {level.sample_test_cases.map((testCase) => (
                  <Card key={testCase.id}>
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
                    {JSON.stringify(
                      Array.isArray(testCase.input_data) && testCase.input_data.length === 1
                        ? testCase.input_data[0]
                        : testCase.input_data,
                      null,
                      2
                    )}
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
                  </Card>
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

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button onClick={handleRun} disabled={running} variant="secondary">
              {running ? "Running..." : "Run"}
            </Button>

            <Button onClick={handleSubmit} disabled={submitting} variant="primary">
              {submitting ? "Submitting..." : "Submit"}
            </Button>

            <Button onClick={handleResetCode} variant="secondary">
              Reset Code
            </Button>
          </div>

            {error && <StatusPanel variant="error">{error}</StatusPanel>}

            {runResult && (
              <StatusPanel variant={runResult.verdict === "accepted" ? "success" : "info"}>
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
                </StatusPanel>
            )}

            {submissionResult && (
              <StatusPanel
                variant={submissionResult.verdict === "accepted" ? "success" : "info"}
              >
                <h3 style={{ marginTop: 0 }}>Submission Result</h3>
                <p>
                  <strong>Verdict:</strong> {submissionResult.verdict}
                </p>

                {submissionResult.verdict === "accepted" && (
                  <p>Level completed successfully.</p>
                )}

                {submissionResult.unlocked_next_level && (
                  <p>Unlocked next level: {submissionResult.unlocked_next_level}</p>
                )}

                {submissionResult.verdict === "accepted" &&
                  submissionResult.unlocked_next_level && (
                  <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                      <Button onClick={handleGoToNextLevel} variant="success">
                        Go to next level
                      </Button>
                      <Link to="/" style={{ textDecoration: "none" }}>
                        <Button variant="secondary">Back to levels</Button>
                      </Link>
                    </div>
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
              </StatusPanel>
            )}
            {submissionHistory.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <h3>Recent Submissions</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {submissionHistory.slice(0, 5).map((submission) => (
                    <Card key={submission.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "1rem",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          <strong>#{submission.id}</strong>
                        </span>

                        <Badge
                          variant={
                            submission.verdict === "accepted"
                              ? "success"
                              : submission.verdict === "wrong_answer"
                              ? "info"
                              : "neutral"
                          }
                        >
                          {submission.verdict}
                        </Badge>

                        <span>
                          <strong>Language:</strong> {submission.language}
                        </span>

                        {submission.submitted_at && (
                          <span>
                            <strong>Submitted:</strong>{" "}
                            {new Date(submission.submitted_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}