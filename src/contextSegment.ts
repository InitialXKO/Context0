export interface ContextSegment {
  id: string;
  marker: string;
  full_content: string;
  parent_id?: string;
  child_references: Array<{ marker: string; id: string }>;
  summary?: string; // Optional: Summary of the content
  keywords?: string[]; // Optional: Keywords extracted from the content
  is_continuation_segment?: boolean; // Optional: Indicates if this segment is a continuation of a larger content
}