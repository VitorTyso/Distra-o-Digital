import type { AnswerMap } from "@/lib/quiz";

export type StoredPayload = {
  answers: AnswerMap;
  email: string;
};

const STORAGE_KEY = "distracao-digital";

export function savePayload(payload: StoredPayload) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadPayload(): StoredPayload | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredPayload;
  } catch {
    return null;
  }
}
