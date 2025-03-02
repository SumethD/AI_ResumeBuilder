import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileUp, Download, Briefcase, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Sidebar from '../components/Sidebar';
import OpenAI from 'openai';
import { extractTextFromDocx, processAndSaveDocx, applyTemplateToDocx } from '../utils/docxProcessor';
import ResumeEditor from '../components/ResumeEditor';
import { exportAsHtml } from '../utils/htmlExporter';
import TemplateSelector from '../components/TemplateSelector';
import ResumeBuilder from '../components/ResumeBuilder';
import { ResumeData } from '../types/resume';
import { saveAs } from 'file-saver';

// Types for the analysis results
interface Replacement {
  target: string;
  replacement: string;
  section: string;
  applied?: boolean;
  id?: string;
}

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

// Define a type for the location state
interface LocationState {
  message?: string;
  success?: boolean;
  resumeData?: ResumeData;
  [key: string]: string | boolean | ResumeData | undefined;
}

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [resumeContent, setResumeContent] = useState<string>('');
  const [xmlContent, setXmlContent] = useState<string>('');
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  // Handle responsive sidebar behavior
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle location state (for returning from OptimizeResume page)
  useEffect(() => {
    if (location.state) {
      const { message, success, resumeData: returnedResumeData } = location.state as LocationState;
      
      if (message) {
        if (success) {
          setSuccess(message);
        } else {
          setError(message);
        }
      }
      
      if (returnedResumeData) {
        setResumeData(returnedResumeData);
      }
      
      // Clear the location state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Analyze resume with OpenAI
  const analyzeResume = async (resumeText: string, jobDesc: string, xmlContent: string) => {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('OpenAI API key is not configured. Please add your API key to the environment variables.');
      }
  
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
  
      // First analyze the document structure
      const structureResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert in analyzing Microsoft Word OOXML document structure. Focus on identifying paragraph styles and document sections."
          },
          {
            role: "user",
            content: `Analyze this Word document XML and identify the common paragraph and text styles used. Return a JSON object with:
              1. The most common paragraph style tag
              2. The most common text run style tag
              3. Identified document sections (e.g., summary, experience, education)
              4. The font style and size used in the document
              
              Document XML:
              ${xmlContent}`
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
  
      const structureAnalysis = JSON.parse(structureResponse.choices[0].message.content || '{}');
  
      // Then analyze the resume content
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert ATS system and resume analyzer. You must respond with valid JSON only."
          },
          {
            role: "user",
            content: `Analyze this resume against the job description and respond with a JSON object containing:
              {
                "atsScore": (number 0-100),
                "keywordScore": (number 0-100),
                "formatScore": (number 0-100),
                "missingKeywords": (string array),
                "suggestedLines": (array of objects with: {
                  "content": (the line to insert),
                  "section": (the section heading under which the line should be inserted)
                }),
                "insertPositions": (array of objects with: {
                  "content": (the line to insert),
                  "style": (the XML style to use, based on the document analysis),
                  "section": (which section to insert after, e.g., "summary", "experience", "skills")
                }),
                "replacements": (array of objects with: {
                  "target": (the text to be replaced - should be a complete sentence or bullet point),
                  "replacement": (the new text to replace it with - should be approximately the same length),
                  "section": (which section the text is in, e.g., "summary", "experience", "skills")
                }),
                "recommendations": {
                  "formatImprovements": (string array),
                  "keywordOptimization": (string array)
                }
              }
              
              Resume Text:
              ${resumeText}
              
              Document Structure Analysis:
              ${JSON.stringify(structureAnalysis)}
              
              Job Description:
              ${jobDesc}
              
              IMPORTANT GUIDELINES:
              1. For replacements, identify weak or irrelevant sentences/bullet points and replace them with stronger alternatives that include missing keywords.
              2. Ensure replacement text is approximately the same length as the original to maintain document formatting.
              3. Focus on replacing content that doesn't align with the job description.
              4. Prioritize adding missing keywords from the job description.
              5. Maintain the original tone and style of the resume.`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
  
      if (!response.choices[0].message.content) {
        throw new Error('No response received from OpenAI');
      }
  
      const result = JSON.parse(response.choices[0].message.content);
      
      if (!result.atsScore || !result.keywordScore || !result.formatScore || 
          !Array.isArray(result.missingKeywords) || !Array.isArray(result.suggestedLines) ||
          !Array.isArray(result.insertPositions) || !result.recommendations) {
        throw new Error('Invalid response format from OpenAI');
      }
      
      // Ensure replacements array exists
      if (!Array.isArray(result.replacements)) {
        result.replacements = [];
      }
      
      return result as AnalysisResult;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Failed to analyze resume with OpenAI');
    }
  };

  // Handle file selection
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFileName(file.name);
    setCurrentFile(file);
    setIsBuilderMode(false);
    setError(null);

    try {
      // Extract text from the DOCX file
      const content = await extractTextFromDocx(file);
      
      // Store the extracted text for analysis
      setResumeContent(content);
      setXmlContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while reading the file');
      setFileName(null);
      setCurrentFile(null);
    }
  };

  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/dashboard' } });
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      setAnalysis(null);
      setIsEditorMode(false);

      if (!jobDescription.trim()) {
        throw new Error('Please enter a job description first');
      }

      if (!resumeContent) {
        throw new Error('Please select a resume file first');
      }

      const analysisResult = await analyzeResume(resumeContent, jobDescription, xmlContent);
      setAnalysis(analysisResult);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while analyzing the resume');
      setLoading(false);
    }
  };

  // Handle editor mode toggle
  const handleEditorToggle = () => {
    setIsEditorMode(true);
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  // Handle save from editor
  const handleSaveFromEditor = async (editedContent: string, appliedReplacements: Replacement[]) => {
    try {
      if (!fileName || !currentFile) {
        throw new Error('No file selected');
      }
      
      // First, export the edited content as HTML for preview
      exportAsHtml(editedContent, fileName);
      
      // Process the edited content into sections
      const sections = processEditedContentIntoSections(editedContent);
      
      // If a template is selected, apply it
      if (selectedTemplate) {
        const modifiedDoc = await applyTemplateToDocx(currentFile, selectedTemplate, sections);
        
        // Save the file
        const newFileName = fileName.replace('.docx', '_template.docx');
        saveAs(modifiedDoc, newFileName);
      } else {
        // Otherwise, use the original DOCX processing
        if (fileName.endsWith('.docx')) {
          await processAndSaveDocx(currentFile, appliedReplacements);
        }
      }
      
      setSuccess('Your improved resume has been downloaded in both HTML and DOCX formats.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the file');
    }
  };

  // Add this function to process edited content into sections
  const processEditedContentIntoSections = (htmlContent: string): { title: string; content: string[] }[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const sections: { title: string; content: string[] }[] = [];
    let currentSection: { title: string; content: string[] } | null = null;
    
    // Process each element in the HTML
    Array.from(doc.body.children).forEach(element => {
      if (element.tagName === 'H2') {
        // If we find a heading, start a new section
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: element.textContent || 'SECTION',
          content: []
        };
      } else if (currentSection && element.textContent) {
        // Add content to the current section
        currentSection.content.push(element.textContent);
      }
    });
    
    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  // Handle optimize button click
  const handleOptimizeResume = () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    // Validate that both resume and job description are entered
    if (!resumeContent) {
      setError('Please upload a resume file first');
      return;
    }
    
    if (!jobDescription.trim()) {
      setError('Please enter a job description first');
      return;
    }
    
    // Navigate to the dedicated optimize resume page
    navigate('/optimize-resume', {
      state: {
        resumeData: resumeData || undefined,
        jobDescription,
        resumeContent
      }
    });
  };
  
  // Handle save from builder
  const handleSaveFromBuilder = (data: ResumeData) => {
    console.log('Saved resume data:', data);
    setResumeData(data); // Save the resume data
    setIsBuilderMode(false);
    setSuccess('Your improved resume has been downloaded in both HTML and DOCX formats.');
  };

  const ScoreDisplay = ({ score, label }: { score: number; label: string }) => (
    <div className="bg-black/30 border border-[#BCE784]/30 p-3 sm:p-4 rounded-lg">
      <div className="text-xl sm:text-2xl font-bold text-[#BCE784]">{score}%</div>
      <div className="text-sm text-[#BCE784]/70">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#0D0D0D] text-white">
      <Navigation />
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <main className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative">
          <div className="container mx-auto px-0 py-8 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0 text-[#BCE784]">Resume Builder</h1>
              
              {!isBuilderMode && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="relative flex items-center justify-center bg-black/30 border border-[#BCE784]/30 rounded-lg px-4 py-3 cursor-pointer hover:bg-black/40 transition-colors group">
                    <FileUp className="w-5 h-5 mr-3 text-[#BCE784]" />
                    <span className="text-white/90">Upload Resume</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".docx"
                    />
                    <div className="absolute inset-0 border border-[#BCE784] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </label>
                  
                  <button
                    onClick={handleEditorToggle}
                    className="bg-[#BCE784]/20 text-[#BCE784] px-4 py-3 rounded-lg hover:bg-[#BCE784]/30 transition-colors flex items-center justify-center"
                  >
                    <span>Create New Resume</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Main Content */}
            {isBuilderMode ? (
              <div className="w-full overflow-x-auto">
                <ResumeBuilder
                  onSave={handleSaveFromBuilder}
                />
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setIsBuilderMode(false)}
                    className="bg-white/10 text-white px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Back to Analysis
                  </button>
                </div>
              </div>
            ) : isEditorMode ? (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Interactive Resume Editor</h1>
                  <button
                    onClick={() => setIsEditorMode(false)}
                    className="px-4 py-2 rounded-md bg-black/30 text-white hover:bg-black/50 transition-colors"
                  >
                    Back to Analysis
                  </button>
                </div>
                
                {resumeContent && analysis && (
                  <>
                    <ResumeEditor 
                      resumeText={resumeContent} 
                      analysis={analysis} 
                      onSave={handleSaveFromEditor} 
                    />
                    
                    {/* Add the template selector */}
                    <div className="mt-8 bg-black/20 rounded-xl p-6">
                      <TemplateSelector onSelectTemplate={handleTemplateSelect} />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-md overflow-hidden p-4 sm:p-6 lg:p-8 mb-8 relative">
                <div className="text-center mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Resume ATS Analyzer</h1>
                  <p className="text-sm sm:text-base text-[#BCE784]">Improve your resume's ATS compatibility and job match</p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Job Description Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#BCE784]">
                      <Briefcase className="w-4 h-4 inline-block mr-1" />
                      Job Description
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full h-32 sm:h-40 rounded-md bg-black/30 border-[#BCE784]/30 text-white shadow-sm focus:border-[#BCE784] focus:ring-[#BCE784] text-sm p-2 border"
                      placeholder="Paste the job description here..."
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-[#BCE784] mb-2">
                      <FileUp className="w-4 h-4 inline-block mr-1" />
                      Upload Resume (DOCX)
                    </label>
                    <div className="mt-1 flex justify-center px-4 sm:px-6 pt-4 pb-5 border-2 border-[#BCE784]/30 border-dashed rounded-md hover:border-[#BCE784] transition-colors bg-black/30">
                      <div className="space-y-1 text-center">
                        <Download className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-[#BCE784]" />
                        <div className="flex flex-col sm:flex-row items-center text-sm text-[#BCE784] space-y-2 sm:space-y-0">
                          <label className="relative cursor-pointer rounded-md font-medium text-[#BCE784] hover:text-[#BCE784]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#BCE784]">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".docx"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="sm:pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-400">DOCX files only</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={handleAnalyze}
                      disabled={!resumeContent || !jobDescription.trim() || loading}
                      className="flex-1 bg-white text-black px-4 py-2 rounded-md hover:bg-[#BCE784] transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base"
                    >
                      {loading ? 'Analyzing...' : 'Analyze Resume'}
                    </button>
                    
                    <button
                      onClick={handleOptimizeResume}
                      className="flex-1 bg-[#BCE784] text-black px-4 py-2 rounded-md hover:bg-[#BCE784]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 font-semibold text-sm sm:text-base"
                    >
                      Create/Optimize Resume
                    </button>
                    
                    {analysis && (
                      <button
                        onClick={handleEditorToggle}
                        className="flex-1 bg-white text-black px-4 py-2 rounded-md hover:bg-[#BCE784] transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 font-semibold text-sm sm:text-base"
                      >
                        Edit with AI Suggestions
                      </button>
                    )}
                  </div>

                  {/* Loading State */}
                  {loading && (
                    <div className="text-center py-3 sm:py-4">
                      <div className="animate-spin rounded-full h-7 w-7 sm:h-8 sm:w-8 border-b-2 border-[#BCE784] mx-auto"></div>
                      <p className="mt-2 text-sm text-[#BCE784]">Analyzing your resume...</p>
                    </div>
                  )}

                  {/* Analysis Results */}
                  {analysis && (
                    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                      <h2 className="text-lg sm:text-xl font-semibold text-[#BCE784] mb-4">Analysis Results</h2>
                      
                      {/* Scores */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <ScoreDisplay score={analysis.atsScore} label="ATS Score" />
                        <ScoreDisplay score={analysis.keywordScore} label="Keyword Match" />
                        <ScoreDisplay score={analysis.formatScore} label="Format Score" />
                      </div>

                      {/* Missing Keywords */}
                      <div className="bg-yellow-900/30 border border-yellow-500/50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-yellow-400 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Missing Keywords
                        </h3>
                        <div className="mt-2 text-sm text-yellow-300">
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis.missingKeywords.map((keyword, index) => (
                              <li key={index}>{keyword}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-black/30 border border-[#BCE784]/30 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-[#BCE784] flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Recommendations
                        </h3>
                        <div className="mt-2 text-sm text-[#BCE784]/90">
                          <ul className="list-disc pl-5 space-y-1">
                            <li className="font-medium">Format Improvements</li>
                            {analysis.recommendations.formatImprovements.map((improvement, index) => (
                              <li key={index} className="ml-4">{improvement}</li>
                            ))}
                            <li className="font-medium mt-2">Keyword Optimization</li>
                            {analysis.recommendations.keywordOptimization.map((keyword, index) => (
                              <li key={index} className="ml-4">{keyword}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Messages */}
                  {error && (
                    <div className="rounded-md bg-red-900/50 border border-red-500 p-3 sm:p-4 mt-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-400">Error</h3>
                          <div className="mt-2 text-sm text-red-300">
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="rounded-md bg-[#BCE784]/20 border border-[#BCE784] p-3 sm:p-4 mt-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-[#BCE784]">Success!</h3>
                          <div className="mt-2 text-sm text-[#BCE784]/80">
                            <p>{success}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {fileName && (
                    <p className="text-sm text-[#BCE784]/70 mt-2">
                      Selected file: {fileName}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;