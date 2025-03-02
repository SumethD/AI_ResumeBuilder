import React, { useState, useEffect } from 'react';
import { getAvailableTemplates } from '../utils/docxProcessor';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const availableTemplates = await getAvailableTemplates();
        setTemplates(availableTemplates);
        
        // Select the first template by default
        if (availableTemplates.length > 0) {
          setSelectedTemplate(availableTemplates[0].id);
          onSelectTemplate(availableTemplates[0].id);
        }
      } catch (err: unknown) {
        console.error('Failed to load templates:', err);
        setError('Failed to load resume templates');
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, [onSelectTemplate]);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    onSelectTemplate(templateId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BCE784]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-500 p-4 rounded-lg">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-medium text-[#BCE784] mb-2 md:mb-0">Choose Your Resume Template</h3>
        <p className="text-white/70 text-sm md:text-base">Select a design that best represents your professional identity</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedTemplate === template.id
                ? 'border-[#BCE784] ring-2 ring-[#BCE784] transform scale-[1.03] shadow-xl'
                : 'border-white/20 hover:border-white/40'
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <div className="aspect-w-16 aspect-h-9 bg-black/40 relative group">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className={`px-4 py-2 rounded-full ${
                  selectedTemplate === template.id 
                    ? 'bg-[#BCE784] text-black' 
                    : 'bg-white/20 text-white'
                } font-medium`}>
                  {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-white text-lg">{template.name}</h4>
              <p className="text-sm text-white/70 mt-1">{template.description}</p>
              {selectedTemplate === template.id && (
                <div className="mt-3 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#BCE784] mr-2"></div>
                  <span className="text-[#BCE784] text-sm font-medium">Currently Selected</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {templates.length === 0 && (
        <div className="bg-black/30 border border-white/20 rounded-lg p-6 text-center">
          <p className="text-white/70 mb-2">No templates available</p>
          <p className="text-sm text-white/50">Please check back later or contact support for assistance</p>
        </div>
      )}
      
      {selectedTemplate && (
        <div className="mt-8 bg-black/30 border border-[#BCE784]/20 rounded-lg p-6">
          <h4 className="text-lg font-medium text-[#BCE784] mb-4">Template Preview</h4>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-full md:w-1/3">
              <img 
                src={templates.find(t => t.id === selectedTemplate)?.thumbnail} 
                alt={templates.find(t => t.id === selectedTemplate)?.name}
                className="w-full rounded-lg shadow-lg" 
              />
            </div>
            <div className="w-full md:w-2/3">
              <h5 className="text-xl font-medium text-white mb-2">
                {templates.find(t => t.id === selectedTemplate)?.name}
              </h5>
              <p className="text-white/70 mb-4">
                {templates.find(t => t.id === selectedTemplate)?.description}
              </p>
              <button 
                onClick={() => handleSelectTemplate(selectedTemplate)}
                className="bg-[#BCE784] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#BCE784]/90 transition-colors"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector; 