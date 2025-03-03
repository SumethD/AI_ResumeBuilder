import React, { useState } from 'react';
import { parseResumeFile } from '../utils/resumeParser';
import { ResumeData } from '../types/resume';

interface ResumeUploaderProps {
  onResumeDataExtracted?: (data: ResumeData) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onResumeDataExtracted }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Reset states
    setFile(selectedFile);
    setError(null);
    setResumeData(null);
    
    // Validate file type
    const fileType = selectedFile.type;
    if (fileType !== 'application/pdf' && 
        fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Parse the resume file
      const data = await parseResumeFile(file);
      
      // Update state with the parsed data
      setResumeData(data);
      
      // Call the callback if provided
      if (onResumeDataExtracted) {
        onResumeDataExtracted(data);
      }
    } catch (err) {
      console.error('Error parsing resume:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while parsing the resume.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#2A2A2A] rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">Upload Resume</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload your resume (PDF or DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#BCE784] file:text-black hover:file:bg-[#BCE784]/90"
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!file || isLoading}
          className="w-full bg-[#BCE784] text-black px-4 py-2 rounded-md hover:bg-[#BCE784]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isLoading ? 'Processing...' : 'Parse Resume'}
        </button>
      </form>
      
      {isLoading && (
        <div className="mt-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BCE784]"></div>
        </div>
      )}
      
      {resumeData && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 text-white">Extracted Resume Data</h3>
          
          <div className="bg-[#1A1A1A] p-4 rounded-md overflow-auto max-h-96">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap">
              {JSON.stringify(resumeData, null, 2)}
            </pre>
          </div>
          
          {/* Display a summary of the extracted information */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1A1A1A] p-4 rounded-md">
              <h4 className="text-md font-medium mb-2 text-[#BCE784]">Personal Details</h4>
              <p className="text-white">
                {resumeData.personalDetails.firstName} {resumeData.personalDetails.lastName}
              </p>
              <p className="text-gray-400">{resumeData.personalDetails.title}</p>
            </div>
            
            <div className="bg-[#1A1A1A] p-4 rounded-md">
              <h4 className="text-md font-medium mb-2 text-[#BCE784]">Contact Information</h4>
              <p className="text-white">{resumeData.contactInfo.email}</p>
              <p className="text-white">{resumeData.contactInfo.phone}</p>
            </div>
            
            <div className="bg-[#1A1A1A] p-4 rounded-md md:col-span-2">
              <h4 className="text-md font-medium mb-2 text-[#BCE784]">Skills ({resumeData.skills.length})</h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.slice(0, 10).map((skill, index) => (
                  <span key={index} className="bg-[#333333] text-white px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                {resumeData.skills.length > 10 && (
                  <span className="bg-[#333333] text-white px-3 py-1 rounded-full text-sm">
                    +{resumeData.skills.length - 10} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader; 