import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProgressionMap from "../components/ProgressionMap";
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

  if (loading) return <p>Loading levels...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar progress={progress} />

      <main
        style={{
          padding: "0 2rem 3rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <section>
          <h2>Progression Map</h2>

          {levels.length === 0 ? (
            <p>No levels found.</p>
          ) : (
            <ProgressionMap
              levels={levels}
              progress={progress}
              completions={completions}
            />
          )}
        </section>
      </main>
    </>
  );
}