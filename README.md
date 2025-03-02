# AI Resume Builder

A modern web application that helps users create, optimize, and tailor their resumes for specific job descriptions using AI.

## Features

- **Resume Upload**: Upload existing resumes in various formats (PDF, DOCX)
- **AI-Powered Optimization**: Analyze and optimize resumes based on job descriptions
- **Template Selection**: Choose from multiple professional resume templates
- **Section Editing**: Edit all resume sections including personal details, contact info, professional summary, employment history, education, and skills
- **ATS Compatibility**: Ensure your resume passes Applicant Tracking Systems
- **Export Options**: Download your optimized resume in multiple formats

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- OpenAI API
- Supabase

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/AI_ResumeBuilder.git
   cd AI_ResumeBuilder
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Deployment

To build the application for production:

```
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- Supabase for backend services 