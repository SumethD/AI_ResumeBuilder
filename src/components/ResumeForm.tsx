import React from 'react';
import { ResumeData, ResumeSection } from '../types/resume';
import FormNavigation from './FormNavigation';
import PersonalDetailsForm from './PersonalDetailsForm';
import ContactInfoForm from './ContactInfoForm';
import SummaryForm from './SummaryForm';

interface ResumeFormProps {
  resumeData: ResumeData;
  activeSection: ResumeSection;
  onSectionChange: (section: ResumeSection) => void;
  onChange: (data: Partial<ResumeData>) => void;
  allSectionsEditable?: boolean;
  jobDescription?: string;
}

const ResumeForm: React.FC<ResumeFormProps> = ({
  resumeData,
  activeSection,
  onSectionChange,
  onChange,
  allSectionsEditable = false,
  jobDescription
}) => {
  const sections: ResumeSection[] = [
    'personalDetails',
    'contactInfo',
    'summary',
    'employment',
    'education',
    'skills',
    'additional'
  ];

  const currentSectionIndex = sections.indexOf(activeSection);

  const handleNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      onSectionChange(sections[currentSectionIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      onSectionChange(sections[currentSectionIndex - 1]);
    }
  };

  const renderFormSection = () => {
    switch (activeSection) {
      case 'personalDetails':
        return (
          <PersonalDetailsForm
            data={resumeData.personalDetails || {}}
            onChange={(data) => onChange({ personalDetails: data })}
          />
        );
      case 'contactInfo':
        return (
          <ContactInfoForm
            data={resumeData.contactInfo || {}}
            onChange={(data) => onChange({ contactInfo: data })}
          />
        );
      case 'summary':
        return (
          <SummaryForm
            data={resumeData.summary || ''}
            onChange={(summary) => onChange({ summary })}
          />
        );
      // Additional form sections would be added here
      default:
        return (
          <div className="bg-black/30 rounded-lg p-8 flex items-center justify-center">
            <p className="text-white/70">This section is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[650px] w-full max-w-[1400px] mx-auto">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 border-r border-[#BCE784]/20">
        <FormNavigation
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          allSectionsEditable={allSectionsEditable}
        />
      </div>
      
      {/* Form Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {renderFormSection()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="p-5 border-t border-[#BCE784]/20 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
              className={`px-5 py-3.5 rounded-lg ${
                currentSectionIndex === 0
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentSectionIndex === sections.length - 1}
              className={`px-5 py-3.5 rounded-lg ${
                currentSectionIndex === sections.length - 1
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-[#BCE784]/20 text-[#BCE784] hover:bg-[#BCE784]/30'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;