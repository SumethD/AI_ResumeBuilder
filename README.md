# AI Resume Builder

A modern web application that helps users create, optimize, and analyze resumes using AI technologies.

## Features

### Resume Builder
- Multi-step form wizard to create professional resumes
- Sections for personal details, contact information, employment history, education, skills, and additional sections
- Review and edit capabilities

### Resume Parser
- Upload existing resumes in PDF or DOCX format
- Automatically extract structured data from resume files
- Use extracted data to pre-fill the resume builder form
- Supports rule-based extraction with optional AI enhancement

### Resume Analysis
- Compare resumes against job descriptions
- Get AI-powered feedback and suggestions
- Identify missing keywords and skills

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/AI_ResumeBuilder.git
cd AI_ResumeBuilder
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Using the Resume Parser

The Resume Parser feature allows you to upload an existing resume and extract structured data from it. Here's how to use it:

1. Navigate to the Dashboard
2. Click on the "Parse Resume" button
3. Upload your resume file (PDF or DOCX format)
4. Click "Parse Resume" to extract the data
5. Review the extracted information
6. Use the extracted data to pre-fill the resume builder form

### Supported File Types
- PDF (.pdf)
- Microsoft Word (.docx)

### Dependencies

The Resume Parser uses the following libraries:
- `pdfjs-dist` for parsing PDF files
- `mammoth` for parsing DOCX files
- Optional OpenAI integration for enhanced extraction

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite
- PDF.js
- Mammoth.js
- OpenAI API (optional)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- Supabase for backend services 