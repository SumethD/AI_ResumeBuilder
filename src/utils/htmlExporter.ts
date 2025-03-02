import { saveAs } from 'file-saver';

/**
 * Exports the edited resume content as an HTML file
 * @param content The HTML content to export
 * @param originalFileName The original file name to base the new file name on
 */
export function exportAsHtml(content: string, originalFileName: string): void {
  // Create a new HTML file with the edited content
  const htmlBlob = new Blob([`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Optimized Resume</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h2 { 
          margin-top: 20px; 
          margin-bottom: 10px; 
          color: #333;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .bullet { margin-left: 20px; }
        div { margin-bottom: 5px; }
        @media print {
          body {
            padding: 0;
            color: black;
          }
          a { color: black; text-decoration: none; }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `], { type: 'text/html' });
  
  // Generate a new file name
  const fileName = originalFileName.replace(/\.\w+$/, '_optimized.html');
  
  // Save the file
  saveAs(htmlBlob, fileName);
} 