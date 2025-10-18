import type { WritingToolId } from "./writingTools";

export type ChecklistSection = "plan" | "draft" | "revise";

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  section: ChecklistSection;
  relatedTools: readonly WritingToolId[];
}

export const WRITING_CHECKLIST: readonly ChecklistItem[] = [
  {
    id: "clarify-intent",
    label: "Clarify the intent",
    description: "You can explain why the piece matters and what the reader should do next.",
    section: "plan",
    relatedTools: ["idea-lab", "outline-sculptor"],
  },
  {
    id: "audience-snapshot",
    label: "Name the audience",
    description: "You can point to a specific reader, their context, and what they already believe.",
    section: "plan",
    relatedTools: ["tone-tuner"],
  },
  {
    id: "evidence-check",
    label: "Evidence check",
    description: "Every major claim is linked to a proof point, example, or credible reference.",
    section: "draft",
    relatedTools: ["evidence-tester", "narrative-expander"],
  },
  {
    id: "structure-scan",
    label: "Structure scan",
    description: "Sections follow a deliberate order that leads the reader through the argument.",
    section: "draft",
    relatedTools: ["outline-sculptor", "brevity-forge"],
  },
  {
    id: "voice-audit",
    label: "Voice audit",
    description: "Tone, energy, and word choice feel tailored to the intended audience.",
    section: "revise",
    relatedTools: ["tone-tuner", "precision-polish"],
  },
  {
    id: "clarity-pass",
    label: "Clarity pass",
    description: "Sentences read aloud without tripping and the core message lands quickly.",
    section: "revise",
    relatedTools: ["precision-polish", "brevity-forge"],
  },
  {
    id: "call-to-action",
    label: "Call to action",
    description: "The closing sentence points to a clear next step, question, or follow-up.",
    section: "revise",
    relatedTools: ["idea-lab", "tone-tuner"],
  },
] as const;

export type ChecklistItemId = (typeof WRITING_CHECKLIST)[number]["id"];

export function createChecklistState(initiallyChecked: ChecklistItemId[] = []) {
  return WRITING_CHECKLIST.reduce<Record<ChecklistItemId, boolean>>(
    (accumulator, item) => {
      accumulator[item.id] = initiallyChecked.includes(item.id);
      return accumulator;
    },
    {} as Record<ChecklistItemId, boolean>
  );
}
