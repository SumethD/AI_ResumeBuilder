import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  ResumeData, 
  PersonalDetails, 
  ContactInfo, 
  Employment, 
  Education, 
  AdditionalSection 
} from '../types/resume';

// Default empty resume data
const defaultResumeData: ResumeData & { isInitialized?: boolean } = {
  personalDetails: {
    firstName: '',
    lastName: '',
    title: '',
    dateOfBirth: '',
    nationality: '',
    summary: ''
  },
  contactInfo: {
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    linkedin: '',
    website: ''
  },
  employment: [],
  education: [],
  skills: [],
  additionalSections: [],
  isInitialized: false
};

// Context type definition
interface ResumeFormContextType {
  formData: ResumeData & { isInitialized?: boolean };
  currentStep: number;
  updatePersonalDetails: (details: PersonalDetails) => void;
  updateContactInfo: (info: ContactInfo) => void;
  updateEmployment: (employment: Employment[]) => void;
  updateEducation: (education: Education[]) => void;
  updateSkills: (skills: string[]) => void;
  updateAdditionalSections: (sections: AdditionalSection[]) => void;
  setFormData: (data: ResumeData & { isInitialized?: boolean }) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
}

// Create context with default values
const ResumeFormContext = createContext<ResumeFormContextType>({
  formData: defaultResumeData,
  currentStep: 1,
  updatePersonalDetails: () => {},
  updateContactInfo: () => {},
  updateEmployment: () => {},
  updateEducation: () => {},
  updateSkills: () => {},
  updateAdditionalSections: () => {},
  setFormData: () => {},
  goToNextStep: () => {},
  goToPreviousStep: () => {},
  goToStep: () => {}
});

// Provider props type
interface ResumeFormProviderProps {
  children: ReactNode;
}

// Provider component
export const ResumeFormProvider: React.FC<ResumeFormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<ResumeData & { isInitialized?: boolean }>(defaultResumeData);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Update functions for each section
  const updatePersonalDetails = (details: PersonalDetails) => {
    setFormData(prev => ({
      ...prev,
      personalDetails: details
    }));
  };
  
  const updateContactInfo = (info: ContactInfo) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: info
    }));
  };
  
  const updateEmployment = (employment: Employment[]) => {
    setFormData(prev => ({
      ...prev,
      employment
    }));
  };
  
  const updateEducation = (education: Education[]) => {
    setFormData(prev => ({
      ...prev,
      education
    }));
  };
  
  const updateSkills = (skills: string[]) => {
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };
  
  const updateAdditionalSections = (sections: AdditionalSection[]) => {
    setFormData(prev => ({
      ...prev,
      additionalSections: sections
    }));
  };
  
  // Navigation functions
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7)); // 7 is the last step (Review)
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1)); // 1 is the first step
  };
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 7) {
      setCurrentStep(step);
    }
  };
  
  // Context value
  const value = {
    formData,
    currentStep,
    updatePersonalDetails,
    updateContactInfo,
    updateEmployment,
    updateEducation,
    updateSkills,
    updateAdditionalSections,
    setFormData,
    goToNextStep,
    goToPreviousStep,
    goToStep
  };
  
  return (
    <ResumeFormContext.Provider value={value}>
      {children}
    </ResumeFormContext.Provider>
  );
};

// Custom hook to use the context
export const useResumeForm = () => {
  const context = useContext(ResumeFormContext);
  if (!context) {
    throw new Error('useResumeForm must be used within a ResumeFormProvider');
  }
  return context;
};

export default ResumeFormContext; 