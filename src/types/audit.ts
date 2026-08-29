export type IssueType =
  | "spelling"
  | "grammar"
  | "sentence_quality"
  | "relevance"
  | "missing_point"
  | "structure"
  | "accuracy"
  | "question_coverage";

export type IssueSeverity = "low" | "medium" | "high";

export type RequirementStatus = "met" | "partially_met" | "not_met";

export type AuditMode = "document_only" | "with_assignment" | "full_with_reference";

export interface DocumentPage {
  pageNumber: number;
  text: string;
}

export interface DocumentContent {
  fileName: string;
  fileType: "pdf" | "docx";
  pages: DocumentPage[];
  fullText: string;
  pageCount: number;
  wordCount: number;
  fileSizeBytes?: number;
}

export interface IssueLocation {
  pageNumber?: number;
  paragraph?: number;
  section?: string;
}

export interface AuditIssue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  location?: IssueLocation;
  originalText?: string;
  suggestion?: string;
  explanation: string;
  confidence: number;
}

export interface Requirement {
  id: string;
  requirement: string;
  status: RequirementStatus;
  explanation: string;
}

export interface AuditCategoryScores {
  spelling: number;
  grammar: number;
  sentenceQuality: number;
  relevance: number;
  completeness: number;
  structure: number;
  questionCoverage: number;
}

export interface AuditResult {
  overallScore: number;
  summary: string;
  categories: AuditCategoryScores;
  issues: AuditIssue[];
  requirements: Requirement[];
  strengths: string[];
  priorityFixes: string[];
  documentMeta: DocumentContent;
  auditMode: AuditMode;
  analyzedAt: string;
}

export interface AnalyzeApiResponse {
  success: boolean;
  data?: AuditResult;
  error?: {
    code: string;
    message: string;
  };
}
