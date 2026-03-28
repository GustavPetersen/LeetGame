import { Link } from "react-router-dom";
import type { Level } from "../api/levels";
import type { LevelCompletion, PlayerProgress } from "../api/progression";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

type Props = {
  levels: Level[];
  progress: PlayerProgress | null;
  completions: LevelCompletion[];
};

type ChapterGroup = {
  chapter: string;
  chapter_order: number;
  levels: Level[];
};

function groupLevelsByChapter(levels: Level[]): ChapterGroup[] {
  const map = new Map<string, ChapterGroup>();

  for (const level of levels) {
    const key = `${level.chapter_order}-${level.chapter}`;

    if (!map.has(key)) {
      map.set(key, {
        chapter: level.chapter,
        chapter_order: level.chapter_order,
        levels: [],
      });
    }

    map.get(key)!.levels.push(level);
  }

  return Array.from(map.values())
    .sort((a, b) => a.chapter_order - b.chapter_order)
    .map((group) => ({
      ...group,
      levels: [...group.levels].sort((a, b) => a.order - b.order),
    }));
}

function getDifficultyVariant(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "easy";
    case "medium":
      return "medium";
    case "hard":
      return "hard";
    default:
      return "neutral";
  }
}

export default function ProgressionMap({ levels, progress, completions }: Props) {
  const chapterGroups = groupLevelsByChapter(levels);
  const completedLevelIds = new Set(completions.map((completion) => completion.level));
  const highestUnlockedOrder = progress?.highest_unlocked_level_order ?? 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {chapterGroups.map((chapter) => (
        <section
          key={`${chapter.chapter_order}-${chapter.chapter}`}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "1.5rem",
            background: "#ffffff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ marginBottom: "1.25rem" }}>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#6b7280",
              }}
            >
              Chapter {chapter.chapter_order}
            </p>
            <h2
              style={{
                margin: "0.35rem 0 0",
                fontSize: "1.5rem",
                color: "#111827",
              }}
            >
              {chapter.chapter}
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {chapter.levels.map((level, index) => {
              const isCompleted = completedLevelIds.has(level.id);
              const isUnlocked = level.order <= highestUnlockedOrder;
              const isBoss = level.node_type === "boss";

              const borderColor = isCompleted
                ? "#22c55e"
                : isBoss
                ? "#f59e0b"
                : isUnlocked
                ? "#3b82f6"
                : "#d1d5db";

              const background = isCompleted
                ? "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)"
                : isBoss
                ? "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)"
                : "#ffffff";

              return (
                <div
                  key={level.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "260px",
                      minHeight: "190px",
                      borderRadius: "18px",
                      border: `2px solid ${borderColor}`,
                      background,
                      padding: "1rem",
                      opacity: isUnlocked ? 1 : 0.55,
                      boxShadow: isUnlocked ? "0 6px 18px rgba(0,0,0,0.06)" : "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
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
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "#6b7280",
                            }}
                          >
                            Level {level.order}
                          </p>
                          <h3
                            style={{
                              margin: "0.35rem 0 0",
                              fontSize: "1.05rem",
                              lineHeight: 1.3,
                              color: "#111827",
                            }}
                          >
                            {level.title}
                          </h3>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                          <Badge
                            variant={
                              isCompleted ? "success" : isUnlocked ? "info" : "neutral"
                            }
                          >
                            {isCompleted ? "Completed" : isUnlocked ? "Unlocked" : "Locked"}
                          </Badge>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                          marginBottom: "0.85rem",
                        }}
                      >
                        <Badge variant={getDifficultyVariant(level.difficulty) as any}>
                          {level.difficulty}
                        </Badge>
                        {isBoss && <Badge variant="neutral">Boss</Badge>}
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.92rem",
                          lineHeight: 1.5,
                          color: "#4b5563",
                        }}
                      >
                        {level.description.length > 120
                          ? `${level.description.slice(0, 120)}...`
                          : level.description}
                      </p>
                    </div>

                    <div style={{ marginTop: "1rem" }}>
                      {isUnlocked ? (
                        <Link to={`/levels/${level.slug}`} style={{ textDecoration: "none" }}>
                          <Button variant={isBoss ? "danger" : "primary"}>
                            {isCompleted ? "Replay" : "Play"}
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="secondary" disabled>
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>

                  {index < chapter.levels.length - 1 && (
                    <div
                      style={{
                        width: "36px",
                        height: "6px",
                        borderRadius: "999px",
                        background: "#d1d5db",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}