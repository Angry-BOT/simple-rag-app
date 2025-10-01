import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { Document } from 'langchain/document';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Service for parsing documents using LangChain document loaders
 * Supports PDF, TXT, and HTML files
 */
@Injectable()
export class DocumentParserService {
  private readonly logger = new Logger(DocumentParserService.name);

  /**
   * Parse a document file and return LangChain Document objects
   * @param filePath Path to the file
   * @param fileType File extension (pdf, txt, html)
   * @returns Array of LangChain Document objects
   */
  async parseDocument(filePath: string, fileType: string): Promise<Document[]> {
    this.logger.log(`Parsing ${fileType} file: ${filePath}`);

    try {
      switch (fileType.toLowerCase()) {
        case 'pdf':
          return await this.parsePdf(filePath);
        case 'txt':
          return await this.parseText(filePath);
        case 'html':
          return await this.parseHtml(filePath);
        default:
          throw new BadRequestException(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      this.logger.error(`Failed to parse ${fileType} file: ${filePath}`, error);
      throw new Error(
        `Failed to parse ${fileType} file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Parse PDF file using LangChain PDFLoader
   * @param filePath Path to PDF file
   * @returns Array of Document objects (one per page)
   */
  private async parsePdf(filePath: string): Promise<Document[]> {
    const loader = new PDFLoader(filePath, {
      splitPages: true, // One document per page
      parsedItemSeparator: '', // Remove extra spaces
    });

    const docs = await loader.load();
    this.logger.log(`Parsed PDF: ${filePath} - ${docs.length} pages`);

    // Add file metadata
    return docs.map((doc: Document) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        source: filePath,
        fileType: 'pdf',
      },
    }));
  }

  /**
   * Parse text file using LangChain TextLoader
   * @param filePath Path to text file
   * @returns Array with single Document object
   */
  private async parseText(filePath: string): Promise<Document[]> {
    const loader = new TextLoader(filePath);
    const docs = await loader.load();

    this.logger.log(`Parsed text file: ${filePath} - ${docs[0].pageContent.length} characters`);

    // Add file metadata
    return docs.map((doc: Document) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        source: filePath,
        fileType: 'txt',
      },
    }));
  }

  /**
   * Parse HTML file using CheerioWebBaseLoader
   * For HTML files, we'll read the content and use Cheerio to parse
   * @param filePath Path to HTML file
   * @returns Array with single Document object
   */
  private async parseHtml(filePath: string): Promise<Document[]> {
    // Read HTML file content
    const htmlContent = await fs.readFile(filePath, 'utf-8');

    // For HTML files, we'll use a simpler approach
    // Parse HTML with a basic text extraction using cheerio
    const cheerio = await import('cheerio');
    const $ = cheerio.load(htmlContent);

    // Remove script and style elements
    $('script').remove();
    $('style').remove();
    $('noscript').remove();

    // Extract text from body or entire document
    const bodyText = $('body').length > 0 ? $('body').text() : $.root().text();

    // Clean up whitespace
    const cleanedText = bodyText.replace(/\s+/g, ' ').trim();

    const doc = new Document({
      pageContent: cleanedText,
      metadata: {
        source: filePath,
        fileType: 'html',
        title: $('title').text() || undefined,
      },
    });

    this.logger.log(`Parsed HTML file: ${filePath} - ${cleanedText.length} characters`);

    return [doc];
  }

  /**
   * Get document metadata without parsing full content
   * @param filePath Path to the file
   * @returns Basic file metadata
   */
  async getDocumentMetadata(filePath: string): Promise<{
    fileName: string;
    fileSize: number;
    fileType: string;
  }> {
    try {
      const stats = await fs.stat(filePath);
      const extension = path.extname(filePath).slice(1).toLowerCase();
      const fileName = path.basename(filePath);

      return {
        fileName,
        fileSize: stats.size,
        fileType: extension,
      };
    } catch (error) {
      this.logger.error(`Failed to get metadata for file: ${filePath}`, error);
      throw new Error(
        `Failed to get file metadata: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
