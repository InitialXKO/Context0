import { ContextManager } from "./contextManager.js";
import { OffloadingManager } from "./offloadingManager.js";

export class AgentCore {
  private contextManager: ContextManager;
  private offloadingManager: OffloadingManager;
  private injectedPromptTemplate: string;
  private summarizationPromptTemplate: string; // 新增摘要提示模板属性
  private keywordExtractionPromptTemplate: string; // 新增关键词提取提示模板属性

  constructor(contextManager: ContextManager, offloadingManager: OffloadingManager) {
    this.contextManager = contextManager;
    this.offloadingManager = offloadingManager;
    this.injectedPromptTemplate = ""; // Initialize with an empty string or a default value
    this.summarizationPromptTemplate = "";
    this.keywordExtractionPromptTemplate = "";
  }

  async executeTask(task: string): Promise<string> {
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

  getOffloadingManager(): OffloadingManager {
    return this.offloadingManager;
  }

  setInjectedPromptTemplate(template: string) {
    this.injectedPromptTemplate = template;
  }

  getInjectedPromptTemplate(): string {
    return this.injectedPromptTemplate;
  }

  public setSummarizationPromptTemplate(template: string): void {
    this.summarizationPromptTemplate = template;
  }

  public getSummarizationPromptTemplate(): string {
    return this.summarizationPromptTemplate;
  }

  public setKeywordExtractionPromptTemplate(template: string): void {
    this.keywordExtractionPromptTemplate = template;
  }

  public getKeywordExtractionPromptTemplate(): string {
    return this.keywordExtractionPromptTemplate;
  }

  public getContextManager(): ContextManager {
    return this.contextManager;
  }
}