'use client';

import * as React from 'react';

const STORAGE_KEY = 'context0-progress-tracker';

export type ProgressAttemptStatus = 'completed' | 'in-progress' | 'aborted';

export interface ToolReference {
  name: string;
  href?: string;
  description?: string;
}

export interface ProgressAttempt {
  id: string;
  exerciseTitle: string;
  completedAt: string;
  status: ProgressAttemptStatus;
  summary?: string;
  durationMinutes?: number;
  score?: number;
  tools?: ToolReference[];
  reflections?: string;
}

export interface ProgressMetrics {
  completedExercises: number;
  distinctLearningDays: number;
  recentActivity: ProgressAttempt | null;
  totalAttempts: number;
}

export interface ProgressContextValue {
  attempts: ProgressAttempt[];
  metrics: ProgressMetrics;
  hydrated: boolean;
  recordAttempt: (attempt: ProgressAttempt) => void;
  clearProgress: () => void;
}

const ProgressContext = React.createContext<ProgressContextValue | undefined>(undefined);

const demoAttempts: ProgressAttempt[] = [
  {
    id: 'attempt-1',
    exerciseTitle: 'Vector Transformations',
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: 'completed',
    summary: 'Translated a set of vectors before applying rotation matrices.',
    durationMinutes: 35,
    score: 92,
    tools: [
      { name: 'Linear Algebra Toolkit', href: 'https://la-toolkit.dev' },
      { name: 'Notebook', description: 'Hand-written notes in Obsidian vault' },
    ],
    reflections: 'Revisit the determinant rules to speed up the rotation step.',
  },
  {
    id: 'attempt-2',
    exerciseTitle: 'Concurrency Race Conditions',
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'completed',
    summary: 'Diagnosed a race condition by introducing locks and unit tests.',
    durationMinutes: 50,
    score: 88,
    tools: [{ name: 'Rustlings', href: 'https://github.com/rust-lang/rustlings' }],
    reflections: 'Investigate async primitives for more idiomatic solutions.',
  },
  {
    id: 'attempt-3',
    exerciseTitle: 'Graph Search Strategies',
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    status: 'in-progress',
    summary: 'Explored BFS heuristics before switching to bidirectional search.',
    durationMinutes: 40,
    tools: [
      { name: 'Visual Algo', href: 'https://visualgo.net/en/dfsbfs' },
      { name: 'Whiteboard session' },
    ],
    reflections: 'Need to compare node expansions between approaches.',
  },
];

function sanitizeAttempts(entries: ProgressAttempt[]): ProgressAttempt[] {
  return entries
    .filter((entry) => Boolean(entry?.id) && Boolean(entry?.completedAt))
    .map((entry) => ({
      ...entry,
      status: entry.status ?? 'completed',
      tools: entry.tools?.map((tool) => ({ ...tool, name: tool.name.trim() })).filter((tool) => tool.name) ?? [],
    }))
    .sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [attempts, setAttempts] = React.useState<ProgressAttempt[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'attempts' in parsed &&
          Array.isArray((parsed as { attempts: unknown }).attempts)
        ) {
          setAttempts(sanitizeAttempts((parsed as { attempts: ProgressAttempt[] }).attempts));
        } else {
          setAttempts(sanitizeAttempts(demoAttempts));
        }
      } else {
        setAttempts(sanitizeAttempts(demoAttempts));
      }
    } catch (error) {
      console.warn('Failed to parse stored progress data; falling back to defaults', error);
      setAttempts(sanitizeAttempts(demoAttempts));
    } finally {
      setHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      if (attempts.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ attempts }),
        );
      }
    } catch (error) {
      console.warn('Failed to persist progress data', error);
    }
  }, [attempts, hydrated]);

  const metrics = React.useMemo<ProgressMetrics>(() => {
    const completedExercises = attempts.filter((attempt) => attempt.status === 'completed').length;
    const distinctLearningDays = new Set(
      attempts.map((attempt) => new Date(attempt.completedAt).toISOString().split('T')[0]),
    ).size;
    const recentActivity = attempts[0] ?? null;
    const totalAttempts = attempts.length;

    return {
      completedExercises,
      distinctLearningDays,
      recentActivity,
      totalAttempts,
    };
  }, [attempts]);

  const recordAttempt = React.useCallback((attempt: ProgressAttempt) => {
    setAttempts((prev) => {
      const others = prev.filter((item) => item.id !== attempt.id);
      return sanitizeAttempts([...others, attempt]);
    });
  }, []);

  const clearProgress = React.useCallback(() => {
    setAttempts([]);
  }, []);

  const value = React.useMemo<ProgressContextValue>(
    () => ({ attempts, metrics, hydrated, recordAttempt, clearProgress }),
    [attempts, metrics, hydrated, recordAttempt, clearProgress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = React.useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider.');
  }
  return context;
}
