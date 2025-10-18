import type { MutableRefObject, Ref } from "react";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function mergeRefs<T>(...refs: Array<Ref<T>>) {
  return (value: T) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && typeof ref === "object") {
        (ref as MutableRefObject<T | null>).current = value;
      }
    }
  };
}

export const STORAGE_KEYS = {
  checklistProgress: "exam-checklist-progress"
} as const;
