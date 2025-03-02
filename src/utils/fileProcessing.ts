import { PDFDocument } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import mammoth from 'mammoth';

export interface ProcessedResume {
  sections: {
    title: string;
    content: string[];
  }[];
  metadata: {
    fileName: string;
    fileType: string;
    originalContent: string;
  };
}

export async function processResume(file: File): Promise<ProcessedResume> {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  let content = '';
  
  switch (fileType) {
    case 'pdf':
      content = await processPDF(file);
      break;
    case 'docx':
      content = await processDOCX(file);
      break;
    case 'doc':
      throw new Error('Legacy DOC format is not supported. Please convert to DOCX or PDF.');
    default:
      throw new Error('Unsupported file format');
  }

  // Basic section detection (can be enhanced with AI/ML)
  const sections = detectSections(content);

  return {
    sections,
    metadata: {
      fileName: file.name,
      fileType: fileType || '',
      originalContent: content,
    },
  };
}

async function processPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  
  let content = '';
  for (const page of pages) {
    const textContent = await page.doc.getText();
    content += textContent + '\n';
  }
  
  return content;
}

async function processDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

function detectSections(content: string): { title: string; content: string[] }[] {
  // Basic section detection using common resume headings
  const sectionPatterns = [
    'SUMMARY|OBJECTIVE|PROFILE',
    'EXPERIENCE|EMPLOYMENT|WORK HISTORY',
    'EDUCATION|ACADEMIC|QUALIFICATIONS',
    'SKILLS|EXPERTISE|COMPETENCIES',
    'PROJECTS|PORTFOLIO',
    'CERTIFICATIONS|LICENSES',
    'AWARDS|ACHIEVEMENTS',
  ].map(pattern => new RegExp(`(${pattern})`, 'gi'));

  let sections: { title: string; content: string[] }[] = [];
  let currentSection = '';
  let currentContent: string[] = [];

  // Split content into lines and process
  const lines = content.split('\n').map(line => line.trim()).filter(Boolean);

  for (const line of lines) {
    let isSectionHeader = false;
    
    for (const pattern of sectionPatterns) {
      if (pattern.test(line)) {
        if (currentSection) {
          sections.push({
            title: currentSection,
            content: currentContent,
          });
        }
        currentSection = line;
        currentContent = [];
        isSectionHeader = true;
        break;
      }
    }

    if (!isSectionHeader && currentSection) {
      currentContent.push(line);
    } else if (!isSectionHeader && !currentSection) {
      // Content before first section is considered part of summary
      if (!sections.length) {
        currentSection = 'SUMMARY';
        currentContent.push(line);
      }
    }
  }

  // Add the last section
  if (currentSection) {
    sections.push({
      title: currentSection,
      content: currentContent,
    });
  }

  return sections;
}

export async function generateModifiedPDF(
  processedResume: ProcessedResume,
  modifications: { section: string; content: string[] }[]
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();
  
  let yOffset = height - 50; // Start from top
  const margin = 50;
  const lineHeight = 15;

  // Add content to PDF
  for (const section of processedResume.sections) {
    // Find modifications for this section
    const modification = modifications.find(m => m.section === section.title);
    const content = modification ? modification.content : section.content;

    // Add section title
    page.drawText(section.title, {
      x: margin,
      y: yOffset,
      size: 14,
    });
    yOffset -= lineHeight * 2;

    // Add section content
    for (const line of content) {
      if (yOffset < margin) {
        // Add new page if needed
        const newPage = pdfDoc.addPage();
        yOffset = newPage.getSize().height - 50;
      }

      page.drawText(line, {
        x: margin + 10,
        y: yOffset,
        size: 11,
      });
      yOffset -= lineHeight;
    }

    yOffset -= lineHeight; // Add space between sections
  }

  return pdfDoc.save();
}

export async function generateModifiedDOCX(
  processedResume: ProcessedResume,
  modifications: { section: string; content: string[] }[]
): Promise<Uint8Array> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: processedResume.sections.map(section => {
        // Find modifications for this section
        const modification = modifications.find(m => m.section === section.title);
        const content = modification ? modification.content : section.content;

        return [
          new Paragraph({
            children: [
              new TextRun({
                text: section.title,
                bold: true,
                size: 28, // 14pt
              }),
            ],
          }),
          ...content.map(
            line =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 22, // 11pt
                  }),
                ],
              })
          ),
          new Paragraph({}), // Add space between sections
        ];
      }).flat(),
    }],
  });

  return await Packer.toBuffer(doc);
}