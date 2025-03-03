import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ResumeFormProvider, useResumeForm } from '../context/ResumeFormContext';
import PersonalDetailsStep from './steps/PersonalDetailsStep';
import ContactInfoStep from './steps/ContactInfoStep';
import EmploymentHistoryStep from './steps/EmploymentHistoryStep';
import EducationStep from './steps/EducationStep';
import SkillsStep from './steps/SkillsStep';
import AdditionalSectionsStep from './steps/AdditionalSectionsStep';
import ReviewStep from './steps/ReviewStep';
import type { ResumeData } from '../types/resume';

// Wrapper component that uses the context
const FormWizardContent: React.FC = () => {
  const { currentStep, setFormData, formData } = useResumeForm();
  const location = useLocation();
  
  // Check for resume data from parser in location state or localStorage
  useEffect(() => {
    // First check location state (from direct navigation)
    const stateData = location.state?.resumeData as ResumeData | undefined;
    
    // Then check localStorage (in case of page refresh)
    const storedData = localStorage.getItem('extractedResumeData');
    const parsedData = storedData ? JSON.parse(storedData) as ResumeData : undefined;
    
    // Use data from either source if available
    const resumeData = stateData || parsedData;
    
    if (resumeData && !formData.isInitialized) {
      console.log('Initializing form with extracted resume data:', resumeData);
      
      // Update form data with the extracted resume data
      setFormData({
        ...formData,
        personalDetails: resumeData.personalDetails,
        contactInfo: resumeData.contactInfo,
        employment: resumeData.employment,
        education: resumeData.education,
        skills: resumeData.skills,
        additionalSections: resumeData.additionalSections,
        isInitialized: true
      });
      
      // Clear localStorage after using the data
      localStorage.removeItem('extractedResumeData');
    }
  }, [location, setFormData, formData]);

  // Render the appropriate step based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsStep />;
      case 2:
        return <ContactInfoStep />;
      case 3:
        return <EmploymentHistoryStep />;
      case 4:
        return <EducationStep />;
      case 5:
        return <SkillsStep />;
      case 6:
        return <AdditionalSectionsStep />;
      case 7:
        return <ReviewStep />;
      default:
        return <PersonalDetailsStep />;
    }
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / 7) * 100;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#BCE784]">Resume Builder</h1>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#BCE784] transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span className={currentStep >= 1 ? "text-[#BCE784]" : ""}>Personal</span>
            <span className={currentStep >= 2 ? "text-[#BCE784]" : ""}>Contact</span>
            <span className={currentStep >= 3 ? "text-[#BCE784]" : ""}>Employment</span>
            <span className={currentStep >= 4 ? "text-[#BCE784]" : ""}>Education</span>
            <span className={currentStep >= 5 ? "text-[#BCE784]" : ""}>Skills</span>
            <span className={currentStep >= 6 ? "text-[#BCE784]" : ""}>Additional</span>
            <span className={currentStep >= 7 ? "text-[#BCE784]" : ""}>Review</span>
          </div>
        </div>
        
        {/* Current step content */}
        <div className="bg-[#2A2A2A] rounded-lg p-6 shadow-lg">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

// Main component that provides the context
const ResumeFormWizard: React.FC = () => {
  return (
    <ResumeFormProvider>
      <FormWizardContent />
    </ResumeFormProvider>
  );
};

export default ResumeFormWizard; 