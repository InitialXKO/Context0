import { ContextManager } from "./contextManager.js";
import { ContextSegment } from "./contextSegment.js";
import { v4 as uuidv4 } from 'uuid';

const MAX_SEGMENT_CONTENT_LENGTH = 2000; // Define a maximum content length for a single segment

export class OffloadingManager {
  private contextManager: ContextManager;
  private internalContext: Map<string, ContextSegment> = new Map();
  private idCounter: number = 0;

  constructor(contextManager: ContextManager) {
    this.contextManager = contextManager;
    this.loadInternalContext();
  }

  private async loadInternalContext(): Promise<void> {
    const contextData = await this.contextManager.loadContext("agent_internal_context");
    if (contextData) {
      try {
        const parsed = JSON.parse(contextData);
        this.internalContext = new Map(Object.entries(parsed));
        // Update idCounter to avoid conflicts with existing IDs
        for (const id of this.internalContext.keys()) {
          // Match all _seg{N} patterns in the ID
          const segMatches = id.matchAll(/_seg(\d+)/g);
          for (const match of segMatches) {
            const num = parseInt(match[1]);
            if (num >= this.idCounter) {
              this.idCounter = num + 1;
            }
          }
        }
      } catch (error) {
        console.error("Failed to parse internal context:", error);
        this.internalContext = new Map();
      }
    }
  }

  private async saveInternalContext(): Promise<void> {
    try {
      const contextData = JSON.stringify(Object.fromEntries(this.internalContext));
      await this.contextManager.saveContext("agent_internal_context", contextData);
    } catch (error) {
      console.error("Failed to save internal context:", error);
      throw new Error("Failed to persist context changes");
    }
  }

  private generateId(parentId?: string): string {
    this.idCounter++;
    return parentId ? `${parentId}_seg${this.idCounter}` : `root_seg${this.idCounter}`;
  }

  private generateMarker(content: string): string {
    // Simple implementation: first sentence or first 50 chars
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 0);
    return sentences[0]?.trim().substring(0, 50) || content.substring(0, 50);
  }


  async offloadContent(fullContent: string, parentId?: string, summary?: string, keywords?: string[]): Promise<ContextSegment> {
    if (parentId && !this.internalContext.has(parentId)) {
      throw new Error(`Parent segment with ID '${parentId}' does not exist`);
    }

    const baseMarker = this.generateMarker(fullContent);
    const rootId = this.generateId(parentId);
    const rootSummary = summary ?? baseMarker;
    const rootKeywords = keywords ?? [];

    const initialChunk = fullContent.substring(0, MAX_SEGMENT_CONTENT_LENGTH);
    const rootSegment: ContextSegment = {
      id: rootId,
      marker: baseMarker,
      full_content: initialChunk,
      parent_id: parentId,
      child_references: [],
      summary: rootSummary,
      keywords: rootKeywords,
    };

    this.internalContext.set(rootId, rootSegment);

    let remainingContent = fullContent.slice(initialChunk.length);
    const childReferences: Array<{ marker: string; id: string }> = [];

    while (remainingContent.length > 0) {
      const childId = this.generateId(rootId);
      const childChunk = remainingContent.substring(0, MAX_SEGMENT_CONTENT_LENGTH);
      const childMarker = this.generateMarker(childChunk);

      const childSegment: ContextSegment = {
        id: childId,
        marker: childMarker,
        full_content: childChunk,
        parent_id: rootId,
        child_references: [],
        summary: `Continuation of ${baseMarker}`,
        keywords: [],
        is_continuation_segment: true,
      };

      this.internalContext.set(childId, childSegment);
      childReferences.push({ marker: childMarker, id: childId });
      remainingContent = remainingContent.slice(childChunk.length);
    }

    if (childReferences.length > 0) {
      rootSegment.child_references = childReferences;
      rootSegment.marker = `${baseMarker} (continued)`;
    }

    if (parentId) {
      const parent = this.internalContext.get(parentId)!;
      parent.child_references.push({ marker: rootSegment.marker, id: rootId });
      parent.marker = `${parent.marker} [${baseMarker} (ID: ${rootId})]`;
    }

    await this.saveInternalContext();

    return rootSegment;
  }

  getSegment(id: string): ContextSegment | null {
    return this.internalContext.get(id) || null;
  }

  getOffloadedSegmentByContent(content: string): ContextSegment | null {
    for (const segment of this.internalContext.values()) {
      if (segment.full_content === content) {
        return segment;
      }
    }
    return null;
  }


  retrieveById(id: string): ContextSegment | null {
    return this.getSegment(id);
  }

  private getAllChildIds(id: string): string[] {
    const segment = this.getSegment(id);
    if (!segment) return [];

    const childIds: string[] = [];
    for (const childRef of segment.child_references) {
      childIds.push(childRef.id);
      childIds.push(...this.getAllChildIds(childRef.id));
    }
    return childIds;
  }

  retrieveRecursive(id: string): ContextSegment[] {
    const segment = this.getSegment(id);
    if (!segment) return [];

    const result: ContextSegment[] = [segment];
    const childIds = this.getAllChildIds(id);
    for (const childId of childIds) {
      const child = this.getSegment(childId);
      if (child) result.push(child);
    }
    return result;
  }

  retrieveWithDemandLevel(id: string, demandLevel: 'high' | 'medium' | 'low'): any {
    const segment = this.getSegment(id);
    if (!segment) return null;

    switch (demandLevel) {
      case 'high':
        // Return full recursive content
        const allSegments = this.retrieveRecursive(id);
        return {
          type: 'full_recursive',
          segments: allSegments,
        };

      case 'medium':
        // Parent full_content + child summaries
        return {
          type: 'parent_with_child_summaries',
          parent: segment,
          children: segment.child_references.map(ref => {
            const child = this.getSegment(ref.id);
            return child ? { id: ref.id, marker: ref.marker, summary: child.summary } : ref;
          }),
        };

      case 'low':
        // Only parent full_content
        return {
          type: 'parent_only',
          parent: segment,
        };
    }
  }

  async retrieveFullContent(id: string): Promise<string | null> {
    const segment = this.getSegment(id);
    if (!segment) return null;

    let fullContent = segment.full_content;

    for (const childRef of segment.child_references) {
      const childSegment = this.getSegment(childRef.id);
      if (childSegment && childSegment.is_continuation_segment) {
        const continuationContent = await this.retrieveFullContent(childRef.id);
        if (continuationContent) {
          fullContent += continuationContent;
        }
      }
    }
    return fullContent;
  }

  retrieveSegment(id: string): string | null {
    const segment = this.getSegment(id);
    if (!segment) return null;
    return segment.full_content;
  }

  searchByKeywords(keywords: string[]): ContextSegment[] {
    const results: ContextSegment[] = [];
    for (const segment of this.internalContext.values()) {
      const hasKeyword = keywords.some(keyword =>
        segment.keywords?.some(kw => kw.toLowerCase().includes(keyword.toLowerCase())) ?? false
      );
      if (hasKeyword) results.push(segment);
    }
    return results;
  }

  retrievePartialDetails(id: string, query: string): string[] {
    const segment = this.getSegment(id);
    if (!segment) return [];

    // Simple search in full_content
    const sentences = segment.full_content.split(/[.!?]/);
    return sentences.filter(sentence =>
      sentence.toLowerCase().includes(query.toLowerCase())
    ).map(s => s.trim());
  }
}