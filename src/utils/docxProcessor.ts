import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';

interface Replacement {
  target: string;
  replacement: string;
  section: string;
  applied?: boolean;
}

interface DocxProcessingResult {
  appliedReplacements: Replacement[];
  textContent: string;
}

/**
 * Extract plain text content from a DOCX file
 */
export async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
}

/**
 * Process a DOCX file with replacements using direct XML manipulation
 * This approach ensures in-place modifications rather than appending content
 */
export async function processDocxWithReplacements(
  file: File,
  replacements: Replacement[]
): Promise<DocxProcessingResult> {
  try {
    // Read the DOCX file
    const arrayBuffer = await file.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    
    // Extract the document XML
    const documentXml = zip.file('word/document.xml');
    if (!documentXml) {
      throw new Error('Invalid DOCX file structure');
    }
    
    // Get the document content as text for analysis
    const textContent = await extractTextFromDocx(file);
    
    // Parse the document XML
    let xmlContent = documentXml.asText();
    
    // Create a map of sections in the document
    const sections = identifySections(textContent);
    
    // Track which replacements were applied
    const appliedReplacements: Replacement[] = [];
    
    // Process each replacement
    for (const replacement of replacements) {
      const { target, replacement: newText, section } = replacement;
      
      // Try different strategies to apply the replacement
      const result = applyReplacementToXml(xmlContent, target, newText, section, sections, textContent);
      
      if (result.applied) {
        xmlContent = result.xml; // Update the XML with the replacement
      }
      
      appliedReplacements.push({
        ...replacement,
        applied: result.applied
      });
    }
    
    // Update the document.xml in the zip
    zip.file('word/document.xml', xmlContent);
    
    // Generate the modified document
    const modifiedDoc = zip.generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    
    // Save the file
    const newFileName = file.name.replace('.docx', '_optimized.docx');
    saveAs(modifiedDoc, newFileName);
    
    return {
      appliedReplacements,
      textContent,
    };
  } catch (error) {
    console.error('Error processing DOCX with replacements:', error);
    throw new Error('Failed to process DOCX file with replacements');
  }
}

/**
 * Identify sections in the document
 */
function identifySections(text: string): Map<string, { start: number; end: number; content: string }> {
  const sectionMap = new Map();
  
  // Common section headings in resumes
  const sectionPatterns = [
    'SUMMARY|OBJECTIVE|PROFILE',
    'EXPERIENCE|EMPLOYMENT|WORK HISTORY',
    'EDUCATION|ACADEMIC|QUALIFICATIONS',
    'SKILLS|EXPERTISE|COMPETENCIES',
    'PROJECTS|PORTFOLIO',
    'CERTIFICATIONS|LICENSES',
    'AWARDS|ACHIEVEMENTS',
  ].map(pattern => new RegExp(`(${pattern})`, 'gi'));
  
  // Find sections in the text
  const lines = text.split('\n');
  let currentSection = '';
  let sectionStart = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    for (const pattern of sectionPatterns) {
      if (pattern.test(line)) {
        // If we found a new section, save the previous one
        if (currentSection) {
          const sectionContent = lines.slice(sectionStart, i).join('\n');
          sectionMap.set(currentSection, {
            start: sectionStart,
            end: i - 1,
            content: sectionContent,
          });
        }
        
        currentSection = line;
        sectionStart = i + 1;
        break;
      }
    }
  }
  
  // Add the last section
  if (currentSection) {
    const sectionContent = lines.slice(sectionStart).join('\n');
    sectionMap.set(currentSection, {
      start: sectionStart,
      end: lines.length - 1,
      content: sectionContent,
    });
  }
  
  return sectionMap;
}

/**
 * Apply a replacement directly to the XML content
 * This ensures in-place modifications rather than appending content
 */
function applyReplacementToXml(
  xml: string,
  target: string,
  newText: string,
  section: string,
  sections: Map<string, { start: number; end: number; content: string }>,
  fullText: string
): { applied: boolean; xml: string } {
  // Strategy 1: Direct text replacement in XML
  try {
    // Escape special characters for regex
    const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create a regex that looks for the target text within a text run
    const targetRegex = new RegExp(`(<w:t[^>]*>(?:[^<]*?))${escapedTarget}([^<]*?</w:t>)`, 'g');
    
    // Check if we can find the target text
    if (targetRegex.test(xml)) {
      // Replace the target text with the replacement
      const newXml = xml.replace(targetRegex, `$1${newText}$2`);
      return { applied: true, xml: newXml };
    }
  } catch (error) {
    console.warn('Direct XML replacement failed:', error);
  }
  
  // Strategy 2: Handle text split across multiple w:t elements
  try {
    // Normalize the target text by removing extra spaces
    const normalizedTarget = target.replace(/\s+/g, ' ').trim();
    
    // Find the position of the target text in the full text
    const targetIndex = fullText.indexOf(normalizedTarget);
    
    if (targetIndex !== -1) {
      // Find paragraphs in the XML
      const paragraphs = xml.split(/<\/w:p>/);
      
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        
        // Extract just the text from this paragraph
        const paragraphText = extractTextFromXml(paragraph);
        
        if (paragraphText.includes(normalizedTarget)) {
          // Found the paragraph containing our target text
          
          // Extract the paragraph style
          const styleMatch = paragraph.match(/<w:pPr>([\s\S]*?)<\/w:pPr>/);
          const style = styleMatch ? styleMatch[0] : '';
          
          // Create a new paragraph with the text replaced
          const newParagraphText = paragraphText.replace(normalizedTarget, newText);
          
          // Create the new paragraph XML
          const newParagraph = createParagraphXml(newParagraphText, style);
          
          // Replace the old paragraph with the new one
          paragraphs[i] = newParagraph;
          
          // Rejoin the paragraphs
          return { applied: true, xml: paragraphs.join('</w:p>') + '</w:p>'.repeat(paragraphs.length > 0 ? 1 : 0) };
        }
      }
    }
  } catch (error) {
    console.warn('Multi-element text replacement failed:', error);
  }
  
  // Strategy 3: Section-based replacement
  try {
    // Find the section
    const sectionInfo = Array.from(sections.entries())
      .find(([key]) => key.toLowerCase().includes(section.toLowerCase()));
    
    if (sectionInfo) {
      const [, { content: sectionContent }] = sectionInfo;
      
      // Find similar text in the section
      const similarityThreshold = 0.7;
      const paragraphs = sectionContent.split('\n').filter(p => p.trim().length > 0);
      
      for (const paragraph of paragraphs) {
        const similarity = calculateSimilarity(paragraph, target);
        
        if (similarity > similarityThreshold) {
          // Find this paragraph in the XML
          const paragraphXmlRegex = new RegExp(`<w:p[^>]*>.*?${escapeRegExp(paragraph.substring(0, 50))}.*?</w:p>`, 's');
          const paragraphMatch = xml.match(paragraphXmlRegex);
          
          if (paragraphMatch) {
            // Extract the paragraph style
            const styleMatch = paragraphMatch[0].match(/<w:pPr>([\s\S]*?)<\/w:pPr>/);
            const style = styleMatch ? styleMatch[0] : '';
            
            // Create a new paragraph with the replacement text
            const newParagraph = createParagraphXml(newText, style);
            
            // Replace the old paragraph with the new one
            return { 
              applied: true, 
              xml: xml.replace(paragraphMatch[0], newParagraph) 
            };
          }
        }
      }
    }
  } catch (error) {
    console.warn('Section-based replacement failed:', error);
  }
  
  // Strategy 4: Length-based replacement
  try {
    // Find a paragraph of similar length in the specified section
    const sectionInfo = Array.from(sections.entries())
      .find(([key]) => key.toLowerCase().includes(section.toLowerCase()));
    
    if (sectionInfo) {
      const [, { content: sectionContent }] = sectionInfo;
      const paragraphs = sectionContent.split('\n').filter(p => p.trim().length > 0);
      
      // Find a paragraph of similar length
      const targetLength = target.length;
      const lengthThreshold = 0.2; // 20% difference in length
      
      for (const paragraph of paragraphs) {
        const lengthDifference = Math.abs(paragraph.length - targetLength) / targetLength;
        
        if (lengthDifference < lengthThreshold) {
          // Find this paragraph in the XML
          const paragraphXmlRegex = new RegExp(`<w:p[^>]*>.*?${escapeRegExp(paragraph.substring(0, 50))}.*?</w:p>`, 's');
          const paragraphMatch = xml.match(paragraphXmlRegex);
          
          if (paragraphMatch) {
            // Extract the paragraph style
            const styleMatch = paragraphMatch[0].match(/<w:pPr>([\s\S]*?)<\/w:pPr>/);
            const style = styleMatch ? styleMatch[0] : '';
            
            // Create a new paragraph with the replacement text
            const newParagraph = createParagraphXml(newText, style);
            
            // Replace the old paragraph with the new one
            return { 
              applied: true, 
              xml: xml.replace(paragraphMatch[0], newParagraph) 
            };
          }
        }
      }
    }
  } catch (error) {
    console.warn('Length-based replacement failed:', error);
  }
  
  // No replacement was applied
  return { applied: false, xml };
}

/**
 * Extract text from XML paragraph
 */
function extractTextFromXml(xml: string): string {
  // Extract all text within w:t tags
  const textMatches = xml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
  const texts = textMatches.map(match => {
    const content = match.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
    return content ? content[1] : '';
  });
  
  return texts.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Create a paragraph XML with the given text and style
 */
function createParagraphXml(text: string, style: string): string {
  // Extract font information from the document
  const fontMatch = style.match(/w:ascii="([^"]+)"/);
  const fontSizeMatch = style.match(/w:sz w:val="([^"]+)"/);
  
  const font = fontMatch ? fontMatch[1] : 'Calibri';
  const fontSize = fontSizeMatch ? fontSizeMatch[1] : '22';
  
  return `<w:p>${style}<w:r><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}"/><w:sz w:val="${fontSize}"/></w:rPr><w:t>${text}</w:t></w:r></w:p>`;
}

/**
 * Escape string for use in regex
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculate similarity between two strings
 * Uses Levenshtein distance for string comparison
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  // Calculate Levenshtein distance
  const costs: number[] = [];
  for (let i = 0; i <= shorter.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= longer.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j === 0) {
        costs[j] = i;
      } else {
        if (shorter[i - 1] === longer[j - 1]) {
          costs[j] = costs[j - 1];
        } else {
          costs[j] = 1 + Math.min(costs[j - 1], costs[j], lastValue);
        }
      }
      lastValue = costs[j];
    }
  }
  
  const distance = costs[longer.length];
  return (longer.length - distance) / longer.length;
}

/**
 * Process and save a DOCX file with the applied replacements
 * @param file The original DOCX file
 * @param replacements The replacements to apply
 * @returns Promise with the result of the processing
 */
export async function processAndSaveDocx(
  file: File,
  replacements: Replacement[]
): Promise<DocxProcessingResult> {
  try {
    // Process the DOCX file with replacements
    return processDocxWithReplacements(file, replacements);
  } catch (error) {
    console.error('Error processing DOCX file:', error);
    throw new Error('Failed to process and save DOCX file');
  }
}

/**
 * Apply a template to a DOCX file
 * @param file The original DOCX file
 * @param templateName The name of the template to apply
 * @param sections The content sections to populate the template with
 * @returns Promise with the result of the processing
 */
export async function applyTemplateToDocx(
  file: File,
  templateName: string,
  sections: { title: string; content: string[] }[]
): Promise<Blob> {
  try {
    // Get the template file based on the template name
    const templateResponse = await fetch(`/templates/${templateName}.docx`);
    if (!templateResponse.ok) {
      throw new Error(`Failed to load template: ${templateName}`);
    }
    
    const templateArrayBuffer = await templateResponse.arrayBuffer();
    const templateZip = new PizZip(templateArrayBuffer);
    
    // Extract the template document XML
    const documentXml = templateZip.file('word/document.xml');
    if (!documentXml) {
      throw new Error('Invalid template DOCX file structure');
    }
    
    // Parse the template XML
    let xmlContent = documentXml.asText();
    
    // Replace template placeholders with actual content
    for (const section of sections) {
      const placeholderRegex = new RegExp(`\\{\\{${section.title.toUpperCase()}\\}\\}`, 'g');
      
      // Format the content as paragraphs
      const formattedContent = section.content
        .map(line => createParagraphXml(line, ''))
        .join('');
      
      // Replace the placeholder with the formatted content
      xmlContent = xmlContent.replace(placeholderRegex, formattedContent);
    }
    
    // Update the document.xml in the template zip
    templateZip.file('word/document.xml', xmlContent);
    
    // Generate the modified document
    const modifiedDoc = templateZip.generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    
    return modifiedDoc;
  } catch (error) {
    console.error('Error applying template to DOCX:', error);
    throw new Error('Failed to apply template to DOCX file');
  }
}

/**
 * Get available templates
 * @returns Promise with an array of template objects
 */
export async function getAvailableTemplates(): Promise<Array<{
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}>> {
  try {
    const response = await fetch('/templates/index.json');
    if (!response.ok) {
      throw new Error('Failed to load templates index');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
} 