import { useEffect, useState } from "react";
import { fetchLevels, type Level } from "../api/levels";

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLevels() {
      try {
        const data = await fetchLevels();
        setLevels(data);
      } catch {
        setError("Could not load levels");
      } finally {
        setLoading(false);
      }
    }

    loadLevels();
  }, []);

  if (loading) return <p>Loading levels...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h1>LeetGame</h1>
      <h2>Levels</h2>

      {levels.length === 0 ? (
        <p>No levels found.</p>
      ) : (
        <div>
          {levels.map((level) => (
            <div key={level.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <h3>
                {level.order}. {level.title}
              </h3>
              <p><strong>Difficulty:</strong> {level.difficulty}</p>
              <p>{level.description}</p>
              <p><strong>Function:</strong> {level.function_name}</p>
              <button>Open level</button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}