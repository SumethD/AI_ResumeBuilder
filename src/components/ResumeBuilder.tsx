import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, Download } from 'lucide-react';
import { ResumeData, ResumeSection } from '../types/resume';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';

interface ResumeBuilderProps {
  initialData?: ResumeData;
  onSave?: (data: ResumeData) => void;
  jobDescription?: string;
  allSectionsEditable?: boolean;
  selectedTemplate?: string;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ 
  initialData, 
  onSave,
  jobDescription,
  allSectionsEditable = false,
  selectedTemplate: initialTemplate
}) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData || {
    personalDetails: {},
    contactInfo: {},
    summary: '',
    employment: [],
    education: [],
    skills: [],
    additionalSections: []
  });
  
  const [activeSection, setActiveSection] = useState<ResumeSection>('personalDetails');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialTemplate || 'modern');
  const [showPreview, setShowPreview] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Check if we're in mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);
  
  // Calculate progress
  useEffect(() => {
    let completedSections = 0;
    let totalSections = 0;
    
    // Check personal details
    if (resumeData.personalDetails) {
      totalSections++;
      if (resumeData.personalDetails.firstName && resumeData.personalDetails.lastName) {
        completedSections++;
      }
    }
    
    // Check contact info
    if (resumeData.contactInfo) {
      totalSections++;
      if (resumeData.contactInfo.email && resumeData.contactInfo.phone) {
        completedSections++;
      }
    }
    
    // Check summary
    if (resumeData.summary !== undefined) {
      totalSections++;
      if (resumeData.summary.trim().length > 0) {
        completedSections++;
      }
    }
    
    // Check employment
    totalSections++;
    if (resumeData.employment && resumeData.employment.length > 0) {
      completedSections++;
    }
    
    // Check education
    totalSections++;
    if (resumeData.education && resumeData.education.length > 0) {
      completedSections++;
    }
    
    // Check skills
    totalSections++;
    if (resumeData.skills && resumeData.skills.length > 0) {
      completedSections++;
    }
    
    const calculatedProgress = Math.round((completedSections / totalSections) * 100);
    setProgress(calculatedProgress);
  }, [resumeData]);
  
  const handleFormChange = (data: Partial<ResumeData>) => {
    setResumeData(prevData => ({
      ...prevData,
      ...data
    }));
  };
  
  const handleSectionChange = (section: ResumeSection) => {
    setActiveSection(section);
    if (isMobileView) {
      setShowPreview(false);
    }
  };
  
  const togglePreview = () => {
    setShowPreview(prev => !prev);
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(resumeData);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-black/20 rounded-xl p-4 md:p-6 min-h-[750px] w-full max-w-[1600px] mx-auto">
      {/* Mobile view controls */}
      {isMobileView && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#BCE784]">
            {showPreview ? 'Resume Preview' : 'Resume Builder'}
          </h2>
          <button
            onClick={togglePreview}
            className="bg-[#BCE784]/20 text-[#BCE784] px-5 py-2.5 rounded-lg flex items-center space-x-3"
          >
            {showPreview ? (
              <>
                <ArrowLeft className="w-5 h-5" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <span>Preview</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Form Panel */}
      {(!isMobileView || !showPreview) && (
        <div className="flex-1 bg-black/30 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#BCE784]/20 p-4 border-b border-[#BCE784]/30 flex justify-between items-center">
            <h3 className="font-medium text-[#BCE784] text-lg">Resume Builder</h3>
            <div className="text-sm text-white/70">
              <span className="font-medium text-[#BCE784]">{progress}%</span> complete
            </div>
          </div>
          
          <div className="w-full overflow-x-auto px-2 sm:px-4">
            <ResumeForm
              resumeData={resumeData}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              onChange={handleFormChange}
              allSectionsEditable={allSectionsEditable}
              jobDescription={jobDescription}
            />
          </div>
          
          <div className="p-5 border-t border-[#BCE784]/30 bg-black/40 flex justify-between">
            <button
              onClick={handleSave}
              className="bg-[#BCE784] text-black px-5 py-2.5 rounded-md hover:bg-[#BCE784]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 font-semibold flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Resume</span>
            </button>
            
            {isMobileView && (
              <button
                onClick={togglePreview}
                className="bg-white/10 text-white px-5 py-2.5 rounded-md hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 font-medium flex items-center space-x-2"
              >
                <span>Preview</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Preview Panel */}
      {(!isMobileView || showPreview) && (
        <div className="w-full lg:w-[700px] bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 text-lg">Resume Preview</h3>
            <button
              className="bg-[#BCE784] text-black px-4 py-2 rounded-md text-sm hover:bg-[#BCE784]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 font-medium flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
          
          <ResumePreview 
            resumeData={resumeData} 
            templateId={selectedTemplate} 
          />
          
          {isMobileView && (
            <div className="p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={togglePreview}
                className="w-full bg-gray-200 text-gray-800 px-5 py-2.5 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 font-medium flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Editor</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder; 