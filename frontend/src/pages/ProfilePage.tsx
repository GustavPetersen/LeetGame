import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import StatusPanel from "../components/ui/StatusPanel";
import { fetchMyProgress, type PlayerProgress } from "../api/progression";
import {
  fetchMyCompletedLevels,
  fetchMyProfileStats,
  fetchMyRecentSubmissions,
  type ProfileStats,
} from "../api/profile";
import type { LevelCompletion } from "../api/progression";
import type { Submission } from "../api/submissions";

export default function ProfilePage() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [completedLevels, setCompletedLevels] = useState<LevelCompletion[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const [progressData, statsData, completedData, submissionsData] =
          await Promise.all([
            fetchMyProgress(),
            fetchMyProfileStats(),
            fetchMyCompletedLevels(),
            fetchMyRecentSubmissions(),
          ]);

        setProgress(progressData);
        setStats(statsData);
        setCompletedLevels(completedData);
        setRecentSubmissions(submissionsData);
      } catch {
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;

  return (
    <>
      <Navbar progress={progress} />

      <main style={{ padding: "0 2rem 2rem" }}>
        <h1>Profile</h1>

        {error && <StatusPanel variant="error">{error}</StatusPanel>}

        {stats && (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <Card>
                <p style={{ margin: 0, color: "#666" }}>Player</p>
                <h2 style={{ margin: "0.5rem 0 0" }}>{stats.username}</h2>
              </Card>

              <Card>
                <p style={{ margin: 0, color: "#666" }}>Completed Levels</p>
                <h2 style={{ margin: "0.5rem 0 0" }}>{stats.completed_levels_count}</h2>
              </Card>

              <Card>
                <p style={{ margin: 0, color: "#666" }}>Total Submissions</p>
                <h2 style={{ margin: "0.5rem 0 0" }}>{stats.total_submissions}</h2>
              </Card>

              <Card>
                <p style={{ margin: 0, color: "#666" }}>Acceptance Rate</p>
                <h2 style={{ margin: "0.5rem 0 0" }}>{stats.acceptance_rate}%</h2>
              </Card>
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                alignItems: "start",
              }}
            >
              <Card>
                <h2 style={{ marginTop: 0 }}>Progress</h2>
                <p>
                  <strong>Highest unlocked:</strong>{" "}
                  {stats.highest_unlocked_level_order
                    ? `Level ${stats.highest_unlocked_level_order} — ${stats.highest_unlocked_level_title}`
                    : "None"}
                </p>
                <p>
                  <strong>Accepted submissions:</strong> {stats.accepted_submissions}
                </p>
              </Card>

              <Card>
                <h2 style={{ marginTop: 0 }}>Completed Levels</h2>

                {completedLevels.length === 0 ? (
                  <p>No completed levels yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {completedLevels.map((completion) => (
                      <div
                        key={completion.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "1rem",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          Level {completion.level_order}: {completion.level_title}
                        </span>
                        <Badge variant="success">Completed</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>

            <section style={{ marginTop: "1.5rem" }}>
              <Card>
                <h2 style={{ marginTop: 0 }}>Recent Submissions</h2>

                {recentSubmissions.length === 0 ? (
                  <p>No submissions yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {recentSubmissions.slice(0, 10).map((submission) => (
                      <div
                        key={submission.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "1rem",
                          flexWrap: "wrap",
                          alignItems: "center",
                          borderBottom: "1px solid #eee",
                          paddingBottom: "0.75rem",
                        }}
                      >
                        <span>
                          <strong>#{submission.id}</strong>
                        </span>

                        <span>Level {submission.level}</span>

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

                        {submission.submitted_at && (
                          <span>{new Date(submission.submitted_at).toLocaleString()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>
          </>
        )}
      </main>
    </>
  );
}