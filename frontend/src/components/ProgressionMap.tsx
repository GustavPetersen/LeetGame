import { Link } from "react-router-dom";
import type { Level } from "../api/levels";
import type { LevelCompletion, PlayerProgress } from "../api/progression";
import Card from "./ui/Card";
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
        <Card key={`${chapter.chapter_order}-${chapter.chapter}`}>
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
              Chapter {chapter.chapter_order}
            </p>
            <h2 style={{ margin: "0.3rem 0 0" }}>{chapter.chapter}</h2>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "stretch",
            }}
          >
            {chapter.levels.map((level, index) => {
              const isCompleted = completedLevelIds.has(level.id);
              const isUnlocked = level.order <= highestUnlockedOrder;
              const isBoss = level.node_type === "boss";

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
                      minWidth: isBoss ? "260px" : "220px",
                      border: isBoss ? "2px solid #dc3545" : "1px solid #ccc",
                      borderRadius: "16px",
                      padding: "1rem",
                      background: isUnlocked ? "#fff" : "#f3f4f6",
                      opacity: isUnlocked ? 1 : 0.65,
                      boxShadow: isCompleted
                        ? "0 0 0 2px rgba(25, 135, 84, 0.15)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        alignItems: "flex-start",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>
                          Level {level.order}
                        </p>
                        <h3 style={{ margin: "0.3rem 0 0" }}>{level.title}</h3>
                      </div>

                      <Badge
                        variant={
                          isCompleted ? "success" : isUnlocked ? "info" : "neutral"
                        }
                      >
                        {isCompleted ? "Completed" : isUnlocked ? "Unlocked" : "Locked"}
                      </Badge>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <Badge variant={getDifficultyVariant(level.difficulty) as any}>
                        {level.difficulty}
                      </Badge>

                      {isBoss && <Badge variant="neutral">Boss</Badge>}
                    </div>

                    <p
                      style={{
                        color: "#444",
                        lineHeight: 1.5,
                        minHeight: "66px",
                        marginBottom: "1rem",
                      }}
                    >
                      {level.description}
                    </p>

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

                  {index < chapter.levels.length - 1 && (
                    <div
                      style={{
                        width: "40px",
                        height: "4px",
                        borderRadius: "999px",
                        background: "#d1d5db",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}