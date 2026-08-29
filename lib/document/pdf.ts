import * as pdfParseModule from 'pdf-parse';
import { DocumentContent, DocumentPage } from '../../src/types/audit.js';

// Handle CommonJS / ESM default export differences cleanly
const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;

export async function extractPdfContent(
  buffer: Buffer,
  fileName: string
): Promise<DocumentContent> {
  const pageTexts: string[] = [];

  const customPager = (pageData: any) => {
    return pageData.getTextContent().then((textContent: any) => {
      let lastY: number | undefined;
      let text = '';
      for (const item of textContent.items) {
        if (lastY === undefined || Math.abs(lastY - item.transform[5]) < 4) {
          text += item.str + ' ';
        } else {
          text += '\n' + item.str + ' ';
        }
        lastY = item.transform[5];
      }
      pageTexts.push(text.trim());
      return text;
    });
  };

  try {
    const data = await pdfParse(buffer, {
      pagerender: customPager,
    });

    const pages: DocumentPage[] = [];
    if (pageTexts.length > 0) {
      pageTexts.forEach((text, index) => {
        if (text.trim().length > 0) {
          pages.push({
            pageNumber: index + 1,
            text: text.trim(),
          });
        }
      });
    }

    // Fallback if customPager didn't populate
    if (pages.length === 0 && data.text) {
      const full = data.text.trim();
      const rawPages = full.split(/\f|\n{4,}/g);
      rawPages.forEach((pText, i) => {
        if (pText.trim()) {
          pages.push({
            pageNumber: i + 1,
            text: pText.trim(),
          });
        }
      });
      if (pages.length === 0 && full) {
        pages.push({
          pageNumber: 1,
          text: full,
        });
      }
    }

    const fullText = data.text?.trim() || pages.map((p) => p.text).join('\n\n');
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;

    return {
      fileName,
      fileType: 'pdf',
      pages,
      fullText,
      pageCount: data.numpages || pages.length || 1,
      wordCount,
      fileSizeBytes: buffer.length,
    };
  } catch (err: any) {
    throw new Error(`Failed to parse PDF document: ${err.message || err}`);
  }
}
