import React from 'react';
import { ResumeSection } from '../types/resume';

interface FormNavigationProps {
  activeSection: ResumeSection;
  onSectionChange: (section: ResumeSection) => void;
  allSectionsEditable?: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({ 
  activeSection, 
  onSectionChange,
  allSectionsEditable = false
}) => {
  const navItems = [
    { id: 'personalDetails', label: 'Personal Details', icon: '👤' },
    { id: 'contactInfo', label: 'Contact Info', icon: '📞' },
    { id: 'summary', label: 'Summary', icon: '📝' },
    { id: 'employment', label: 'Employment', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '🛠️' },
    { id: 'additional', label: 'Additional', icon: '➕' }
  ];

  // If allSectionsEditable is true, all sections should be enabled
  // Otherwise, use the default behavior (only enable sections that have data)

  return (
    <div className="bg-black/40 rounded-lg p-5">
      <div className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id as ResumeSection)}
            className={`w-full text-left py-3.5 px-4 rounded-lg flex items-center space-x-3 transition-colors ${
              activeSection === item.id
                ? 'bg-[#BCE784]/20 text-[#BCE784] font-medium'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      
      <button
        className="w-full mt-8 border border-dashed border-white/20 text-white/50 py-3 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center space-x-2"
      >
        <span>+</span>
        <span>Add Section</span>
      </button>
    </div>
  );
};

export default FormNavigation; 