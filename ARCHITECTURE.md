# Architecture Overview

Context0 is composed of four primary subsystems that collaborate to provide context-aware task execution for MCP-compatible clients.

## High-Level Diagram

```
┌────────────────────┐      ┌──────────────────┐      ┌────────────────────┐
│    MCP Clients     │◄────►│    ContextProxy  │◄────►│     AgentCore       │
└────────────────────┘      └──────────────────┘      └─────────┬──────────┘
                                                             │
                                                             ▼
                                              ┌────────────────────────────┐
                                              │      OffloadingManager     │
                                              └───────────┬────────────────┘
                                                          │
                                                          ▼
                                              ┌────────────────────────────┐
                                              │       ContextManager       │
                                              │  (file-system persistence) │
                                              └────────────────────────────┘
```

## Component Responsibilities

### ContextManager
- Persists and retrieves raw context payloads as JSON files.
- Guarantees directory availability through lazy initialization and exposes helper accessors for downstream tooling.
- Used by both `AgentCore` and `OffloadingManager` for durable storage of conversation snapshots and segment trees.

### OffloadingManager
- Splits incoming content into manageable segments with metadata (summary, keywords, markers, parent/child references).
- Persists the hierarchical representation into the internal context store (`agent_internal_context.json`).
- Supports multiple retrieval strategies:
  - Direct lookup by ID or recursive traversal.
  - Demand-based retrieval (`high`, `medium`, `low` granularity).
  - Keyword search and partial sentence extraction for targeted resurfacing.
- Emits deterministic IDs to maintain traceable parent/child relationships.

### AgentCore
- Coordinates high-level task execution, including automatic keyword searches prior to task handling and persistence of the most recent task payload.
- Exposes prompt template setters used by `ContextProxy` for request injection and metadata generation.
- Provides access to `OffloadingManager` so context-aware tooling can be invoked from MCP handlers.

### ContextProxy
- Acts as a middleware layer between MCP clients and upstream AI providers.
- Injects guardrail instructions into outbound requests based on templates supplied by `AgentCore`.
- Detects rate limiting or server errors and automatically offloads oversized history segments, retrying with a trimmed payload.
- Formats tool-call responses to combine raw provider output with contextual summaries.

## Data Persistence Model

- All persisted artifacts live under a configurable root directory (default: `<project root>/contexts`).
- `ContextManager` saves each named context as `<name>.json` using UTF-8 encoding.
- `OffloadingManager` maintains an in-memory map of `ContextSegment` entries keyed by segment ID and writes the entire map to `agent_internal_context.json` after every mutation.
- Segments include:
  - `id`, `marker`, `full_content`
  - Optional `parent_id`
  - `child_references` (array of marker/ID pairs)
  - Optional `summary`, `keywords`, `is_continuation_segment`

## Error Handling & Resilience

- Directory creation failures bubble to constructors to prevent silent misconfiguration.
- Offloading validates parent relationships before writing segments, preventing orphaned references.
- ContextProxy retries requests only when upstream errors coincide with large context payloads (> ~2 KB) to avoid unnecessary offloading.

## Extensibility Points

- **Custom Storage**: supply `ContextManager` with a different `rootDir` or `contextsDir` to redirect persistence to another filesystem or mounted volume.
- **Segmentation Policies**: adjust `MAX_SEGMENT_CONTENT_LENGTH` and `generateMarker` heuristics to better match provider token budgets.
- **MCP Tools**: extend `src/index.ts` with new tool registrations that leverage `AgentCore` or `OffloadingManager` primitives.
- **Proxy Behaviors**: enhance `ContextProxy` to support streaming providers, additional retry heuristics, or analytics hooks.

## Build & Deployment

1. Compile TypeScript to CommonJS: `npm run build`.
2. Launch the stdio MCP server: `npm start`.
3. Deploy to environments (e.g., Vercel Edge Functions) that can execute Node.js binaries with stdio bindings.

Configuration templates (summaries, keyword extraction prompts, etc.) are stored in `src/config.json` and can be tuned without recompiling the service.

## Testing Strategy

See [`TESTING.md`](./TESTING.md) for exhaustive integration, end-to-end, performance, accessibility, and UAT plans supporting production readiness.
