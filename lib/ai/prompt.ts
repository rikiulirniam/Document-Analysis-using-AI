import { Type } from '@google/genai';
import { AuditMode, DocumentContent } from '../../src/types/audit.js';

export const auditResponseSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: {
      type: Type.INTEGER,
      description: 'Overall document quality score between 0 and 100.',
    },
    summary: {
      type: Type.STRING,
      description: 'Concise executive summary of the document audit findings.',
    },
    categories: {
      type: Type.OBJECT,
      properties: {
        spelling: { type: Type.INTEGER, description: 'Score 0-100 for spelling accuracy and typos.' },
        grammar: { type: Type.INTEGER, description: 'Score 0-100 for grammatical precision and syntax.' },
        sentenceQuality: { type: Type.INTEGER, description: 'Score 0-100 for clarity, flow, and conciseness.' },
        relevance: { type: Type.INTEGER, description: 'Score 0-100 for relevance to the core topic/assignment.' },
        completeness: { type: Type.INTEGER, description: 'Score 0-100 for depth, necessary details, and missing concepts.' },
        structure: { type: Type.INTEGER, description: 'Score 0-100 for logical organization and coherence.' },
        questionCoverage: { type: Type.INTEGER, description: 'Score 0-100 for answering requested prompt requirements (100 if none provided).' },
      },
      required: [
        'spelling',
        'grammar',
        'sentenceQuality',
        'relevance',
        'completeness',
        'structure',
        'questionCoverage',
      ],
    },
    issues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Unique issue identifier (e.g., issue-1)' },
          type: {
            type: Type.STRING,
            description: 'One of: spelling, grammar, sentence_quality, relevance, missing_point, structure, accuracy, question_coverage',
          },
          severity: {
            type: Type.STRING,
            description: 'One of: low (minor typo/punctuation), medium (readability/flow), high (missing requirement/critical flaw)',
          },
          location: {
            type: Type.OBJECT,
            properties: {
              pageNumber: { type: Type.INTEGER, description: 'Page number where the issue occurs' },
              paragraph: { type: Type.INTEGER, description: 'Paragraph or line number approximation' },
              section: { type: Type.STRING, description: 'Section or heading name if available' },
            },
          },
          originalText: { type: Type.STRING, description: 'Exact quote or phrase from document with the issue' },
          suggestion: { type: Type.STRING, description: 'Specific actionable fix or replacement text' },
          explanation: { type: Type.STRING, description: 'Detailed objective reason why this is an issue' },
          confidence: { type: Type.INTEGER, description: 'Confidence level from 0 to 100' },
        },
        required: ['id', 'type', 'severity', 'explanation', 'confidence'],
      },
      description: 'List of detected issues in the document.',
    },
    requirements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'Requirement identifier (e.g., req-1)' },
          requirement: { type: Type.STRING, description: 'Specific question or assignment requirement extracted' },
          status: { type: Type.STRING, description: 'One of: met, partially_met, not_met' },
          explanation: { type: Type.STRING, description: 'Evaluation of how well the document satisfied this requirement' },
        },
        required: ['id', 'requirement', 'status', 'explanation'],
      },
      description: 'Evaluation against assignment/question requirements (empty if no assignment was given).',
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Key positive aspects and strong points found in the document.',
    },
    priorityFixes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Top 3-5 prioritized recommendations for maximum improvement.',
    },
  },
  required: [
    'overallScore',
    'summary',
    'categories',
    'issues',
    'requirements',
    'strengths',
    'priorityFixes',
  ],
};

export function buildAuditPrompt(
  doc: DocumentContent,
  assignment?: string,
  referenceMaterial?: string
): { systemInstruction: string; userPrompt: string; mode: AuditMode } {
  let mode: AuditMode = 'document_only';
  if (assignment && assignment.trim().length > 0) {
    mode = referenceMaterial && referenceMaterial.trim().length > 0 ? 'full_with_reference' : 'with_assignment';
  }

  const systemInstruction = `You are DocAudit AI, an expert, objective document auditing engine.
Your purpose is to thoroughly analyze documents for:
1. Language Quality: Spelling, Typos, Grammatical correctness, Sentence clarity & flow.
2. Content Quality: Relevance, Completeness, Structure, and Logical flow.
3. Assignment Coverage (if provided): Breakdown and evaluate whether all requested instructions or prompt questions were met, partially met, or not met.
4. Reference Material Consistency (if provided): Compare document claims against provided reference material for accuracy and contradictions without over-claiming.

GROUNDING & AUDITING RULES:
- Ground all findings strictly in the provided document text. Never invent quotes or claim text exists if it does not.
- Distinguish clearly between confirmed issues and potential issues. Set confidence (0-100) accordingly.
- Do NOT flood the report with frivolous nitpicks; prioritize high-confidence, actionable insights. If the document is well-written, it is completely normal to have few or zero spelling errors.
- If no assignment or question is provided, set questionCoverage score to 100, return an empty requirements array, and focus on general document quality.
- If reference material is provided, check for alignment with reference concepts.
- Preserve the author's original intent and meaning in all suggestions.
- Return output strictly matching the JSON schema provided.`;

  let userPrompt = `DOCUMENT INFORMATION:
File Name: ${doc.fileName}
File Type: ${doc.fileType.toUpperCase()}
Total Estimated Pages: ${doc.pageCount}
Total Words: ${doc.wordCount}

=== DOCUMENT CONTENT BY PAGE ===
`;

  doc.pages.forEach((p) => {
    userPrompt += `\n[--- PAGE ${p.pageNumber} ---]\n${p.text}\n`;
  });

  if (assignment && assignment.trim()) {
    userPrompt += `\n\n=== ASSIGNMENT / PROMPT INSTRUCTIONS ===\n${assignment.trim()}\n`;
  } else {
    userPrompt += `\n\n=== ASSIGNMENT / PROMPT INSTRUCTIONS ===\n(None provided by user. Audit as a standalone document for clarity, grammar, and structure.)\n`;
  }

  if (referenceMaterial && referenceMaterial.trim()) {
    userPrompt += `\n\n=== REFERENCE MATERIAL ===\n${referenceMaterial.trim()}\n`;
  }

  userPrompt += `\n\nPlease execute a complete, rigorous document audit following the instructions and return the structured JSON audit result.`;

  return { systemInstruction, userPrompt, mode };
}
