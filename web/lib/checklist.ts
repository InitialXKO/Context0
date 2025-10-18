export type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
};

export type ChecklistSection = {
  id: string;
  title: string;
  hint?: string;
  items: ChecklistItem[];
};

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: "pre-brief",
    title: "Pre-brief essentials",
    hint: "Ground yourself before the simulated encounter begins.",
    items: [
      { id: "pre-brief-review-objectives", label: "Review scenario objectives" },
      { id: "pre-brief-patient-profile", label: "Confirm patient profile & vitals" },
      { id: "pre-brief-equipment", label: "Stage required equipment & meds" }
    ]
  },
  {
    id: "intake",
    title: "Patient intake",
    hint: "Set the tone and capture critical history.",
    items: [
      { id: "intake-introduce", label: "Introduce yourself & confirm patient identity" },
      { id: "intake-chief-complaint", label: "Clarify chief complaint with open-ended question" },
      { id: "intake-history", label: "Run targeted past medical history" },
      { id: "intake-allergies", label: "Document allergies and intolerances" }
    ]
  },
  {
    id: "assessment",
    title: "Focused assessment",
    hint: "Collect the right data to inform your differential.",
    items: [
      { id: "assessment-vitals", label: "Capture complete vital set" },
      { id: "assessment-focused-exam", label: "Perform focused physical exam" },
      { id: "assessment-risk", label: "Screen for red flags & risk modifiers" }
    ]
  },
  {
    id: "plan",
    title: "Care plan",
    hint: "Translate findings into a confident management plan.",
    items: [
      { id: "plan-differential", label: "List working differential" },
      { id: "plan-orders", label: "Order key diagnostics or therapeutics" },
      { id: "plan-education", label: "Deliver patient education & follow-up" },
      { id: "plan-sbar", label: "Prepare concise SBAR briefing" }
    ]
  }
];

export const checklistItemIds = CHECKLIST_SECTIONS.flatMap((section) => section.items.map((item) => item.id));
