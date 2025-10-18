const assert = require("assert/strict");
const { createIsolatedEnvironment } = require("./helpers/testUtils");

const { ContextManager } = require("../dist/contextManager");
const { OffloadingManager } = require("../dist/offloadingManager");
const { AgentCore } = require("../dist/agentCore");
const { ContextProxy } = require("../dist/contextProxy");

async function runE2eTests() {
  const { tempRoot, cleanup } = createIsolatedEnvironment();
  const contextManager = new ContextManager({ rootDir: tempRoot });
  const offloadingManager = new OffloadingManager(contextManager);
  const agentCore = new AgentCore(contextManager, offloadingManager);
  agentCore.setInjectedPromptTemplate("<<context-injected>>");
  const proxy = new ContextProxy({}, agentCore);

  let callCount = 0;
  let sawAutoOffloadSummary = false;

  const historicalMessages = Array.from({ length: 5 }, (_, index) => ({
    role: "user",
    content: `Historical content ${index}: ` + "x".repeat(600),
  }));

  const payload = JSON.stringify({
    messages: [
      ...historicalMessages,
      {
        role: "user",
        content: "Fresh help request after long history",
      },
    ],
  });

  const aiProviderCall = async (injectedRequest) => {
    callCount += 1;
    if (callCount === 1) {
      const error = new Error("rate limited");
      error.response = { status: 429 };
      throw error;
    }

    const parsed = JSON.parse(injectedRequest);
    sawAutoOffloadSummary = parsed.messages.some(
      (message) =>
        message.role === "system" &&
        typeof message.content === "string" &&
        message.content.includes("auto-offloaded")
    );

    return JSON.stringify({ status: "ok" });
  };

  try {
    const response = await proxy.processRequest(payload, aiProviderCall);
    assert.ok(response.includes("status"));
    assert.equal(callCount, 2, "Proxy should retry once after encountering a rate limit error");
    assert.ok(sawAutoOffloadSummary, "Retry payload should include auto-offload summary context");

    const persisted = await contextManager.loadContext("agent_internal_context");
    assert.ok(persisted, "Auto-offloaded content should persist to the internal context store");
    const parsed = JSON.parse(persisted);
    const segments = Object.values(parsed);
    assert.ok(Array.isArray(segments) && segments.length > 0, "At least one segment should be stored");
    const autoSegment = segments.find(
      (segment) =>
        segment.summary &&
        typeof segment.summary === "string" &&
        segment.summary.startsWith("Auto-offloaded context")
    );
    assert.ok(autoSegment, "Auto-offload summary segment should exist");
    assert.ok(
      Array.isArray(autoSegment.keywords) &&
      autoSegment.keywords.includes("auto-offloaded"),
      "Auto-offload segment should include the expected keyword tag"
    );
  } finally {
    cleanup();
  }
}

module.exports = {
  runE2eTests,
};
