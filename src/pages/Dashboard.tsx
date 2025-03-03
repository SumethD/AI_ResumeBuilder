import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, Download, Briefcase, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import OpenAI from 'openai';
import { extractTextFromDocx } from '../utils/docxProcessor';
import ResumeEditor from '../components/ResumeEditor';
import Footer from '../components/Footer';
import { saveAs } from 'file-saver';
import { exportAsHtml } from '../utils/htmlExporter';
import { parseResumeFile } from '../utils/resumeParser';
import type { ResumeData } from '../types/resume';

// Types for the analysis results
interface AnalysisResult {
  atsScore: number;
  keywordScore: number;
  formatScore: number;
  missingKeywords: string[];
  suggestedLines: { content: string; section: string }[];
  insertPositions: Array<{
    content: string;
    style: string;
    section: string;
  }>;
  replacements: Replacement[];
  recommendations: {
    formatImprovements: string[];
    keywordOptimization: string[];
  };
}

interface Replacement {
  target: string;
  replacement: string;
  section: string;
  applied?: boolean;
  id?: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [appliedReplacements, setAppliedReplacements] = useState<Replacement[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [parsedResumeData, setParsedResumeData] = useState<ResumeData | null>(null);
  const [parsingInProgress, setParsingInProgress] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Analyze resume with OpenAI
  const handleAnalyze = async () => {
    if (!resumeContent || !jobDescription.trim()) {
      setError('Please upload a resume file and enter a job description');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setAnalysis(null);

    try {
      // If we have parsed resume data, use it to optimize the resume
      if (parsedResumeData) {
        // Store the parsed data in localStorage for the resume builder
        localStorage.setItem('extractedResumeData', JSON.stringify(parsedResumeData));
      }

      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert ATS (Applicant Tracking System) and resume optimization assistant. Analyze the resume against the job description and provide detailed feedback."
          },
          {
            role: "user",
            content: `Please analyze this resume against the job description. Provide an ATS compatibility score, keyword match score, and format score (all out of 100). Identify missing keywords, suggest improvements, and provide specific text replacements to optimize the resume.

Resume:
${resumeContent}

Job Description:
${jobDescription}

Return the analysis as a valid JSON object with the following structure:
{
  "atsScore": number,
  "keywordScore": number,
  "formatScore": number,
  "missingKeywords": string[],
  "suggestedLines": [{ "content": string, "section": string }],
  "insertPositions": [{ "content": string, "style": string, "section": string }],
  "replacements": [{ "target": string, "replacement": string, "section": string }],
  "recommendations": {
    "formatImprovements": string[],
    "keywordOptimization": string[]
  }
}`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const result = response.choices[0].message.content;
      if (result) {
        try {
          const parsedResult = JSON.parse(result) as AnalysisResult;
          setAnalysis(parsedResult);
          setSuccess('Resume analysis completed successfully!');
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          setError('Error processing the analysis results. Please try again.');
        }
      } else {
        setError('No analysis results returned. Please try again.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setSuccess(null);
    setParsingInProgress(true);

    try {
      // Parse the resume to extract structured data
      const parsedData = await parseResumeFile(file);
      setParsedResumeData(parsedData);
      
      // Also extract the text content for analysis
      if (file.type === 'application/pdf') {
        // Handle PDF files
        const reader = new FileReader();
        reader.onload = async () => {
          const text = await extractTextFromPdf();
          setResumeContent(text);
          setSuccess('Resume uploaded and parsed successfully!');
          setParsingInProgress(false);
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Handle DOCX files
        const text = await extractTextFromDocx(file);
        setResumeContent(text);
        setSuccess('Resume uploaded and parsed successfully!');
        setParsingInProgress(false);
      } else {
        setError('Unsupported file format. Please upload a PDF or DOCX file.');
        setParsingInProgress(false);
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError('Error processing the file. Please try again.');
      setParsingInProgress(false);
    }
  };

  // Extract text from PDF
  const extractTextFromPdf = async (): Promise<string> => {
    // This is a placeholder. In a real application, you would use a PDF parsing library.
    return "PDF text extraction is not implemented in this example.";
  };

  // Handle editor toggle
  const handleEditorToggle = () => {
    if (!showEditor) {
      setEditedContent(resumeContent);
    }
    setShowEditor(!showEditor);
  };

  // Handle save from editor
  const handleSaveFromEditor = (content: string, replacements: Replacement[]) => {
    setResumeContent(content);
    setEditedContent(content);
    setAppliedReplacements(replacements);
    setShowEditor(false);
    setSuccess('Resume updated successfully!');
  };

  // Export as HTML
  const handleExportHtml = () => {
    if (resumeContent) {
      const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : 'resume';
      exportAsHtml(resumeContent, baseName);
      setSuccess('Resume exported as HTML successfully!');
    } else {
      setError('No resume content to export.');
    }
  };

  // Export as TXT
  const handleExportTxt = () => {
    if (resumeContent) {
      const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
      const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : 'resume';
      saveAs(blob, `${baseName}.txt`);
      setSuccess('Resume exported as TXT successfully!');
    } else {
      setError('No resume content to export.');
    }
  };

  // Add a function to handle the "Create Optimized Resume" button
  const handleCreateOptimizedResume = () => {
    if (parsedResumeData) {
      // Store the parsed data in localStorage for the resume builder
      localStorage.setItem('extractedResumeData', JSON.stringify(parsedResumeData));
      
      // Navigate to the resume builder
      navigate('/resume-builder');
    } else {
      setError('No resume data available. Please upload a resume first.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col">
      <Navigation isDark={true} showBack={false} />
      
      <div className="flex-1 flex">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Resume Dashboard</h1>
            
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-md mb-6 flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-900/50 border border-green-500 text-white p-4 rounded-md mb-6">
                <p>{success}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#2A2A2A] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileUp className="w-5 h-5 mr-2 text-[#BCE784]" />
                  Upload Resume
                </h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload your resume (PDF or DOCX)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#BCE784] file:text-black hover:file:bg-[#BCE784]/90"
                  />
                </div>
                
                {fileName && (
                  <div className="text-sm text-gray-300 mb-4">
                    Selected file: <span className="font-medium">{fileName}</span>
                  </div>
                )}
                
                {parsingInProgress && (
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#BCE784]"></div>
                    <span>Parsing resume...</span>
                  </div>
                )}
                
                {parsedResumeData && (
                  <div className="mt-4 p-3 bg-[#1A1A1A] rounded-md">
                    <p className="text-sm text-green-400 mb-2">✓ Resume parsed successfully</p>
                    <p className="text-xs text-gray-400">
                      Extracted information for {parsedResumeData.personalDetails.firstName} {parsedResumeData.personalDetails.lastName}
                    </p>
                    <button
                      onClick={handleCreateOptimizedResume}
                      className="mt-3 w-full bg-[#BCE784] text-black px-3 py-2 rounded-md text-sm font-medium hover:bg-[#BCE784]/90 transition-colors"
                    >
                      Create Optimized Resume
                    </button>
                  </div>
                )}
                
                {resumeContent && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Export Options</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleExportHtml}
                        className="flex items-center bg-[#333333] hover:bg-[#444444] px-3 py-1.5 rounded-md text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export as HTML
                      </button>
                      <button
                        onClick={handleExportTxt}
                        className="flex items-center bg-[#333333] hover:bg-[#444444] px-3 py-1.5 rounded-md text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export as TXT
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-[#2A2A2A] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-[#BCE784]" />
                  Job Description
                </h2>
                
                <div className="mb-4">
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-300 mb-2">
                    Paste the job description here
                  </label>
                  <textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to analyze your resume against it..."
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:border-transparent"
                    rows={8}
                  />
                </div>
                
                <button
                  onClick={handleAnalyze}
                  disabled={!resumeContent || !jobDescription.trim() || loading}
                  className="w-full bg-white text-black px-4 py-2 rounded-md hover:bg-[#BCE784] transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? 'Analyzing...' : 'Analyze Resume'}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#2A2A2A] rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Resume Analysis
                </h2>
                
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BCE784]"></div>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-[#1A1A1A] p-4 rounded-md text-center">
                        <div className="text-2xl font-bold text-[#BCE784]">{analysis.atsScore}%</div>
                        <div className="text-sm text-gray-400">ATS Score</div>
                      </div>
                      <div className="bg-[#1A1A1A] p-4 rounded-md text-center">
                        <div className="text-2xl font-bold text-[#BCE784]">{analysis.keywordScore}%</div>
                        <div className="text-sm text-gray-400">Keyword Match</div>
                      </div>
                      <div className="bg-[#1A1A1A] p-4 rounded-md text-center">
                        <div className="text-2xl font-bold text-[#BCE784]">{analysis.formatScore}%</div>
                        <div className="text-sm text-gray-400">Format Score</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Missing Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((keyword, index) => (
                          <span key={index} className="bg-red-900/30 text-red-300 px-2 py-1 rounded-md text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-md font-medium text-[#BCE784] mb-1">Format Improvements</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {analysis.recommendations.formatImprovements.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-md font-medium text-[#BCE784] mb-1">Keyword Optimization</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {analysis.recommendations.keywordOptimization.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {analysis.replacements.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Suggested Replacements</h3>
                        <div className="space-y-3">
                          {analysis.replacements.slice(0, 3).map((replacement, index) => (
                            <div key={index} className="bg-[#1A1A1A] p-3 rounded-md text-sm">
                              <div className="text-red-400 line-through mb-1">{replacement.target}</div>
                              <div className="text-green-400">{replacement.replacement}</div>
                            </div>
                          ))}
                          {analysis.replacements.length > 3 && (
                            <button
                              onClick={handleEditorToggle}
                              className="text-[#BCE784] text-sm hover:underline"
                            >
                              View all {analysis.replacements.length} suggestions...
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <button
                        onClick={handleEditorToggle}
                        className="w-full bg-[#BCE784] text-black px-4 py-2 rounded-md hover:bg-[#BCE784]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 font-semibold"
                      >
                        Edit with AI Suggestions
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-12">
                    <p>Upload your resume and enter a job description to get an analysis.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {showEditor && analysis && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="bg-[#2A2A2A] rounded-lg w-full max-w-6xl">
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold">Resume Editor</h2>
                <button
                  onClick={handleEditorToggle}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <ResumeEditor
                  resumeText={editedContent || resumeContent}
                  analysis={{...analysis, replacements: appliedReplacements.length ? appliedReplacements : analysis.replacements}}
                  onSave={handleSaveFromEditor}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default Dashboard;