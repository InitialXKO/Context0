# Testing & Production Readiness Plan

This document consolidates automated coverage, manual validation procedures, and reporting templates required to certify Context0 for production deployment. The plan aligns with the integration, end-to-end, and readiness requirements outlined in the ticket.

## 1. Automated Test Suites

| Suite | Location | Command | Coverage |
|-------|----------|---------|----------|
| Integration | `tests/integration.test.js` | `npm test` | Exercises `ContextManager`, `OffloadingManager`, and `AgentCore` together: persistence, segmentation, keyword search, partial retrieval, and demand-level reconstruction |
| End-to-End | `tests/e2e.test.js` | `npm test` | Drives `ContextProxy` with mocked AI provider responses: verifies retry logic, automatic offloading, and persisted metadata |

Execution notes:
- The harness compiles TypeScript before running (`npm run build`).
- Tests operate in isolated temporary directories via the new `ContextManager` configuration options to avoid polluting production data.
- Failures bubble with explicit assertions for fast diagnosis in CI.

## 2. Manual Integration Checklist

Although the UI-focused tasks from prior sprints are external to this MCP service, the following checks ensure data flows remain intact when paired with a frontend client:

- ✅ Local storage hooks (or equivalent client persistence) point to Context0 MCP tools and successfully share state across pages.
- ✅ `ProgressContext` (or analogous provider) fetches and updates persisted contexts through `listContexts`, `saveContext`, and `loadContext` tools.
- ✅ Constants referenced by UI modules (tools catalog, practice prompts) map to context IDs stored within the MCP backend.
- ✅ Route transitions trigger the expected MCP tool invocations without race conditions.

Document the outcome of each check in the deployment journal prior to release.

## 3. Performance & Lighthouse

| Metric | Target | Notes |
|--------|--------|-------|
| Performance | ≥ 90 | Validate using Lighthouse in Chrome DevTools on the integrated frontend consuming this service |
| Accessibility | ≥ 95 | Ensure ARIA labels, keyboard navigation, and semantic markup remain intact |
| Best Practices | ≥ 95 | Confirm HTTPS usage, third-party script hygiene, and asset optimization |
| SEO | ≥ 90 | Verify metadata, canonical URLs, and structured data |
| FCP | < 1.5 s | Prioritize hydration order and hero content loading |
| LCP | < 2.5 s | Optimize hero imagery and critical fonts |
| TTI | < 3.5 s | Confirm bundle splitting and lazy-loading strategies |
| CLS | < 0.1 | Guard against layout thrash, especially in context dashboards |

Checklist:
- [ ] All images leverage `next/image` (or optimized equivalents) with responsive sizing.
- [ ] Fonts are delivered via `next/font` or self-hosted CSS subsets.
- [ ] Code-splitting verified through Chrome DevTools → Network → Initiator.
- [ ] Lazy-loaded panels (dialogs, sheets) hydrate only on interaction.

Attach Lighthouse JSON/HTML exports to the release ticket.

## 4. Responsive & Cross-Device Validation

### Breakpoints

| Breakpoint | Status | Notes |
|------------|--------|-------|
| 375px (iPhone SE) | ☐ | Navigation, context drawers, and checklists remain accessible |
| 390px (iPhone 12) | ☐ | Test context switching and checklist toggles |
| 414px (iPhone Pro Max) | ☐ | Ensure framer-motion transitions remain smooth |
| 768px (iPad) | ☐ | Validate split-pane layouts and draggable tools |
| 1024px (iPad Pro) | ☐ | Confirm horizontal screen rotation retains context state |
| 1280px | ☐ | Desktop baseline |
| 1440px | ☐ | Large desktop |
| 1920px | ☐ | Wide desktop |

### Interaction Modes

- [ ] Touch gestures: draggable outline builder, mind-map interactions, checklist toggles.
- [ ] Keyboard navigation: tab order, enter/space activation for dialogs, escape to close overlays.
- [ ] Orientation changes: rotate devices and verify persistent context references.

### Browser Compatibility Matrix

| Browser | Latest | -1 | -2 | Notes |
|---------|--------|----|----|-------|
| Chrome / Edge | ☐ | ☐ | ☐ | Focus on MCP connection stability and localStorage sync |
| Firefox | ☐ | — | — | Validate context tool invocation via fetch-compatible API |
| Safari (macOS) | ☐ | — | — | Ensure stdio MCP client (if applicable) functions via desktop agent |
| Safari (iOS) | ☐ | — | — | Validate service-worker caching and offline recovery |
| Android Chrome | ☐ | — | — | Confirm context persistence under mobile data conditions |

Mark each cell as complete (☑) once verified.

## 5. Data Integrity & Stress Testing

Stress the JSON persistence layer and client integrations with the following cases:

- [ ] Store ≥ 50 practice records; monitor file growth and response time.
- [ ] Submit ≥ 5,000-character essays; confirm segmentation and retrieval succeed.
- [ ] Persist entries containing emojis, multilingual characters, and Markdown; verify JSON encoding/decoding.
- [ ] Exercise Incognito/Private mode to confirm graceful degradation when `localStorage` is unavailable (frontend responsibility) and contexts fallback to MCP persistence.
- [ ] Open multiple tabs; confirm the frontend synchronizes via MCP reloads or BroadcastChannel.
- [ ] Simulate `localStorage` quota exhaustion and ensure client surfaces actionable messaging while MCP storage still succeeds.
- [ ] Inject malformed JSON to `saveContext` to validate error handling and logging.

## 6. Accessibility (A11y)

- [ ] Run `axe DevTools` (or equivalent) against each critical page; resolve blockers.
- [ ] Validate with the WAVE browser extension for contrast and landmarks.
- [ ] Manually tab through dialogs, sheets, toasts, and tooltips; ensure focus trapping and return.
- [ ] Confirm all imagery and icons include descriptive `alt` text.
- [ ] Screen reader smoke test (VoiceOver, NVDA) for MCP-powered workflows, verifying context changes are announced appropriately.

Record findings and remediation steps in the accessibility audit log.

## 7. Content Verification

- [ ] Cross-check the seven-tool mnemonics, examples, and counterexamples against the latest curriculum draft.
- [ ] Ensure practice prompts align with the IDs served by `loadContext`/`saveContext` flows.
- [ ] Validate checklist copy for spelling, punctuation, and brand voice ("cto" lowercase, warm yellow / deep blue / light grey palette).
- [ ] Confirm asset availability (images, diagrams) referenced by the frontend.

## 8. Vercel Deployment Validation

| Item | Status | Notes |
|------|--------|-------|
| `vercel.json` configuration | ☐ | Routing, rewrites, edge function bindings |
| Environment variable inventory | ☐ | Document in README/ENV template |
| Build command / output directory | ☐ | Ensure `npm run build` and `dist/` alignment |
| Preview deployment smoke test | ☐ | Verify MCP connectivity and context persistence |
| Production deployment smoke test | ☐ | Validate end-to-end flows in production domain |
| Custom domain + HTTPS | ☐ | Confirm certificate status |
| CDN caching | ☐ | Validate cache headers and purge strategy |
| Edge function telemetry | ☐ | Test timeouts and rate limiting (if implemented) |

## 9. UAT Preparation

- Recruit 3–5 grade 6 students, 1–2 teachers, and 1 guardian for moderated sessions.
- Provide each tester with the following task list:
  - [ ] Complete a full learning flow (tool exploration → practice → progress review).
  - [ ] Identify confusing copy or unclear navigation.
  - [ ] Rate UI aesthetics and ease-of-use.
  - [ ] Suggest improvements.
- Collect feedback using a shared form containing:
  - Overall satisfaction rating (1–5).
  - Favourite feature.
  - Issues encountered (with reproduction steps).
  - Additional comments.

Aggregate findings into the release report before production deployment.

## 10. Reporting Deliverables

Deliver the following artefacts alongside each release candidate:

1. **Automated Test Report** – Console output from `npm test` plus contextual notes or screenshots (attach to ticket).
2. **Lighthouse Audit Exports** – JSON/HTML files stored in the release folder.
3. **Cross-Browser Matrix** – Updated table (above) with completion marks and issues logged.
4. **UAT Feedback Summary** – Consolidated document or spreadsheet with anonymized feedback and actions.
5. **Known Issues List** – Clearly stated limitations with severity/impact assessments.
6. **Production URL + Credentials** – Documented access information for stakeholders (store securely, not in git).

## 11. Known Issues & Follow-Up

- Automated tests currently target backend logic only. UI regression coverage must remain in the consuming frontend repository.
- `OffloadingManager` uses heuristic markers; consider integrating true summarization/keyword extraction services for richer retrieval quality.
- ContextProxy retry logic handles 429/500 statuses; extend to cover network-level timeouts as needed.

Maintain this document as a living artefact—update statuses, add screenshots, and attach supporting evidence as each validation step completes.
