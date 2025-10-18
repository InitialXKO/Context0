import type { WritingToolId } from "./writingTools";

export interface SpeedMethodStep {
  id: string;
  title: string;
  description: string;
  questions: readonly string[];
  recommendedTools: readonly WritingToolId[];
  durationMinutes: [number, number];
  deliverable: string;
}

export const SPEED_METHOD_STEPS: readonly SpeedMethodStep[] = [
  {
    id: "scan",
    title: "Scan",
    description:
      "Capture the brief, audience, and constraints. Name the win condition before opening any document.",
    questions: [
      "What outcome do we need from the reader?",
      "What are the hard constraints (time, format, approvals)?",
      "What does the reader already believe?",
    ],
    recommendedTools: ["idea-lab", "tone-tuner"],
    durationMinutes: [2, 3],
    deliverable: "Notebook bullets that define success and context.",
  },
  {
    id: "plan",
    title: "Plan",
    description:
      "Choose a frame, supporting beats, and transitions. Commit to an outline that solves for the reader's tension.",
    questions: [
      "What change in belief are we provoking?",
      "Which evidence or stories earn that change?",
      "How should the narrative start and end?",
    ],
    recommendedTools: ["outline-sculptor", "evidence-tester"],
    durationMinutes: [4, 6],
    deliverable: "Skeleton outline with annotated intent for each section.",
  },
  {
    id: "express",
    title: "Express",
    description:
      "Draft quickly without editing. Focus on momentum and emotional logic.",
    questions: [
      "Which example anchors the reader in the stakes?",
      "Where can we show instead of tell?",
    ],
    recommendedTools: ["narrative-expander"],
    durationMinutes: [6, 10],
    deliverable: "Rough draft or paragraph capturing the full story arc.",
  },
  {
    id: "edit",
    title: "Edit",
    description:
      "Upgrade clarity, tone, and specificity. Remove redundancy and aim for confident sentences.",
    questions: [
      "Where can we tighten sentence structure?",
      "Is the call-to-action unmistakable?",
    ],
    recommendedTools: ["precision-polish", "brevity-forge"],
    durationMinutes: [5, 7],
    deliverable: "Polished paragraph or page ready for feedback.",
  },
  {
    id: "deliver",
    title: "Deliver",
    description:
      "Package the work for stakeholders. Highlight decisions, open questions, and next steps.",
    questions: [
      "What context does the reviewer need to respond quickly?",
      "Are follow-up tasks clearly owned?",
    ],
    recommendedTools: ["tone-tuner", "idea-lab"],
    durationMinutes: [2, 4],
    deliverable: "Send-ready copy with a crisp summary of next actions.",
  },
] as const;

export type SpeedMethodStepId = (typeof SPEED_METHOD_STEPS)[number]["id"];
