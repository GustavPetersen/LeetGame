const API_BASE_URL = "http://127.0.0.1:8000/api";

export type PlayerProgress = {
  id: number;
  user: number;
  highest_unlocked_level: number | null;
  highest_unlocked_level_order?: number;
  highest_unlocked_level_title?: string;
  completed_levels_count: number;
};

export type LevelCompletion = {
  id: number;
  user: number;
  level: number;
  level_title: string;
  level_slug: string;
  level_order: number;
  completed_at: string;
};

export async function fetchPlayerProgress(userId: number): Promise<PlayerProgress> {
  const response = await fetch(`${API_BASE_URL}/progression/${userId}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch player progress");
  }

  return response.json();
}

export async function fetchLevelCompletions(userId: number): Promise<LevelCompletion[]> {
  const response = await fetch(`${API_BASE_URL}/progression/${userId}/completions/`);

  if (!response.ok) {
    throw new Error("Failed to fetch level completions");
  }

  return response.json();
}