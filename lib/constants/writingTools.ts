export interface WritingTool {
  /** Stable identifier used across stored sessions and UI routes. */
  id: string;
  /** Human friendly name. */
  name: string;
  /** Short tooltip style description. */
  summary: string;
  /** Longer description explaining how to apply the tool. */
  description: string;
  /**
   * Skill areas the tool reinforces. The order roughly represents the
   * progression a learner experiences while using it.
   */
  focusAreas: readonly string[];
  /**
   * Example starter prompts that demonstrate the tool's flavour.
   */
  samplePrompts: readonly string[];
  /** Suggested length in minutes for a typical exercise. */
  estimatedMinutes: number;
}

export const WRITING_TOOLS = [
  {
    id: "idea-lab",
    name: "Idea Lab",
    summary: "Rapidly generate angles, outlines, and thesis statements.",
    description:
      "Use Idea Lab when you need to overcome a blank page. It encourages rapid divergence before converging on the most resonant framing.",
    focusAreas: ["Brainstorming", "Framing", "Planning"],
    samplePrompts: [
      "Pitch three unexpected angles for an article about remote-first culture.",
      "Draft a thesis statement that balances optimism with realistic challenges.",
    ],
    estimatedMinutes: 8,
  },
  {
    id: "outline-sculptor",
    name: "Outline Sculptor",
    summary: "Shape supporting points into a cohesive narrative arc.",
    description:
      "Outline Sculptor is designed for the moment after ideation. It helps writers prioritize supporting evidence and commit to a structure before drafting.",
    focusAreas: ["Structure", "Sequencing", "Intentional transitions"],
    samplePrompts: [
      "Organise this research into a three-act narrative for a keynote.",
      "Turn these bullet points into a persuasive memo outline.",
    ],
    estimatedMinutes: 10,
  },
  {
    id: "tone-tuner",
    name: "Tone Tuner",
    summary: "Adjust voice, empathy, and audience alignment without losing meaning.",
    description:
      "Tone Tuner helps you modulate register, warmth, and authority so the same message resonates across different audiences.",
    focusAreas: ["Voice", "Audience awareness", "Clarity"],
    samplePrompts: [
      "Rewrite this status update for an executive audience.",
      "Soften this bug report without hiding the urgency.",
    ],
    estimatedMinutes: 6,
  },
  {
    id: "precision-polish",
    name: "Precision Polish",
    summary: "Tighten sentences, remove redundancy, and sharpen verbs.",
    description:
      "Reach for Precision Polish when a draft exists but still feels fuzzy. It focuses on sentence-level clarity and rhythm.",
    focusAreas: ["Editing", "Micro clarity", "Word choice"],
    samplePrompts: [
      "Trim this paragraph to keep only the essential details.",
      "Swap in more vivid verbs without inflating the tone.",
    ],
    estimatedMinutes: 5,
  },
  {
    id: "evidence-tester",
    name: "Evidence Tester",
    summary: "Stress-test claims and ensure supporting proof is explicit.",
    description:
      "Evidence Tester is useful when persuasive writing leans on facts. It surfaces weak assumptions and prompts for supporting detail.",
    focusAreas: ["Critical thinking", "Specificity", "Research"],
    samplePrompts: [
      "Interrogate the claims in this slide and suggest the missing data points.",
      "Flag any statements that require citations and propose supporting evidence.",
    ],
    estimatedMinutes: 7,
  },
  {
    id: "narrative-expander",
    name: "Narrative Expander",
    summary: "Develop vivid scenes and analogies to deepen storytelling.",
    description:
      "Narrative Expander helps transform skeletal drafts into engaging stories by layering sensory detail and connective tissue.",
    focusAreas: ["Storytelling", "Imagery", "Emotional pacing"],
    samplePrompts: [
      "Extend this anecdote with a concrete example that grounds the lesson.",
      "Add a metaphor that clarifies the technical concept for newcomers.",
    ],
    estimatedMinutes: 9,
  },
  {
    id: "brevity-forge",
    name: "Brevity Forge",
    summary: "Condense long-form writing while preserving intent and tone.",
    description:
      "Use Brevity Forge to practise ruthless prioritisation. It keeps the heart of your message intact while lowering cognitive load for readers.",
    focusAreas: ["Conciseness", "Message hierarchy", "Clarity"],
    samplePrompts: [
      "Compress this 400-word update into a 120-word briefing.",
      "Rewrite this onboarding email with a skim-friendly structure.",
    ],
    estimatedMinutes: 6,
  },
] as const satisfies readonly WritingTool[];

export type WritingToolId = (typeof WRITING_TOOLS)[number]["id"];

export const WRITING_TOOL_MAP: Readonly<Record<WritingToolId, WritingTool>> =
  WRITING_TOOLS.reduce(
    (accumulator, tool) => ({ ...accumulator, [tool.id]: tool }),
    {} as Record<WritingToolId, WritingTool>
  );
