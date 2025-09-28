"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const contextManager_js_1 = require("./contextManager.js");
const agentCore_js_1 = require("./agentCore.js");
const offloadingManager_js_1 = require("./offloadingManager.js"); // 导入 OffloadingManager
const contextProxy_js_1 = require("./contextProxy.js"); // 导入 ContextProxy
const fs = __importStar(require("fs")); // 导入 fs 模块
const path = __importStar(require("path")); // 导入 path 模块
// 读取配置文件
const configPath = path.join(process.cwd(), 'src', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const server = new mcp_js_1.McpServer({
    name: "Context0",
    version: "1.0.0",
});
const contextManager = new contextManager_js_1.ContextManager();
const offloadingManager = new offloadingManager_js_1.OffloadingManager(contextManager); // 初始化 OffloadingManager
const agentCore = new agentCore_js_1.AgentCore(contextManager, offloadingManager); // 传入 offloadingManager
agentCore.setInjectedPromptTemplate(config.injectedPromptTemplate);
agentCore.setSummarizationPromptTemplate(config.summarizationPromptTemplate);
agentCore.setKeywordExtractionPromptTemplate(config.keywordExtractionPromptTemplate);
const contextProxy = new contextProxy_js_1.ContextProxy(server, agentCore); // 初始化 ContextProxy
server.registerTool("listContexts", {
    title: "List Contexts",
    description: "Lists all available contexts.",
    inputSchema: zod_1.z.object({}).shape,
}, async () => {
    const contexts = await contextManager.listContexts();
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(contexts, null, 2),
            },
        ],
    };
});
server.registerTool("loadContext", {
    title: "Load Context",
    description: "当 AI 代理需要恢复一个之前通过 `saveContext` 保存的特定上下文时，**必须**使用此工具。此操作是 MCP 协议强制的上下文恢复机制，确保 AI 代理能够基于准确的历史状态继续工作。",
    inputSchema: zod_1.z.object({ name: zod_1.z.string() }).shape,
}, async ({ name }) => {
    const context = await contextManager.loadContext(name);
    if (context) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(context, null, 2),
                },
            ],
        };
    }
    else {
        return {
            content: [
                {
                    type: "text",
                    text: `Context '${name}' not found.`,
                },
            ],
        };
    }
});
server.registerTool("saveContext", {
    title: "Save Context",
    description: "当 AI 代理需要持久化重要的对话状态或任务相关信息，以便后续精确加载时，**必须**使用此工具。此操作是 MCP 协议强制的上下文保存机制，确保关键上下文不会丢失，并可在需要时通过 `loadContext` 精确恢复。",
    inputSchema: zod_1.z.object({ name: zod_1.z.string(), content: zod_1.z.string() }).shape,
}, async ({ name, content }) => {
    await contextManager.saveContext(name, content);
    return {
        content: [
            {
                type: "text",
                text: `Context '${name}' saved.`,
            },
        ],
    };
});
server.registerTool("deleteContext", {
    title: "Delete Context",
    description: "Deletes a specific context by name.",
    inputSchema: zod_1.z.object({ name: zod_1.z.string() }).shape,
}, async ({ name }) => {
    await contextManager.deleteContext(name);
    return {
        content: [
            {
                type: "text",
                text: `Context '${name}' deleted.`,
            },
        ],
    };
});
server.registerTool("executeTask", {
    title: "Execute Task",
    description: "Executes a given task.",
    inputSchema: zod_1.z.object({ task: zod_1.z.string() }).shape,
}, async ({ task }) => {
    // 模拟 AI 提供商的调用
    const aiProviderCall = async (injectedRequest) => {
        console.log(`Simulating AI Provider call with: ${injectedRequest}`);
        // 实际的 AI 提供商调用逻辑会在这里
        // 为了演示，我们直接使用 agentCore.executeTask
        return agentCore.executeTask(injectedRequest);
    };
    // 通过 ContextProxy 处理请求
    const processedResponse = await contextProxy.processRequest(task, aiProviderCall);
    // 假设 processedResponse 包含了最终的 AI 响应，可能已经包含了上下文卸载信息
    return {
        content: [
            {
                type: "text",
                text: `Task executed via ContextProxy: ${processedResponse}`,
            },
        ],
    };
});
server.registerTool("offloadContent", {
    title: "Offload Content",
    description: "当 AI 代理检测到对话主题发生变化，或当前对话段落已结束且其内容需要被归档以避免上下文污染时，**必须**使用此工具将当前内容进行总结并卸载。此操作是 MCP 协议强制的上下文管理流程的一部分，旨在确保历史上下文的有效管理和检索。`parentId` 可用于维护上下文的层级关系。调用时必须提供summary和keywords。",
    inputSchema: zod_1.z.object({
        content: zod_1.z.string(),
        parentId: zod_1.z.string().optional(),
        summary: zod_1.z.string(),
        keywords: zod_1.z.array(zod_1.z.string())
    }).shape,
    outputSchema: zod_1.z.object({
        offloadedSegmentId: zod_1.z.string().optional(),
        status: zod_1.z.enum(["success", "failed", "partial"]),
        message: zod_1.z.string().optional(),
        newContextReference: zod_1.z.string().optional(),
    }).shape,
}, async ({ content, parentId, summary, keywords }) => {
    let toolCallResult;
    try {
        const segment = await agentCore.getOffloadingManager().offloadContent(content, parentId, summary, keywords);
        toolCallResult = {
            offloadedSegmentId: segment.id,
            status: "success",
            message: `Content successfully offloaded with ID: ${segment.id}`,
            newContextReference: segment.marker,
        };
    }
    catch (error) {
        toolCallResult = {
            offloadedSegmentId: undefined,
            status: "failed",
            message: `Failed to offload content: ${error.message || error}`,
            newContextReference: undefined,
        };
    }
    // 模拟原始 AI 响应，这里我们假设 offloadContent 是一个独立的工具调用，没有原始 AI 响应
    const originalAIResponse = "";
    const finalResponse = await contextProxy.handleToolCallResult(originalAIResponse, toolCallResult);
    return {
        content: [
            {
                type: "text",
                text: finalResponse,
            },
        ],
    };
});
server.registerTool("retrieveSegment", {
    title: "Retrieve Segment",
    description: "当 AI 代理需要检索一个特定的、之前卸载的上下文片段时，**必须**使用此工具。这通常在我通过 `searchSegments` 找到相关片段的 ID 后进行。此操作是 MCP 协议强制的上下文检索机制。",
    inputSchema: zod_1.z.object({ id: zod_1.z.string() }).shape,
}, async ({ id }) => {
    const segment = agentCore.getOffloadingManager().retrieveById(id);
    if (segment) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(segment, null, 2),
                },
            ],
        };
    }
    else {
        return {
            content: [
                {
                    type: "text",
                    text: `Segment '${id}' not found.`,
                },
            ],
        };
    }
});
server.registerTool("retrieveWithDemand", {
    title: "Retrieve with Demand Level",
    description: "当 AI 代理需要根据指定的需求级别检索上下文时，**必须**使用此工具。此操作是 MCP 协议强制的上下文检索机制，允许 AI 代理根据相关性或重要性获取上下文。",
    inputSchema: zod_1.z.object({ id: zod_1.z.string(), demandLevel: zod_1.z.enum(["high", "medium", "low"]) }).shape,
}, async ({ id, demandLevel }) => {
    const result = agentCore.getOffloadingManager().retrieveWithDemandLevel(id, demandLevel);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(result, null, 2),
            },
        ],
    };
});
server.registerTool("searchSegments", {
    title: "Search Segments",
    description: "当 AI 代理需要根据关键词动态地查找相关的历史上下文片段时，**必须**使用此工具。此工具是 MCP 协议强制的上下文检索机制，对于在不确定具体上下文 ID 的情况下重新发现相关信息至关重要。",
    inputSchema: zod_1.z.object({ keywords: zod_1.z.array(zod_1.z.string()) }).shape,
}, async ({ keywords }) => {
    const segments = agentCore.getOffloadingManager().searchByKeywords(keywords);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(segments, null, 2),
            },
        ],
    };
});
(async () => {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
})();
