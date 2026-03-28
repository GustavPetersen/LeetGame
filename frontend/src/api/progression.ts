import { authenticatedFetch } from "../lib/api";

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

export async function fetchMyProgress(): Promise<PlayerProgress> {
  const response = await authenticatedFetch(`${API_BASE_URL}/progression/me/`);

  if (!response.ok) {
    throw new Error("Failed to fetch player progress");
  }

  return response.json();
}

export async function fetchMyCompletions(): Promise<LevelCompletion[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/progression/me/completions/`);

  if (!response.ok) {
    throw new Error("Failed to fetch level completions");
  }

  return response.json();
}