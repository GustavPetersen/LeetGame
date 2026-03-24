import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLevel, type Level } from "../api/levels";

export default function LevelDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [level, setLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch {
        setError("Could not load level");
      } finally {
        setLoading(false);
      }
    }

    loadLevel();
  }, [slug]);

  if (loading) return <p>Loading level...</p>;
  if (error) return <p>{error}</p>;
  if (!level) return <p>Level not found.</p>;

  return (
    <main>
      <Link to="/">← Back to levels</Link>

      <h1>{level.title}</h1>
      <p><strong>Difficulty:</strong> {level.difficulty}</p>
      <p><strong>Function:</strong> {level.function_name}</p>

      <h2>Description</h2>
      <p>{level.description}</p>

      <h2>Starter Code</h2>
      <pre>{level.starter_code_python}</pre>
    </main>
  );
}