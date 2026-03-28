import { authenticatedFetch } from "../lib/api";
import type { Submission } from "./submissions";
import type { LevelCompletion } from "./progression";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export type ProfileStats = {
  username: string;
  completed_levels_count: number;
  total_submissions: number;
  accepted_submissions: number;
  acceptance_rate: number;
  highest_unlocked_level_order: number | null;
  highest_unlocked_level_title: string | null;
};

export async function fetchMyProfileStats(): Promise<ProfileStats> {
  const response = await authenticatedFetch(`${API_BASE_URL}/users/me/stats/`);

  if (!response.ok) {
    throw new Error("Failed to fetch profile stats");
  }

  return response.json();
}

export async function fetchMyRecentSubmissions(): Promise<Submission[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/submissions/`);

  if (!response.ok) {
    throw new Error("Failed to fetch recent submissions");
  }

  return response.json();
}

export async function fetchMyCompletedLevels(): Promise<LevelCompletion[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/progression/me/completions/`);

  if (!response.ok) {
    throw new Error("Failed to fetch completed levels");
  }

  return response.json();
}