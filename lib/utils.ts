import type {
  ChecklistItemId,
  PracticeSession,
  ProgressStats,
  ProgressStorage,
  WritingToolId,
} from "./constants";
import { PROGRESS_STORAGE_VERSION, WRITING_TOOLS } from "./constants";

const MS_IN_DAY = 86_400_000;

const pad = (value: number) => value.toString().padStart(2, "0");

type DateInput = Date | number | string;

const isValidDate = (value: Date) => !Number.isNaN(value.getTime());

export interface DeriveStatsOptions {
  referenceDate?: Date;
  timeZone?: string;
}

export const formatDateKey = (value: DateInput, timeZone?: string): string => {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (!isValidDate(date)) {
    throw new Error(`Invalid date value: ${String(value)}`);
  }

  if (!timeZone) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error(`Unable to format date for key: ${String(value)}`);
  }

  return `${year}-${month}-${day}`;
};

const keyToUTCDate = (key: string): Date => {
  const [year, month, day] = key.split("-").map((part) => Number.parseInt(part, 10));
  return new Date(Date.UTC(year, month - 1, day));
};

const addDaysToKey = (key: string, offset: number): string => {
  const utcDate = keyToUTCDate(key);
  utcDate.setUTCDate(utcDate.getUTCDate() + offset);
  return `${utcDate.getUTCFullYear()}-${pad(utcDate.getUTCMonth() + 1)}-${pad(
    utcDate.getUTCDate()
  )}`;
};

const daysBetweenKeys = (a: string, b: string): number => {
  const start = keyToUTCDate(a);
  const end = keyToUTCDate(b);
  return Math.round((end.getTime() - start.getTime()) / MS_IN_DAY);
};

const orderSessions = (sessions: PracticeSession[]) =>
  [...sessions].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

export const sessionListFromStorage = (storage: ProgressStorage): PracticeSession[] =>
  Object.values(storage.sessions);

const initialStats = (): ProgressStats => ({
  totalCompleted: 0,
  completedToday: 0,
  uniqueLearningDays: 0,
  currentStreak: 0,
  longestStreak: 0,
  firstCompletedAt: null,
  lastCompletedAt: null,
  sessionsByTool: WRITING_TOOLS.reduce<Record<WritingToolId, number>>(
    (accumulator, tool) => ({ ...accumulator, [tool.id]: 0 }),
    {} as Record<WritingToolId, number>
  ),
});

const calculateStreaks = (dayKeys: string[], todayKey: string) => {
  if (dayKeys.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const sortedDays = [...new Set(dayKeys)].sort();

  let longestStreak = 1;
  let streak = 1;

  for (let index = 1; index < sortedDays.length; index += 1) {
    const previous = sortedDays[index - 1];
    const current = sortedDays[index];
    const delta = daysBetweenKeys(previous, current);

    if (delta === 1) {
      streak += 1;
    } else {
      streak = 1;
    }

    if (streak > longestStreak) {
      longestStreak = streak;
    }
  }

  let currentStreak = 0;
  const trackedDays = new Set(sortedDays);
  let cursor = todayKey;

  while (trackedDays.has(cursor)) {
    currentStreak += 1;
    cursor = addDaysToKey(cursor, -1);
  }

  return { currentStreak, longestStreak };
};

export const deriveProgressStats = (
  sessions: PracticeSession[],
  options: DeriveStatsOptions = {}
): ProgressStats => {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return initialStats();
  }

  const referenceDate = options.referenceDate ?? new Date();
  const timeZone = options.timeZone;
  const todayKey = formatDateKey(referenceDate, timeZone);

  const orderedSessions = orderSessions(
    sessions.filter((session) => isValidDate(new Date(session.completedAt)))
  );

  if (orderedSessions.length === 0) {
    return initialStats();
  }

  const stats = initialStats();
  stats.totalCompleted = orderedSessions.length;
  stats.firstCompletedAt = orderedSessions[0].completedAt;
  stats.lastCompletedAt = orderedSessions[orderedSessions.length - 1].completedAt;

  const dayKeys = orderedSessions.map((session) =>
    formatDateKey(session.completedAt, timeZone)
  );

  stats.uniqueLearningDays = new Set(dayKeys).size;
  stats.completedToday = dayKeys.filter((key) => key === todayKey).length;

  const { currentStreak, longestStreak } = calculateStreaks(dayKeys, todayKey);
  stats.currentStreak = currentStreak;
  stats.longestStreak = longestStreak;

  for (const session of orderedSessions) {
    stats.sessionsByTool[session.toolId] =
      (stats.sessionsByTool[session.toolId] ?? 0) + 1;
  }

  return stats;
};

export const mergeSessionIntoStorage = (
  storage: ProgressStorage,
  session: PracticeSession
): ProgressStorage => {
  const updatedAt = new Date().toISOString();
  return {
    ...storage,
    updatedAt,
    lastActivity: session.completedAt ?? updatedAt,
    sessions: {
      ...storage.sessions,
      [session.id]: session,
    },
  };
};

export const purgeProgressStorage = (storage: ProgressStorage): ProgressStorage => ({
  ...storage,
  version: PROGRESS_STORAGE_VERSION,
  updatedAt: new Date().toISOString(),
  lastActivity: null,
  sessions: {},
});

export const toggleChecklistValue = (
  storage: ProgressStorage,
  checklistId: ChecklistItemId,
  nextValue?: boolean
): ProgressStorage => {
  const resolved = nextValue ?? !storage.checklist[checklistId];

  const timestamp = new Date().toISOString();

  return {
    ...storage,
    updatedAt: timestamp,
    lastActivity: timestamp,
    checklist: {
      ...storage.checklist,
      [checklistId]: resolved,
    },
  };
};

export const touchProgressActivity = (
  storage: ProgressStorage,
  activityAt: string = new Date().toISOString()
): ProgressStorage => {
  const timestamp = new Date().toISOString();

  return {
    ...storage,
    updatedAt: timestamp,
    lastActivity: activityAt,
  };
};
