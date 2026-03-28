import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchLevels, type Level } from "../api/levels";
import {
  fetchMyCompletions,
  fetchMyProgress,
  type LevelCompletion,
  type PlayerProgress,
} from "../api/progression";

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "#198754";
    case "medium":
      return "#fd7e14";
    case "hard":
      return "#dc3545";
    default:
      return "#6c757d";
  }
}

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [completions, setCompletions] = useState<LevelCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [levelsData, progressData, completionsData] = await Promise.all([
          fetchLevels(),
          fetchMyProgress(),
          fetchMyCompletions(),
        ]);

        setLevels(levelsData);
        setProgress(progressData);
        setCompletions(completionsData);
      } catch {
        setError("Could not load levels");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const completedLevelIds = useMemo(
    () => new Set(completions.map((completion) => completion.level)),
    [completions]
  );

  const highestUnlockedOrder = progress?.highest_unlocked_level_order ?? 1;
  const completedCount = completions.length;
  const totalLevels = levels.length;
  const progressPercent =
    totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0;

  if (loading) return <p>Loading levels...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar progress={progress} />

      <main style={{ padding: "0 2rem 2rem" }}>
        <section
          style={{
            border: "1px solid #ccc",
            borderRadius: "14px",
            padding: "1.25rem",
            marginBottom: "1.5rem",
            background: "#fff",
          }}
        >
          <h1 style={{ marginTop: 0 }}>Your Progress</h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
                background: "#f8f9fa",
              }}
            >
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>Completed</p>
              <h2 style={{ margin: "0.5rem 0 0" }}>{completedCount}</h2>
            </div>

            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
                background: "#f8f9fa",
              }}
            >
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>Unlocked</p>
              <h2 style={{ margin: "0.5rem 0 0" }}>{highestUnlockedOrder}</h2>
            </div>

            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "1rem",
                background: "#f8f9fa",
              }}
            >
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>Completion</p>
              <h2 style={{ margin: "0.5rem 0 0" }}>{progressPercent}%</h2>
            </div>
          </div>

          <div>
            <div
              style={{
                width: "100%",
                height: "12px",
                borderRadius: "999px",
                background: "#e9ecef",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "#0d6efd",
                }}
              />
            </div>
          </div>
        </section>

        <section>
          <h2>Levels</h2>

          {levels.length === 0 ? (
            <p>No levels found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {levels.map((level) => {
                const isCompleted = completedLevelIds.has(level.id);
                const isUnlocked = level.order <= highestUnlockedOrder;

                let statusLabel = "Locked";
                let statusColor = "#6c757d";

                if (isCompleted) {
                  statusLabel = "Completed";
                  statusColor = "#198754";
                } else if (isUnlocked) {
                  statusLabel = "Unlocked";
                  statusColor = "#0d6efd";
                }

                return (
                  <article
                    key={level.id}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "14px",
                      padding: "1rem",
                      background: "#fff",
                      opacity: isUnlocked ? 1 : 0.7,
                      boxShadow: isCompleted
                        ? "0 0 0 2px rgba(25, 135, 84, 0.15)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                          Level {level.order}
                        </p>
                        <h3 style={{ margin: "0.25rem 0 0" }}>{level.title}</h3>
                      </div>

                      <span
                        style={{
                          padding: "0.35rem 0.65rem",
                          borderRadius: "999px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "#fff",
                          background: statusColor,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <span
                        style={{
                          padding: "0.3rem 0.6rem",
                          borderRadius: "999px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "#fff",
                          background: getDifficultyColor(level.difficulty),
                        }}
                      >
                        {level.difficulty}
                      </span>
                    </div>

                    <p
                      style={{
                        color: "#444",
                        lineHeight: 1.5,
                        minHeight: "72px",
                      }}
                    >
                      {level.description}
                    </p>

                    <div style={{ marginTop: "1rem" }}>
                      {isUnlocked ? (
                        <Link
                          to={`/levels/${level.slug}`}
                          style={{
                            display: "inline-block",
                            padding: "0.65rem 1rem",
                            borderRadius: "10px",
                            background: "#111827",
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: 600,
                          }}
                        >
                          {isCompleted ? "Replay level" : "Play level"}
                        </Link>
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.65rem 1rem",
                            borderRadius: "10px",
                            background: "#e9ecef",
                            color: "#6c757d",
                            fontWeight: 600,
                          }}
                        >
                          Locked
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}