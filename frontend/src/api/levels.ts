export type Level = {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  order: number;
  starter_code_python: string;
  function_name: string;
};

export type SampleTestCase = {
  id: number;
  input_data: unknown;
  expected_output: unknown;
  order: number;
};

const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchLevels(): Promise<Level[]> {
  const response = await fetch(`${API_BASE_URL}/levels/`);

  if (!response.ok) {
    throw new Error("Failed to fetch levels");
  }

  return response.json();
}

export async function fetchLevel(slug: string): Promise<Level> {
  const response = await fetch(`${API_BASE_URL}/levels/${slug}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch level");
  }

  return response.json();
}
