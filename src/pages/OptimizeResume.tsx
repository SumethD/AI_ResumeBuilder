import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import ResumeBuilder from '../components/ResumeBuilder';
import TemplateSelector from '../components/TemplateSelector';
import { ResumeData } from '../types/resume';
import { parseResumeContent } from '../utils/resumeParser';

interface LocationState {
  resumeData?: ResumeData;
  resumeContent?: string;
  jobDescription?: string;
  [key: string]: string | boolean | ResumeData | undefined;
}

const OptimizeResume: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState<'template' | 'builder'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Parse resume content on component mount
  useEffect(() => {
    const state = location.state as LocationState;
    
    if (state?.resumeData) {
      // If resumeData is already provided, use it directly
      setResumeData(state.resumeData);
    } else if (state?.resumeContent) {
      // If only raw content is provided, parse it
      setIsLoading(true);
      try {
        const parsedData = parseResumeContent(state.resumeContent);
        setResumeData(parsedData);
      } catch (err) {
        console.error('Error parsing resume:', err);
        setError('Failed to parse resume content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [location.state]);

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setActiveStep('builder');
  };

  // Handle save from builder
  const handleSaveResume = (data: ResumeData) => {
    // Save the resume data
    console.log('Resume saved:', data);
    
    // Navigate back to dashboard with success message
    navigate('/dashboard', { 
      state: { 
        message: 'Resume successfully optimized!',
        success: true,
        resumeData: data
      } 
    });
  };

  // Handle back button click
  const handleBack = () => {
    if (activeStep === 'builder') {
      setActiveStep('template');
    } else {
      navigate('/dashboard');
    }
  };

  // Render content based on loading state and active step
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BCE784]"></div>
        </div>
      );
    }
    
    if (activeStep === 'template') {
      return (
        <div className="bg-black/30 rounded-xl p-6 md:p-8">
          <TemplateSelector onSelectTemplate={handleSelectTemplate} />
        </div>
      );
    }
    
    return (
      <ResumeBuilder 
        initialData={resumeData || undefined} 
        onSave={handleSaveResume}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navigation />
      
      <main className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 relative">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>{activeStep === 'builder' ? 'Back to Templates' : 'Back to Dashboard'}</span>
        </button>
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#BCE784] mb-4">
            {activeStep === 'template' ? 'Choose a Resume Template' : 'Optimize Your Resume'}
          </h1>
          <p className="text-white/70 max-w-3xl">
            {activeStep === 'template' 
              ? 'Select a professional template that best showcases your skills and experience.'
              : 'Customize your resume content to highlight your strengths and match job requirements.'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {renderContent()}
      </main>
    </div>
  );
};

export default OptimizeResume; 