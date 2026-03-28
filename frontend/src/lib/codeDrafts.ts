const DRAFT_PREFIX = "leetgame_draft_";

function getDraftKey(levelSlug: string) {
  return `${DRAFT_PREFIX}${levelSlug}`;
}

export function saveCodeDraft(levelSlug: string, code: string) {
  localStorage.setItem(getDraftKey(levelSlug), code);
}

export function loadCodeDraft(levelSlug: string): string | null {
  return localStorage.getItem(getDraftKey(levelSlug));
}

export function clearCodeDraft(levelSlug: string) {
  localStorage.removeItem(getDraftKey(levelSlug));
}