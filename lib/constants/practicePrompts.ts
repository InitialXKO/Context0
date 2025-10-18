import type { WritingToolId } from "./writingTools";

export type PracticePromptCategory = "sentence-rewrite" | "paragraph";

export interface PracticePromptImage {
  src: string;
  alt: string;
  credit?: string;
}

export interface PracticePrompt {
  id: string;
  category: PracticePromptCategory;
  title: string;
  scenario: string;
  instruction: string;
  image: PracticePromptImage;
  recommendedTools: readonly WritingToolId[];
  focus: readonly string[];
  suggestedWordCount: number;
}

export const PRACTICE_PROMPTS = [
  {
    id: "rewrite-support-escalation",
    category: "sentence-rewrite",
    title: "Reduce friction in support escalations",
    scenario:
      "A senior support engineer opened a direct message with a curt, technical sentence that confused the customer success manager.",
    instruction:
      "Rewrite the original sentence so the intent is clear, the tone stays collaborative, and the next step is explicit.",
    image: {
      src: "/images/prompts/escalation.png",
      alt: "Customer success manager and engineer comparing notes over laptops.",
      credit: "Illustration by Workbench Studio",
    },
    recommendedTools: ["tone-tuner", "precision-polish"],
    focus: ["Clarity", "Tone", "Next steps"],
    suggestedWordCount: 60,
  },
  {
    id: "rewrite-product-update",
    category: "sentence-rewrite",
    title: "Sharpen a product update headline",
    scenario:
      "The team wrote a headline announcing a speed improvement, but it buries the lede and lacks energy.",
    instruction:
      "Produce three headline options that emphasise the benefit and feel share-worthy for customers.",
    image: {
      src: "/images/prompts/dashboard.png",
      alt: "Screenshot of a dashboard showing charts trending upward.",
      credit: "Photo by FlowState Analytics",
    },
    recommendedTools: ["idea-lab", "brevity-forge"],
    focus: ["Value framing", "Brevity", "Energy"],
    suggestedWordCount: 45,
  },
  {
    id: "rewrite-retrospective-opening",
    category: "sentence-rewrite",
    title: "Warm up a retrospective intro",
    scenario:
      "You are opening a retrospective after a sprint with unexpected setbacks. The initial sentence feels defensive.",
    instruction:
      "Rewrite the opening sentence so it acknowledges the challenges, sets a constructive tone, and invites participation.",
    image: {
      src: "/images/prompts/retrospective.png",
      alt: "Team gathered around a whiteboard covered in sticky notes.",
      credit: "Illustration by Retrospective Labs",
    },
    recommendedTools: ["tone-tuner", "narrative-expander"],
    focus: ["Empathy", "Invitation", "Clarity"],
    suggestedWordCount: 70,
  },
  {
    id: "paragraph-demo-playbook",
    category: "paragraph",
    title: "Draft a demo playbook excerpt",
    scenario:
      "A solutions engineer needs a paragraph that teaches new hires how to open a discovery call for an analytics platform.",
    instruction:
      "Write a paragraph that anchors in one concrete customer pain, previews the solution, and signposts a diagnostic question.",
    image: {
      src: "/images/prompts/demo.png",
      alt: "Person presenting a product demo on a large screen.",
      credit: "Illustration by Pitchcraft",
    },
    recommendedTools: ["outline-sculptor", "narrative-expander"],
    focus: ["Structure", "Storytelling", "Specificity"],
    suggestedWordCount: 150,
  },
  {
    id: "paragraph-change-announcement",
    category: "paragraph",
    title: "Explain a policy change with empathy",
    scenario:
      "People operations is updating the travel policy. The first draft reads bureaucratic and is missing rationale.",
    instruction:
      "Write a paragraph that grounds the change in company goals, acknowledges friction, and inspires adoption.",
    image: {
      src: "/images/prompts/travel.png",
      alt: "Colleagues reviewing a travel itinerary with sticky notes.",
      credit: "Illustration by PeopleOps Studio",
    },
    recommendedTools: ["idea-lab", "tone-tuner", "precision-polish"],
    focus: ["Empathy", "Messaging", "Clarity"],
    suggestedWordCount: 170,
  },
  {
    id: "paragraph-roadmap-narrative",
    category: "paragraph",
    title: "Frame a roadmap narrative",
    scenario:
      "A product manager is sharing next quarter's roadmap with customer advisory board members who care about outcomes more than feature lists.",
    instruction:
      "Write a paragraph that weaves together the customer problem, the strategic bet, and how success will be measured.",
    image: {
      src: "/images/prompts/roadmap.png",
      alt: "Product roadmap laid out across a planning wall.",
      credit: "Illustration by Roadmap Works",
    },
    recommendedTools: ["outline-sculptor", "evidence-tester"],
    focus: ["Narrative", "Evidence", "Outcomes"],
    suggestedWordCount: 160,
  },
] as const satisfies readonly PracticePrompt[];

export type PracticePromptId = (typeof PRACTICE_PROMPTS)[number]["id"];

export function getPromptById(promptId: PracticePromptId): PracticePrompt {
  const prompt = PRACTICE_PROMPTS.find((item) => item.id === promptId);
  if (!prompt) {
    throw new Error(`Unknown practice prompt id: ${promptId}`);
  }
  return prompt;
}
