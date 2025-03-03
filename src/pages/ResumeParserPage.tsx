import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeUploader from '../components/ResumeUploader';
import { ResumeData } from '../types/resume';

const ResumeParserPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);

  const handleResumeDataExtracted = (data: ResumeData) => {
    console.log('Extracted resume data:', data);
    setIsProcessing(true);
    
    // Store the extracted data in localStorage to pass it to the form wizard
    localStorage.setItem('extractedResumeData', JSON.stringify(data));
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingComplete(true);
      
      // Automatically navigate after a short delay
      setTimeout(() => {
        navigate('/resume-builder', { state: { resumeData: data } });
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#BCE784]">Resume Parser</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#2A2A2A] text-white rounded-md hover:bg-[#333333] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-300 mb-4">
            Upload your resume in PDF or DOCX format to automatically extract your information.
            The parser will analyze your document and extract key details like personal information,
            work experience, education, and skills.
          </p>
          <p className="text-gray-300">
            After parsing, your data will be used to pre-fill the resume builder form,
            saving you time and effort.
          </p>
        </div>
        
        {isProcessing ? (
          <div className="bg-[#2A2A2A] rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#BCE784] mb-4"></div>
            <p className="text-xl font-medium text-white">Processing your resume...</p>
            <p className="text-gray-400 mt-2">Extracting information and preparing your data</p>
          </div>
        ) : processingComplete ? (
          <div className="bg-[#2A2A2A] rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-[#BCE784] rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-medium text-white">Resume processed successfully!</p>
            <p className="text-gray-400 mt-2">Redirecting you to the resume builder...</p>
          </div>
        ) : (
          <ResumeUploader onResumeDataExtracted={handleResumeDataExtracted} />
        )}
        
        {!isProcessing && !processingComplete && (
          <div className="mt-12 bg-[#2A2A2A] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1A1A1A] p-4 rounded-md">
                <div className="text-[#BCE784] text-2xl font-bold mb-2">1</div>
                <h3 className="text-lg font-medium mb-2">Upload Your Resume</h3>
                <p className="text-gray-400">Upload your existing resume in PDF or DOCX format.</p>
              </div>
              
              <div className="bg-[#1A1A1A] p-4 rounded-md">
                <div className="text-[#BCE784] text-2xl font-bold mb-2">2</div>
                <h3 className="text-lg font-medium mb-2">Automatic Extraction</h3>
                <p className="text-gray-400">Our system analyzes your document and extracts key information.</p>
              </div>
              
              <div className="bg-[#1A1A1A] p-4 rounded-md">
                <div className="text-[#BCE784] text-2xl font-bold mb-2">3</div>
                <h3 className="text-lg font-medium mb-2">Pre-filled Form</h3>
                <p className="text-gray-400">The resume builder form is automatically filled with your data.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeParserPage; 