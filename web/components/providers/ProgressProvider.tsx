"use client";

import React from "react";
import { CHECKLIST_SECTIONS, checklistItemIds } from "@/lib/checklist";
import { STORAGE_KEYS } from "@/lib/utils";

type ChecklistProgress = Record<string, boolean>;

type ProgressContextValue = {
  sections: typeof CHECKLIST_SECTIONS;
  progress: ChecklistProgress;
  toggleItem: (id: string) => void;
  setItem: (id: string, checked: boolean) => void;
  reset: () => void;
  completed: number;
  total: number;
  percentage: number;
  hydrated: boolean;
};

const ProgressContext = React.createContext<ProgressContextValue | undefined>(undefined);

const defaultProgress = checklistItemIds.reduce<ChecklistProgress>((acc, id) => {
  acc[id] = false;
  return acc;
}, {});

function mergeWithDefaults(input: unknown): ChecklistProgress {
  if (!input || typeof input !== "object") {
    return { ...defaultProgress };
  }

  const parsed: ChecklistProgress = { ...defaultProgress };

  for (const id of checklistItemIds) {
    const value = (input as ChecklistProgress)[id];
    parsed[id] = Boolean(value);
  }

  return parsed;
}

type ProgressProviderProps = {
  children: React.ReactNode;
};

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [progress, setProgress] = React.useState<ChecklistProgress>(() => ({ ...defaultProgress }));
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEYS.checklistProgress);
      if (storedValue) {
        const parsed = JSON.parse(storedValue);
        setProgress(mergeWithDefaults(parsed));
      }
    } catch (error) {
      console.warn("Unable to restore checklist progress", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEYS.checklistProgress, JSON.stringify(progress));
    } catch (error) {
      console.warn("Unable to persist checklist progress", error);
    }
  }, [progress, hydrated]);

  const toggleItem = React.useCallback((id: string) => {
    setProgress((current) => ({
      ...current,
      [id]: !current[id]
    }));
  }, []);

  const setItem = React.useCallback((id: string, checked: boolean) => {
    setProgress((current) => ({
      ...current,
      [id]: checked
    }));
  }, []);

  const reset = React.useCallback(() => {
    setProgress({ ...defaultProgress });
  }, []);

  const completed = React.useMemo(() => Object.values(progress).filter(Boolean).length, [progress]);
  const total = React.useMemo(() => checklistItemIds.length, []);
  const percentage = React.useMemo(() => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }, [completed, total]);

  const value = React.useMemo<ProgressContextValue>(
    () => ({
      sections: CHECKLIST_SECTIONS,
      progress,
      toggleItem,
      setItem,
      reset,
      completed,
      total,
      percentage,
      hydrated
    }),
    [progress, toggleItem, setItem, reset, completed, total, percentage, hydrated]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext() {
  const context = React.useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgressContext must be used within a ProgressProvider");
  }
  return context;
}
