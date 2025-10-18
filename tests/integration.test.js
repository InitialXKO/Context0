const assert = require("assert/strict");
const { createIsolatedEnvironment } = require("./helpers/testUtils");

const { ContextManager } = require("../dist/contextManager");
const { OffloadingManager } = require("../dist/offloadingManager");
const { AgentCore } = require("../dist/agentCore");

async function runIntegrationTests() {
  const { tempRoot, cleanup } = createIsolatedEnvironment();
  const contextManager = new ContextManager({ rootDir: tempRoot });
  const offloadingManager = new OffloadingManager(contextManager);
  const agentCore = new AgentCore(contextManager, offloadingManager);

  try {
    const taskPayload = "Execute integration test workflow";
    const taskResult = await agentCore.executeTask(taskPayload);
    assert.ok(taskResult.includes("Task \""));

    const persistedTask = await contextManager.loadContext("last_task");
    assert.equal(persistedTask, taskPayload, "The last task context should persist the submitted task payload");

    const longContent = "Segment start. " + "A".repeat(4500);
    const summary = "Integration flow summary";
    const keywords = ["integration", "flow", "test"];

    const rootSegment = await offloadingManager.offloadContent(longContent, undefined, summary, keywords);
    assert.ok(rootSegment.id.startsWith("root_seg"));
    assert.equal(rootSegment.summary, summary);
    assert.deepEqual(rootSegment.keywords, keywords);
    assert.ok(Array.isArray(rootSegment.child_references));

    const persistedSegments = await contextManager.loadContext("agent_internal_context");
    assert.ok(persistedSegments, "Internal context should be persisted to disk");
    const parsedSegments = JSON.parse(persistedSegments);
    assert.ok(parsedSegments[rootSegment.id], "Root segment should exist in persisted context store");

    const keywordMatches = offloadingManager.searchByKeywords(["integration"]);
    assert.ok(keywordMatches.some((segment) => segment.id === rootSegment.id), "Keyword search should return the root segment");

    const highDemand = offloadingManager.retrieveWithDemandLevel(rootSegment.id, "high");
    assert.equal(highDemand.type, "full_recursive");
    assert.ok(highDemand.segments.length >= 1, "High demand retrieval should include at least the root segment");

    const lowDemand = offloadingManager.retrieveWithDemandLevel(rootSegment.id, "low");
    assert.equal(lowDemand.type, "parent_only");
    assert.equal(lowDemand.parent.id, rootSegment.id, "Low demand retrieval should return only the root segment");

    const partialMatches = offloadingManager.retrievePartialDetails(rootSegment.id, "Segment start");
    assert.ok(partialMatches.length >= 1, "Partial detail retrieval should locate the seeded phrase");
  } finally {
    cleanup();
  }
}

module.exports = {
  runIntegrationTests,
};
