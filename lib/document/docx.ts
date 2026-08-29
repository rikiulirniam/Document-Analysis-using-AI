import mammoth from 'mammoth';
import { DocumentContent, DocumentPage } from '../../src/types/audit.js';

export async function extractDocxContent(
  buffer: Buffer,
  fileName: string
): Promise<DocumentContent> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const fullText = result.value.trim();

    if (!fullText) {
      throw new Error('The DOCX file is empty or could not be read.');
    }

    // DOCX is flow-based. We partition into logical sections/pages (~400 words per section)
    const paragraphs = fullText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const pages: DocumentPage[] = [];

    let currentText = '';
    let currentWords = 0;
    let pageNum = 1;

    for (const para of paragraphs) {
      const words = para.split(/\s+/).length;
      if (currentWords + words > 450 && currentText.length > 0) {
        pages.push({
          pageNumber: pageNum++,
          text: currentText.trim(),
        });
        currentText = para;
        currentWords = words;
      } else {
        currentText += (currentText ? '\n\n' : '') + para;
        currentWords += words;
      }
    }

    if (currentText.trim().length > 0) {
      pages.push({
        pageNumber: pageNum,
        text: currentText.trim(),
      });
    }

    const wordCount = fullText.split(/\s+/).filter(Boolean).length;

    return {
      fileName,
      fileType: 'docx',
      pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: fullText }],
      fullText,
      pageCount: pages.length || 1,
      wordCount,
      fileSizeBytes: buffer.length,
    };
  } catch (err: any) {
    throw new Error(`Failed to parse DOCX document: ${err.message || err}`);
  }
}
