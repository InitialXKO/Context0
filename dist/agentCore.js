"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentCore = void 0;
class AgentCore {
    constructor(contextManager, offloadingManager) {
        this.contextManager = contextManager;
        this.offloadingManager = offloadingManager;
        this.injectedPromptTemplate = ""; // Initialize with an empty string or a default value
        this.summarizationPromptTemplate = "";
        this.keywordExtractionPromptTemplate = "";
    }
    async executeTask(task) {
        console.log(`Executing task: ${task}`);
        // Automated context retrieval before executing the task
        const relevantContexts = this.offloadingManager.searchByKeywords(task.split(' ')); // Simple keyword split for demo
        if (relevantContexts.length > 0) {
            console.log('Retrieved relevant contexts:', relevantContexts.map(c => c.marker));
            // In a real scenario, the agent would use these contexts to inform its task execution
        }
        // Note: Content offloading is handled manually by the AI through MCP tools when topic changes are detected
        // Save the task as a context
        await this.contextManager.saveContext("last_task", task);
        return `Task "${task}" executed successfully and saved as 'last_task' context.`;
    }
    getOffloadingManager() {
        return this.offloadingManager;
    }
    setInjectedPromptTemplate(template) {
        this.injectedPromptTemplate = template;
    }
    getInjectedPromptTemplate() {
        return this.injectedPromptTemplate;
    }
    setSummarizationPromptTemplate(template) {
        this.summarizationPromptTemplate = template;
    }
    getSummarizationPromptTemplate() {
        return this.summarizationPromptTemplate;
    }
    setKeywordExtractionPromptTemplate(template) {
        this.keywordExtractionPromptTemplate = template;
    }
    getKeywordExtractionPromptTemplate() {
        return this.keywordExtractionPromptTemplate;
    }
    getContextManager() {
        return this.contextManager;
    }
}
exports.AgentCore = AgentCore;
