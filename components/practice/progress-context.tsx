'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { v4 as uuid } from 'uuid';
import type { PracticeMode } from '../../app/practice/constants';

export interface PracticeAttempt {
  id: string;
  mode: PracticeMode;
  promptId: string;
  response: string;
  tools: string[];
  createdAt: string;
  characters: number;
  words: number;
}

export interface SaveAttemptInput {
  mode: PracticeMode;
  promptId: string;
  response: string;
  tools: string[];
}

interface ProgressContextValue {
  attempts: PracticeAttempt[];
  saveAttempt: (input: SaveAttemptInput) => PracticeAttempt;
  getAttemptsForPrompt: (promptId: string) => PracticeAttempt[];
}

const STORAGE_KEY = 'practice-progress-log';

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

const countWords = (value: string): number => {
  const words = value
    .trim()
    .replace(/\n+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return words.length;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const initialised = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || initialised.current) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PracticeAttempt>[];
        if (Array.isArray(parsed)) {
          const hydrated = parsed
            .filter((item): item is Partial<PracticeAttempt> => Boolean(item) && typeof item === 'object')
            .map((item) => {
              const response = typeof item.response === 'string' ? item.response : '';
              const mode: PracticeMode = item.mode === 'paragraph' ? 'paragraph' : 'sentence';
              const promptId = typeof item.promptId === 'string' ? item.promptId : '';
              const tools = Array.isArray(item.tools)
                ? item.tools.filter((value): value is string => typeof value === 'string')
                : [];
              const createdAt = typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString();
              return {
                id: typeof item.id === 'string' ? item.id : uuid(),
                mode,
                promptId,
                response,
                tools,
                createdAt,
                characters:
                  typeof item.characters === 'number' ? item.characters : response.length,
                words: typeof item.words === 'number' ? item.words : countWords(response)
              } satisfies PracticeAttempt;
            })
            .filter((item) => item.promptId);
          setAttempts(hydrated);
        }
      }
    } catch (error) {
      console.warn('[ProgressProvider] Failed to restore attempts from storage.', error);
    } finally {
      initialised.current = true;
    }
  }, []);

  const persist = useCallback((next: PracticeAttempt[]) => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('[ProgressProvider] Failed to persist attempts.', error);
    }
  }, []);

  const saveAttempt = useCallback(
    (input: SaveAttemptInput): PracticeAttempt => {
      const attempt: PracticeAttempt = {
        id: uuid(),
        mode: input.mode,
        promptId: input.promptId,
        response: input.response,
        tools: [...new Set(input.tools)],
        createdAt: new Date().toISOString(),
        characters: input.response.length,
        words: countWords(input.response)
      };

      setAttempts((prev) => {
        const next = [...prev, attempt];
        persist(next);
        return next;
      });

      return attempt;
    },
    [persist]
  );

  const getAttemptsForPrompt = useCallback(
    (promptId: string) => attempts.filter((attempt) => attempt.promptId === promptId),
    [attempts]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      attempts,
      saveAttempt,
      getAttemptsForPrompt
    }),
    [attempts, getAttemptsForPrompt, saveAttempt]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = (): ProgressContextValue => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider.');
  }
  return context;
};
