"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  type ChecklistItemId,
  type PracticeSession,
  type ProgressStats,
  type ProgressStorage,
  PROGRESS_STORAGE_KEY,
  createInitialProgressState,
} from "../constants";
import {
  deriveProgressStats,
  mergeSessionIntoStorage,
  sessionListFromStorage,
  toggleChecklistValue,
  touchProgressActivity,
} from "../utils";

export interface ProgressContextValue {
  storage: ProgressStorage;
  stats: ProgressStats;
  saveSession: (session: PracticeSession) => void;
  clearProgress: () => void;
  toggleChecklistItem: (checklistId: ChecklistItemId, value?: boolean) => void;
  trackActivity: (timestamp?: string) => void;
  isHydrated: boolean;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export interface ProgressProviderProps extends PropsWithChildren {
  /** Override the underlying localStorage key (useful for testing). */
  storageKey?: string;
}

export const ProgressProvider = ({
  children,
  storageKey = PROGRESS_STORAGE_KEY,
}: ProgressProviderProps) => {
  const {
    value: storage,
    setValue: setStorage,
    removeValue,
    isHydrated,
  } = useLocalStorage<ProgressStorage>(storageKey, createInitialProgressState);

  const sessions = useMemo(
    () => sessionListFromStorage(storage),
    [storage.sessions]
  );
  const stats = useMemo<ProgressStats>(
    () => deriveProgressStats(sessions),
    [sessions]
  );

  const saveSession = useCallback(
    (session: PracticeSession) => {
      setStorage((previous) => mergeSessionIntoStorage(previous, session));
    },
    [setStorage]
  );

  const clearProgress = useCallback(() => {
    removeValue();
  }, [removeValue]);

  const toggleChecklistItem = useCallback(
    (checklistId: ChecklistItemId, value?: boolean) => {
      setStorage((previous) => toggleChecklistValue(previous, checklistId, value));
    },
    [setStorage]
  );

  const trackActivity = useCallback(
    (timestamp?: string) => {
      setStorage((previous) => touchProgressActivity(previous, timestamp));
    },
    [setStorage]
  );

  const providerValue = useMemo<ProgressContextValue>(
    () => ({
      storage,
      stats,
      saveSession,
      clearProgress,
      toggleChecklistItem,
      trackActivity,
      isHydrated,
    }),
    [storage, stats, saveSession, clearProgress, toggleChecklistItem, trackActivity, isHydrated]
  );

  return (
    <ProgressContext.Provider value={providerValue}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextValue => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};

export const useProgressStats = (): ProgressStats => {
  const { stats } = useProgress();
  return stats;
};
