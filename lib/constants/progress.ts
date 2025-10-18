import type { ChecklistItemId } from "./checklist";
import { createChecklistState } from "./checklist";
import type { PracticePromptId } from "./practicePrompts";
import type { WritingToolId } from "./writingTools";

export const PROGRESS_STORAGE_KEY = "context0:writer-progress";
export const PROGRESS_STORAGE_VERSION = 1;

export type ChecklistState = Record<ChecklistItemId, boolean>;

export interface PracticeSession {
  id: string;
  promptId: PracticePromptId;
  toolId: WritingToolId;
  /** ISO timestamp when the learner started the activity. */
  startedAt: string;
  /** ISO timestamp when the learner marked the activity complete. */
  completedAt: string;
  /** Number of minutes spent, rounded to the nearest minute. */
  durationMinutes?: number;
  /** Optional self-reflection or observation. */
  reflection?: string;
  /** Optional score or rating supplied by the learner. */
  rating?: 1 | 2 | 3 | 4 | 5;
  /** Additional metadata saved by experiments or power users. */
  metadata?: Record<string, unknown>;
}

export interface ProgressStorage {
  version: number;
  createdAt: string;
  updatedAt: string | null;
  lastActivity: string | null;
  sessions: Record<string, PracticeSession>;
  checklist: ChecklistState;
}

export interface ProgressStats {
  totalCompleted: number;
  completedToday: number;
  uniqueLearningDays: number;
  currentStreak: number;
  longestStreak: number;
  firstCompletedAt: string | null;
  lastCompletedAt: string | null;
  sessionsByTool: Record<WritingToolId, number>;
}

export const createInitialProgressState = (): ProgressStorage => {
  const timestamp = new Date().toISOString();

  return {
    version: PROGRESS_STORAGE_VERSION,
    createdAt: timestamp,
    updatedAt: null,
    lastActivity: null,
    sessions: {},
    checklist: createChecklistState(),
  };
};
