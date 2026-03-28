import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchLevels, type Level } from "../api/levels";
import {
  fetchMyCompletions,
  fetchMyProgress,
  type LevelCompletion,
  type PlayerProgress,
} from "../api/progression";

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

  const completedLevelIds = new Set(completions.map((completion) => completion.level));
  const highestUnlockedOrder = progress?.highest_unlocked_level_order ?? 1;

  if (loading) return <p>Loading levels...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar progress={progress} />

      <main style={{ padding: "0 2rem 2rem" }}>
        <h1>Levels</h1>

        {levels.length === 0 ? (
          <p>No levels found.</p>
        ) : (
          <div>
            {levels.map((level) => {
              const isCompleted = completedLevelIds.has(level.id);
              const isUnlocked = level.order <= highestUnlockedOrder;

              return (
                <div
                  key={level.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "1rem",
                    marginBottom: "1rem",
                    opacity: isUnlocked ? 1 : 0.5,
                  }}
                >
                  <h3>
                    {level.order}. {level.title}
                  </h3>

                  <p>
                    <strong>Difficulty:</strong> {level.difficulty}
                  </p>

                  <p>{level.description}</p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {isCompleted ? "Completed" : isUnlocked ? "Unlocked" : "Locked"}
                  </p>

                  {isUnlocked ? (
                    <Link to={`/levels/${level.slug}`}>Open level</Link>
                  ) : (
                    <span>Locked</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}