export type ToolExample = {
  title: string;
  description: string;
  code: string;
  explanation: string;
};

export type ToolDefinition = {
  id: string;
  name: string;
  summary: string;
  description: string;
  mnemonic: string;
  cta: {
    label: string;
    href: string;
  };
  tags: string[];
  callouts: string[];
  tips: string[];
  successExample: ToolExample;
  failureExample: ToolExample;
  relatedIds: string[];
};

const DOCS_BASE = "https://github.com/modelcontextprotocol";

export const toolDefinitions: ToolDefinition[] = [
  {
    id: "load-context",
    name: "loadContext",
    summary: "Restore a saved workspace snapshot before resuming a conversation or task.",
    description:
      "Always rehydrate long-running work streams with `loadContext` so the agent reasons over the same persisted facts the user expects. It prevents stale assumptions and keeps the experience deterministic.",
    mnemonic: "Load before you leap — hydrate context before you mutate it.",
    cta: {
      label: "Load Context tool contract",
      href: `${DOCS_BASE}/sdk/tree/main#loadcontext`,
    },
    tags: ["context hydration", "state recovery", "critical path"],
    callouts: [
      "Call immediately after a user requests to pick up a saved ticket, escalation, or sprint thread.",
      "Pair with `searchSegments` when you discover an exact match you want to reopen in full.",
      "Keeps downstream saves aligned with the user's canonical snapshot.",
    ],
    tips: [
      "Echo a concise recap of the loaded data so the user can confirm it matches their expectation.",
      "Handle missing contexts gracefully by offering to run `searchSegments` or start a new workspace.",
      "Use human-readable identifiers such as `project-omega:sprint-review` to make future retrieval intuitive.",
    ],
    successExample: {
      title: "Rehydrate a roadmap review before planning",
      description:
        "The agent reloads the roadmap snapshot before calculating new priorities, guaranteeing that the same backlog items are in scope.",
      code: `const loadResult = await client.callTool("loadContext", {
  name: "product-roadmap:q3-refresh",
});

const restoredContext = JSON.parse(loadResult.content[0].text);
await summarizeRestoredState(restoredContext);
`,
      explanation:
        "By loading the context first, the agent reasons over the authoritative backlog rather than relying on memory or stale summaries.",
    },
    failureExample: {
      title: "Skipping load before mutating state",
      description:
        "The agent assumes prior state is still in memory and writes updates that silently diverge from what was last persisted.",
      code: `// ⚠️ Context never restored — mutations operate on stale assumptions
await planSprint(backlogFromMemory);
await client.callTool("saveContext", {
  name: "product-roadmap:q3-refresh",
  content: JSON.stringify(backlogFromMemory),
});
`,
      explanation:
        "Without loading first, the agent risks overwriting the canonical snapshot with partial or incorrect data.",
    },
    relatedIds: ["save-context", "retrieve-segment", "search-segments"],
  },
  {
    id: "save-context",
    name: "saveContext",
    summary: "Persist the current conversation state so it can be restored on demand.",
    description:
      "`saveContext` is the canonical persistence mechanism for long-running workstreams. Use it after major decision points or before pausing so the same state can be revived later with `loadContext`.",
    mnemonic: "Save when it matters — checkpoints make every future load reliable.",
    cta: {
      label: "Save Context documentation",
      href: `${DOCS_BASE}/sdk/tree/main#savecontext`,
    },
    tags: ["persistence", "checkpoint", "state management"],
    callouts: [
      "Create a fresh snapshot after synthesizing feedback or finishing a milestone.",
      "Store concise JSON so future tooling can diff or transform it easily.",
      "Log the timestamp of each save to help the user pick the right revision later.",
    ],
    tips: [
      "Include a `lastUpdatedAt` ISO timestamp and version number inside the payload.",
      "Keep the payload lean; move large transcripts to `offloadContent` and store references instead.",
      "Follow up the save with a short confirmation message describing what was persisted.",
    ],
    successExample: {
      title: "Checkpoint after consolidating sprint notes",
      description:
        "Once the agent has reconciled all sprint feedback, it captures a structured snapshot that can be reloaded tomorrow.",
      code: `await client.callTool("saveContext", {
  name: "product-roadmap:q3-refresh",
  content: JSON.stringify({
    backlog: prioritizedBacklog,
    summary: sprintSummary,
    lastUpdatedAt: new Date().toISOString(),
  }),
});
`,
      explanation:
        "The serialized JSON is explicit, versioned, and ready for the next work session to hydrate without guesswork.",
    },
    failureExample: {
      title: "Saving an ambiguous, unstructured blob",
      description:
        "The agent stores a narrative paragraph that future sessions cannot parse or validate.",
      code: `await client.callTool("saveContext", {
  name: "product-roadmap:q3-refresh",
  content: "We talked about several roadmap items and will follow up soon.",
});
`,
      explanation:
        "Natural language blobs make it impossible to reload the state faithfully and introduce ambiguity into later sessions.",
    },
    relatedIds: ["load-context", "offload-content", "execute-task"],
  },
  {
    id: "execute-task",
    name: "executeTask",
    summary: "Run a provider task through ContextProxy with automatic prompt injection and offloading support.",
    description:
      "Always call `executeTask` instead of bypassing the proxy when you need the provider to see injected prompts, summaries, or auto-offloading. It keeps context boundaries enforced and ensures overflows are captured in managed segments.",
    mnemonic: "Execute through the proxy so the guardrails stay intact.",
    cta: {
      label: "Execute Task reference",
      href: `${DOCS_BASE}/sdk/tree/main#executetask`,
    },
    tags: ["context proxy", "provider call", "automation"],
    callouts: [
      "Use when producing long-form deliverables that rely on injected context.",
      "Required for tasks that might trigger automatic offloading due to large outputs.",
      "Wraps provider errors so retry logic stays consistent.",
    ],
    tips: [
      "Serialize the task instructions clearly and include any context IDs you plan to reference.",
      "Inspect the returned text for proxy annotations that indicate offloaded segments.",
      "Log the injected request while debugging so you can confirm the right summaries were applied.",
    ],
    successExample: {
      title: "Draft release notes with injected backlog context",
      description:
        "The agent routes the summarization request through ContextProxy so the backlog snapshot is automatically included.",
      code: `const task = `Summarize the latest sprint outcomes using the restored backlog.\nHighlight blockers, shipped items, and next steps.`;

const result = await client.callTool("executeTask", { task });
await presentReleaseNotes(result.content[0].text);
`,
      explanation:
        "The proxy handles prompt injection and offloading, so the agent receives a complete answer without manual bookkeeping.",
    },
    failureExample: {
      title: "Bypassing ContextProxy with a direct provider call",
      description:
        "The agent calls the provider directly, losing injected context and skipping mandatory offloading policies.",
      code: `// ⚠️ Direct provider call ignores ContextProxy guardrails
const rawResponse = await provider.complete({
  prompt: "Summarize sprint status",
});
`,
      explanation:
        "By skipping `executeTask`, the agent forfeits context injection, error handling, and automatic offloading.",
    },
    relatedIds: ["load-context", "offload-content", "save-context"],
  },
  {
    id: "offload-content",
    name: "offloadContent",
    summary: "Summarize and archive chunks of conversation to control token usage while keeping them discoverable.",
    description:
      "Use `offloadContent` whenever a discussion segment concludes or the topic shifts. Supplying a rich summary and keywords keeps the content searchable via `searchSegments` and linkable through `retrieveSegment` or `retrieveWithDemand`.",
    mnemonic: "Offload when you overflow — summaries keep the trail intact.",
    cta: {
      label: "Offload Content workflow",
      href: `${DOCS_BASE}/sdk/tree/main#offloadcontent`,
    },
    tags: ["memory management", "summaries", "segments"],
    callouts: [
      "Archive verbose discussions right after you complete them to free up tokens.",
      "Provide parent-child relationships when breaking down large initiatives.",
      "Reference the returned marker in subsequent responses so the user can retrieve details on demand.",
    ],
    tips: [
      "Keep summaries crisp (2–3 sentences) and include unique nouns or metrics.",
      "Limit keywords to 3–5 high-signal terms separated by commas.",
      "Stitch related segments together by passing the parent segment ID.",
    ],
    successExample: {
      title: "Archive a completed architecture deep-dive",
      description:
        "After finalizing the architecture discussion, the agent offloads the transcript with a summary and keywords for future retrieval.",
      code: `const segment = await client.callTool("offloadContent", {
  content: architectureTranscript,
  parentId: "initiative:edge-gateway",
  summary: "Decided on event-driven gateway with circuit breakers for partner traffic.",
  keywords: ["edge gateway", "event-driven", "circuit breaker"],
});

await acknowledgeOffload(segment.content?.[0]?.text);
`,
      explanation:
        "The segment is now searchable and linked to its parent initiative, so future sessions can recover the deep dive without token pressure.",
    },
    failureExample: {
      title: "Offloading without summary or keywords",
      description:
        "The agent attempts to offload raw text but omits the required metadata, making the segment impossible to index.",
      code: `await client.callTool("offloadContent", {
  content: architectureTranscript,
  summary: "",
  keywords: [],
});
`,
      explanation:
        "Missing summaries and keywords violate the contract and leave the archive unusable for later retrieval.",
    },
    relatedIds: ["search-segments", "retrieve-with-demand", "save-context"],
  },
  {
    id: "retrieve-segment",
    name: "retrieveSegment",
    summary: "Fetch a previously offloaded segment when you have its exact identifier.",
    description:
      "Use `retrieveSegment` when the user or workflow provides a concrete segment ID (often from a prior `offloadContent` call). It returns the full payload so you can quote, summarize, or build upon the archived material.",
    mnemonic: "Retrieve by ID when you already hold the breadcrumb.",
    cta: {
      label: "Retrieve Segment guide",
      href: `${DOCS_BASE}/sdk/tree/main#retrievesegment`,
    },
    tags: ["segment recall", "archive", "precision"],
    callouts: [
      "Perfect for revisiting design decisions captured during deep dives.",
      "Use after the user references a marker shared in a previous response.",
      "A great follow-up to `searchSegments` when the search result includes an ID you want to open.",
    ],
    tips: [
      "Wrap large bodies of retrieved text in collapsible sections or summaries before echoing everything back.",
      "Keep track of the segment's `marker` so you can reference it in the conversation narrative.",
      "If the ID is invalid, suggest running `searchSegments` with the original keywords to rediscover it.",
    ],
    successExample: {
      title: "Retrieve the architecture decision referenced by the user",
      description:
        "The agent pulls the exact segment to quote the final decision verbatim.",
      code: `const segment = await client.callTool("retrieveSegment", {
  id: "seg_01HZYTN556B4J9V9AJ",
});

const detail = JSON.parse(segment.content[0].text);
await highlightDecision(detail);
`,
      explanation:
        "Having the full payload lets the agent cite facts accurately and maintain trust.",
    },
    failureExample: {
      title: "Guessing at segment IDs",
      description:
        "The agent fabricates an ID instead of confirming it, leading to a confusing not-found error.",
      code: `await client.callTool("retrieveSegment", {
  id: "maybe-this-id",
});
`,
      explanation:
        "Speculative IDs degrade confidence. Always confirm or fall back to `searchSegments`.",
    },
    relatedIds: ["search-segments", "retrieve-with-demand", "load-context"],
  },
  {
    id: "retrieve-with-demand",
    name: "retrieveWithDemand",
    summary: "Recover offloaded segments while specifying how much detail you need.",
    description:
      "`retrieveWithDemand` augments direct retrieval with a demand level so you can request high, medium, or low fidelity. It's ideal when you know the segment but want the proxy to tailor how much content is returned.",
    mnemonic: "Match demand to detail — pull only what the current step needs.",
    cta: {
      label: "Demand-level retrieval",
      href: `${DOCS_BASE}/sdk/tree/main#retrievewithdemand`,
    },
    tags: ["adaptive recall", "demand levels", "efficiency"],
    callouts: [
      "Ask for `low` when you just need a refresher summary to stay within token limits.",
      "Use `high` during forensic reviews where every nuance matters.",
      "Great for preparing briefing notes without overwhelming the user.",
    ],
    tips: [
      "Align the demand level with the user's stated goal to avoid over-fetching.",
      "Fall back to `retrieveSegment` if you truly need the raw payload without filtering.",
      "Record the level you used so later steps understand the fidelity of the information.",
    ],
    successExample: {
      title: "Pull a medium-fidelity briefing",
      description:
        "The agent requests a mid-level summary to craft executive talking points without flooding the conversation.",
      code: `const recap = await client.callTool("retrieveWithDemand", {
  id: "seg_01HZYTN556B4J9V9AJ",
  demandLevel: "medium",
});

await shareRecap(recap.content[0].text);
`,
      explanation:
        "Choosing the medium level balances coverage with brevity, keeping the transcript lean.",
    },
    failureExample: {
      title: "Always requesting high fidelity",
      description:
        "The agent habitually requests `high` even for lightweight follow-ups, wasting tokens and attention.",
      code: `await client.callTool("retrieveWithDemand", {
  id: "seg_01HZYTN556B4J9V9AJ",
  demandLevel: "high",
});
// Later in the flow we only needed a headline.
`,
      explanation:
        "Matching demand to the task avoids unnecessary verbosity and keeps conversations efficient.",
    },
    relatedIds: ["retrieve-segment", "search-segments", "offload-content"],
  },
  {
    id: "search-segments",
    name: "searchSegments",
    summary: "Discover relevant archived segments by searching over their keywords.",
    description:
      "When you don't know the exact segment ID, use `searchSegments` with 2–5 high-signal keywords. It returns candidates ranked by relevance so you can decide which ones to retrieve in full.",
    mnemonic: "Search first when the breadcrumb is fuzzy.",
    cta: {
      label: "Segment search walkthrough",
      href: `${DOCS_BASE}/sdk/tree/main#searchsegments`,
    },
    tags: ["discovery", "keywords", "navigation"],
    callouts: [
      "Great as the first step when a user references earlier work without a marker.",
      "Feed the results straight into `retrieveSegment` once you pick the right ID.",
      "Also useful for validating that your `offloadContent` keywords are behaving as expected.",
    ],
    tips: [
      "Combine nouns, owners, and timeframes in your keyword list for strong matches.",
      "Start with 3 keywords, then expand if the initial search is too narrow.",
      "Summarize the top result set back to the user so they can choose the best candidate.",
    ],
    successExample: {
      title: "Locate the latest architecture recap",
      description:
        "The agent searches using the initiative name, topic, and decision type to surface the relevant segments.",
      code: `const matches = await client.callTool("searchSegments", {
  keywords: ["edge gateway", "decision", "q2"],
});

await suggestCandidates(matches.content[0].text);
`,
      explanation:
        "Focused keywords surface the right candidates quickly, enabling fast follow-up with targeted retrieval calls.",
    },
    failureExample: {
      title: "Using vague, catch-all keywords",
      description:
        "The agent searches for generic terms that match dozens of segments, creating noise instead of clarity.",
      code: `await client.callTool("searchSegments", {
  keywords: ["update", "meeting", "notes"],
});
`,
      explanation:
        "Overly broad keywords bury the relevant signal. Pick precise nouns and qualifiers to guide retrieval.",
    },
    relatedIds: ["retrieve-segment", "offload-content", "load-context"],
  },
];

const toolMap = new Map<string, ToolDefinition>(
  toolDefinitions.map((tool) => [tool.id, tool])
);

export function getToolById(id: string): ToolDefinition | undefined {
  return toolMap.get(id);
}

export function getRelatedTools(
  current: ToolDefinition,
  limit = 3
): ToolDefinition[] {
  const explicit = current.relatedIds
    .map((id) => toolMap.get(id))
    .filter((tool): tool is ToolDefinition => Boolean(tool));

  const results: ToolDefinition[] = [];
  const seen = new Set<string>();

  for (const tool of explicit) {
    if (results.length >= limit) break;
    results.push(tool);
    seen.add(tool.id);
  }

  if (results.length >= limit) {
    return results.slice(0, limit);
  }

  seen.add(current.id);

  const scored = toolDefinitions
    .filter((tool) => !seen.has(tool.id))
    .map((tool) => ({
      tool,
      overlap: tool.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return (
        toolDefinitions.findIndex((item) => item.id === a.tool.id) -
        toolDefinitions.findIndex((item) => item.id === b.tool.id)
      );
    })
    .map(({ tool }) => tool);

  for (const tool of scored) {
    results.push(tool);
    if (results.length >= limit) break;
  }

  return results;
}

export const toolIds = toolDefinitions.map((tool) => tool.id);
