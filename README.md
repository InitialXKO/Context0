# Context0 MCP Service

Context0 is a Model Context Protocol (MCP) service that orchestrates long-running AI tasks by managing conversational context, performing hierarchical offloading of oversized conversations, and proxying requests to AI providers. The service exposes a collection of MCP tools for saving, loading, deleting, and searching contextual data while automatically persisting the information to disk.

This repository now includes integration and end-to-end validation utilities so the service can be exercised in automation as part of production readiness checks.

## Features

- **Context persistence** powered by `ContextManager`, ensuring conversational state survives process restarts.
- **Segmented offloading** via `OffloadingManager`, splitting oversized conversations into hierarchical segments with metadata for efficient retrieval.
- **Context-aware execution** driven by `AgentCore`, which coordinates context lookups and task execution hooks.
- **Proxy middleware** implemented in `ContextProxy` for request injection, automatic offloading on provider failures, and tool-call response shaping.
- **Automated test harness** (see `tests/`) covering integration flows and golden-path end-to-end scenarios.

## Getting Started

```bash
# install dependencies
npm install

# compile TypeScript sources	npm run build

# start the MCP stdio server (after building)
npm start
```

The service listens for stdio connections and registers the MCP tools defined in `src/index.ts`. Clients such as Claude Desktop or custom MCP adapters can connect to the compiled service in `dist/index.js`.

## Running Tests

Automated verification is split into two suites that execute against the compiled JavaScript output in `dist/`:

```bash
npm test
```

This command compiles the project and runs:

- **Integration suite** – exercises `ContextManager`, `OffloadingManager`, and `AgentCore` together to validate persistence, segmentation, keyword search, and retrieval behaviors.
- **End-to-end suite** – drives `ContextProxy` with mocked provider responses to confirm auto-offloading, retry logic, and persisted metadata for long conversational histories.

The test harness is intentionally dependency-free and relies on Node's standard library, making it suitable for CI pipelines and constrained deployment environments.

## Project Structure

```
contexts/                  Persistent JSON stores written by ContextManager
src/                       TypeScript source for context orchestration
  agentCore.ts             Core execution engine coordinating context tools
  contextManager.ts        Local persistence layer with pluggable directories
  offloadingManager.ts     Segment management, keyword search, demand retrieval
  contextProxy.ts          MCP middleware for injection/offloading and retries
  index.ts                 MCP stdio server entry point registering tools
  __tests__/               (compiled output only) — see tests/ for sources

tests/                     Lightweight Node-based test harness
  helpers/                 Shared helpers for isolated test environments
  integration.test.js      Integration coverage for context + offloading flow
  e2e.test.js              End-to-end proxy validation with retry semantics
  run-tests.js             Entry point executed by `npm test`
```

## Documentation

Additional documentation lives at the repository root:

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) – detailed component responsibilities and data flow.
- [`TESTING.md`](./TESTING.md) – integration, E2E, performance, accessibility, and UAT readiness plans.

These resources capture the production readiness guidelines, test matrices, and operational playbooks required for deployment on Vercel or equivalent environments.

## Contributing

1. Create a feature branch from `test-integration-e2e-prod-readiness`.
2. Implement changes following the existing TypeScript patterns and style.
3. Run `npm test` to ensure automated checks pass.
4. Submit your changes for review with links to relevant documentation or reports.

## License

This project is licensed under the ISC License. See `LICENSE` for details.
