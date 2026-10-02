"use client";
import { useCallback, useEffect, useState } from "react";
import { problems } from "./problems";
export interface SavedSummary {
  id: string;
  result: string;
  savedAt: string;
  text?: string;
}
const KEY = "fixflow-summaries-v1";
function read(): SavedSummary[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(data)) return [];
    return data.filter((v): v is SavedSummary =>
      Boolean(
        v &&
        typeof v === "object" &&
        typeof v.id === "string" &&
        problems.some((p) => p.id === v.id) &&
        typeof v.result === "string" &&
        typeof v.savedAt === "string" &&
        (v.text === undefined || typeof v.text === "string"),
      ),
    );
  } catch {
    return [];
  }
}
export function useProgress() {
  const [summaries, setSummaries] = useState<SavedSummary[]>([]);
  useEffect(() => {
    const update = () => setSummaries(read());
    update();
    window.addEventListener("storage", update);
    window.addEventListener("fixflow-progress", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("fixflow-progress", update);
    };
  }, []);
  const save = useCallback((id: string, result: string, text: string) => {
    try {
      const next = [
        ...read().filter((s) => s.id !== id),
        { id, result, text, savedAt: new Date().toISOString() },
      ];
      localStorage.setItem(KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("fixflow-progress"));
      return true;
    } catch {
      return false;
    }
  }, []);
  return { summaries, save };
}
