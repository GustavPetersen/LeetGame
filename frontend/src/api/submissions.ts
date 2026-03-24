const API_BASE_URL = "http://127.0.0.1:8000/api";

export type CreateSubmissionPayload = {
  user: number;
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
  unlocked_next_level?: string | null;
};

export async function createSubmission(
  payload: CreateSubmissionPayload
): Promise<Submission> {
  const response = await fetch(`${API_BASE_URL}/submissions/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create submission");
  }

  return response.json();
}