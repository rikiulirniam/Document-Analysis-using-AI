import { GoogleGenAI } from '@google/genai';
import { AuditResult, DocumentContent } from '../../src/types/audit.js';
import { auditResponseSchema, buildAuditPrompt } from './prompt.js';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set. Please configure it in your settings.');
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function runDocumentAudit(
  documentContent: DocumentContent,
  assignment?: string,
  referenceMaterial?: string
): Promise<AuditResult> {
  const ai = getGeminiClient();
  const { systemInstruction, userPrompt, mode } = buildAuditPrompt(
    documentContent,
    assignment,
    referenceMaterial
  );

  const response = await ai.models.generateContent({
    model: 'gemini-3.7-flash',
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: auditResponseSchema,
      temperature: 0.2, // low temperature for consistent, accurate auditing
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error('No analysis generated from AI model.');
  }

  let parsed: any;
  try {
    parsed = JSON.parse(rawText.trim());
  } catch (err: any) {
    throw new Error(`Failed to parse AI audit response: ${err.message}`);
  }

  // Ensure robust normalization and fallback defaults
  const auditResult: AuditResult = {
    overallScore: typeof parsed.overallScore === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.overallScore))) : 75,
    summary: parsed.summary || 'Document audit completed successfully.',
    categories: {
      spelling: parsed.categories?.spelling ?? 85,
      grammar: parsed.categories?.grammar ?? 85,
      sentenceQuality: parsed.categories?.sentenceQuality ?? 80,
      relevance: parsed.categories?.relevance ?? 80,
      completeness: parsed.categories?.completeness ?? 75,
      structure: parsed.categories?.structure ?? 80,
      questionCoverage: mode === 'document_only' ? 100 : (parsed.categories?.questionCoverage ?? 75),
    },
    issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    requirements: Array.isArray(parsed.requirements) ? parsed.requirements : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    priorityFixes: Array.isArray(parsed.priorityFixes) ? parsed.priorityFixes : [],
    documentMeta: documentContent,
    auditMode: mode,
    analyzedAt: new Date().toISOString(),
  };

  return auditResult;
}
