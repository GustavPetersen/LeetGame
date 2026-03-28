import { authenticatedFetch } from "../lib/api";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export type CreateSubmissionPayload = {
  level: number;
  language: string;
  code: string;
};

export type Submission = {
  id: number;
  user: number;
  level: number;
  language: string;
  code: string;
  verdict: string;
  submitted_at?: string;
  unlocked_next_level?: string | null;
  judge_result?: {
    verdict: string;
    failed_test_case?: number;
    expected?: unknown;
    got?: unknown;
    error?: string;
  };
};

export type RunCodePayload = {
  level: number;
  language: string;
  code: string;
};

export type RunCodeResult = {
  verdict: string;
  judge_result: {
    verdict: string;
    failed_test_case?: number;
    expected?: unknown;
    got?: unknown;
    error?: string;
  };
  total_sample_tests: number;
};

export async function createSubmission(payload: CreateSubmissionPayload): Promise<Submission> {
  const response = await authenticatedFetch(`${API_BASE_URL}/submissions/create/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create submission");
  }

  return response.json();
}

export async function runCode(payload: RunCodePayload): Promise<RunCodeResult> {
  const response = await authenticatedFetch(`${API_BASE_URL}/submissions/run/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to run code");
  }

  return response.json();
}

export async function fetchSubmissionsByLevel(levelId: number): Promise<Submission[]> {
  const response = await authenticatedFetch(`${API_BASE_URL}/submissions/?level=${levelId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
  }

  return response.json();
}