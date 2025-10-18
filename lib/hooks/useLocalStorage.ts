import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Updater<T> = T | ((previousValue: T) => T);

type Initializer<T> = T | (() => T);

export interface UseLocalStorageOptions<T> {
  /**
   * Custom serializer. Defaults to JSON.stringify.
   */
  serializer?: (value: T) => string;
  /**
   * Custom parser. Defaults to JSON.parse.
   */
  parser?: (value: string) => T;
  /**
   * Disable synchronisation across tabs/windows.
   */
  syncTabs?: boolean;
}

export interface UseLocalStorageResult<T> {
  value: T;
  setValue: (updater: Updater<T>) => void;
  removeValue: () => void;
  isHydrated: boolean;
}

const LOCAL_STORAGE_EVENT = "context0:local-storage";

interface LocalStorageEventDetail<T> {
  key: string;
  value: T;
  removed?: boolean;
}

const isBrowser = typeof window !== "undefined";

const isFunction = <T,>(value: Initializer<T>): value is () => T =>
  typeof value === "function";

/**
 * A React hook that mirrors state into localStorage with SSR guards, JSON
 * serialisation and cross-tab synchronisation.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: Initializer<T>,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageResult<T> {
  const serializer = useMemo(
    () => options.serializer ?? ((value: T) => JSON.stringify(value)),
    [options.serializer]
  );

  const parserRef = useRef(options.parser ?? ((value: string) => JSON.parse(value) as T));
  useEffect(() => {
    parserRef.current = options.parser ?? ((value: string) => JSON.parse(value) as T);
  }, [options.parser]);

  const getDefaultValue = useCallback((): T => {
    const defaultCandidate = isFunction(initialValue)
      ? (initialValue as () => T)()
      : (initialValue as T);

    return defaultCandidate;
  }, [initialValue]);

  const getStoredValue = useCallback((): T => {
    const fallback = getDefaultValue();

    if (!isBrowser) {
      return fallback;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        return fallback;
      }
      return parserRef.current(raw);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          `[useLocalStorage] Failed to parse value for key "${key}":`,
          error
        );
      }
      return fallback;
    }
  }, [getDefaultValue, key]);

  const [storedValue, setStoredValue] = useState<T>(() => getStoredValue());
  const [isHydrated, setIsHydrated] = useState(!isBrowser);

  const setValue = useCallback(
    (updater: Updater<T>) => {
      setStoredValue((currentValue) => {
        const nextValue =
          typeof updater === "function"
            ? (updater as (previousValue: T) => T)(currentValue)
            : updater;

        if (!isBrowser) {
          return nextValue;
        }

        try {
          const serialized = serializer(nextValue);
          window.localStorage.setItem(key, serialized);
          window.dispatchEvent(
            new CustomEvent<LocalStorageEventDetail<T>>(LOCAL_STORAGE_EVENT, {
              detail: { key, value: nextValue },
            })
          );
        } catch (error) {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.warn(
              `[useLocalStorage] Failed to serialise value for key "${key}":`,
              error
            );
          }
        }

        return nextValue;
      });
    },
    [key, serializer]
  );

  const removeValue = useCallback(() => {
    const fallback = getDefaultValue();
    setStoredValue(fallback);

    if (!isBrowser) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(
        new CustomEvent<LocalStorageEventDetail<T>>(LOCAL_STORAGE_EVENT, {
          detail: { key, value: fallback, removed: true },
        })
      );
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          `[useLocalStorage] Failed to remove key "${key}" from localStorage:`,
          error
        );
      }
    }
  }, [getDefaultValue, key]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    setStoredValue(getStoredValue());
    setIsHydrated(true);
  }, [getStoredValue]);

  useEffect(() => {
    if (!isBrowser || options.syncTabs === false) {
      return;
    }

    const handleNativeStorage = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }

      setStoredValue(getStoredValue());
    };

    const handleCustomStorage = (
      event: Event & { detail?: LocalStorageEventDetail<T> }
    ) => {
      if (!("detail" in event) || !event.detail) {
        return;
      }

      if (event.detail.key !== key) {
        return;
      }

      if (event.detail.removed) {
        setStoredValue(getDefaultValue());
        return;
      }

      setStoredValue(event.detail.value);
    };

    window.addEventListener("storage", handleNativeStorage);
    window.addEventListener(LOCAL_STORAGE_EVENT, handleCustomStorage as EventListener);

    return () => {
      window.removeEventListener("storage", handleNativeStorage);
      window.removeEventListener(
        LOCAL_STORAGE_EVENT,
        handleCustomStorage as EventListener
      );
    };
  }, [getDefaultValue, getStoredValue, key, options.syncTabs]);

  return useMemo(
    () => ({ value: storedValue, setValue, removeValue, isHydrated }),
    [storedValue, setValue, removeValue, isHydrated]
  );
}
