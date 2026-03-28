import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./auth";
import { refreshAccessToken } from "../api/auth";

export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  let access = getAccessToken();

  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json");

  if (access) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  let response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    const refresh = getRefreshToken();

    if (!refresh) {
      clearTokens();
      throw new Error("Unauthorized");
    }

    try {
      const refreshed = await refreshAccessToken(refresh);
      setTokens(refreshed.access, refresh);

      const retryHeaders = new Headers(init.headers || {});
      retryHeaders.set("Content-Type", "application/json");
      retryHeaders.set("Authorization", `Bearer ${refreshed.access}`);

      response = await fetch(input, {
        ...init,
        headers: retryHeaders,
      });
    } catch {
      clearTokens();
      throw new Error("Session expired");
    }
  }

  return response;
}