import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { extractPdfContent } from './lib/document/pdf.js';
import { extractDocxContent } from './lib/document/docx.js';
import { runDocumentAudit } from './lib/ai/gemini.js';
import { DocumentContent } from './src/types/audit.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Multer for document upload in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const allowedExtensions = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE'));
    }
  },
});

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'DocAudit AI' });
});

// Main Document Analyze Endpoint
app.post('/api/analyze', (req: Request, res: Response, next) => {
  upload.single('file')(req, res, async (err: any) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: 'File size exceeds the 10 MB limit.',
          },
        });
      }
      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'Only PDF and DOCX files are supported.',
          },
        });
      }
      return res.status(400).json({
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: err.message || 'File upload error occurred.',
        },
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FILE',
            message: 'Please provide a PDF or DOCX file to analyze.',
          },
        });
      }

      const file = req.file;
      const assignment = (req.body.assignment as string) || '';
      const referenceMaterial = (req.body.referenceMaterial as string) || '';

      const fileName = file.originalname;
      const isPdf = fileName.toLowerCase().endsWith('.pdf') || file.mimetype === 'application/pdf';
      const isDocx =
        fileName.toLowerCase().endsWith('.docx') ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      if (!isPdf && !isDocx) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'Only PDF and DOCX files are supported.',
          },
        });
      }

      // Step 1: Text Extraction
      let documentContent: DocumentContent;
      try {
        if (isPdf) {
          documentContent = await extractPdfContent(file.buffer, fileName);
        } else {
          documentContent = await extractDocxContent(file.buffer, fileName);
        }
      } catch (extractionError: any) {
        return res.status(422).json({
          success: false,
          error: {
            code: 'TEXT_EXTRACTION_FAILED',
            message: extractionError.message || 'Failed to extract text from document.',
          },
        });
      }

      if (!documentContent.fullText || documentContent.fullText.trim().length === 0) {
        return res.status(422).json({
          success: false,
          error: {
            code: 'EMPTY_DOCUMENT',
            message: 'The uploaded document contains no readable text or is password-protected.',
          },
        });
      }

      // Step 2: AI Document Audit
      const auditResult = await runDocumentAudit(documentContent, assignment, referenceMaterial);

      return res.json({
        success: true,
        data: auditResult,
      });
    } catch (analysisError: any) {
      console.error('Audit analysis failed:', analysisError);
      return res.status(500).json({
        success: false,
        error: {
          code: 'AI_REQUEST_FAILED',
          message: analysisError.message || 'An error occurred during AI analysis.',
        },
      });
    }
  });
});

// Vite middleware & Static asset serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DocAudit AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
