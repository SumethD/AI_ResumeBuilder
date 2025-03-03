import React, { useState, useEffect } from 'react';
import { useResumeForm } from '../../context/ResumeFormContext';
import { AdditionalSection } from '../../types/resume';
import { PlusCircle, Trash2 } from 'lucide-react';

const AdditionalSectionsStep: React.FC = () => {
  const { formData, updateAdditionalSections, goToNextStep, goToPreviousStep } = useResumeForm();
  const [sections, setSections] = useState<AdditionalSection[]>(
    formData.additionalSections.length > 0 ? formData.additionalSections : []
  );
  const [errors, setErrors] = useState<Record<string, string>[]>([]);

  // Update local state when formData changes
  useEffect(() => {
    if (formData.additionalSections.length > 0) {
      setSections(formData.additionalSections);
    }
  }, [formData.additionalSections]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [name]: value
    };
    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: '',
        content: ''
      }
    ]);
    setErrors([...errors, {}]);
  };

  const removeSection = (index: number) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
    
    const updatedErrors = [...errors];
    updatedErrors.splice(index, 1);
    setErrors(updatedErrors);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string>[] = sections.map(section => {
      const errors: Record<string, string> = {};
      
      if (!section.title.trim()) {
        errors.title = 'Section title is required';
      }
      
      if (!section.content.trim()) {
        errors.content = 'Section content is required';
      }
      
      return errors;
    });
    
    setErrors(newErrors);
    return newErrors.every(error => Object.keys(error).length === 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sections.length === 0 || validate()) {
      updateAdditionalSections(sections);
      goToNextStep();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#2A2A2A] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-white">Additional Sections</h2>
      <p className="text-gray-300 mb-6">
        Add any additional sections you'd like to include in your resume, such as certifications, languages, volunteer work, or publications.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {sections.length === 0 ? (
          <div className="text-center py-8 bg-[#1A1A1A] rounded-lg">
            <p className="text-gray-400 mb-4">No additional sections added yet</p>
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center bg-[#BCE784] text-black px-4 py-2 rounded-md hover:bg-[#BCE784]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add a Section
            </button>
          </div>
        ) : (
          <>
            {sections.map((section, index) => (
              <div key={index} className="p-4 border border-gray-700 rounded-lg space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-white">Section {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="text-red-400 hover:text-red-300 focus:outline-none"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div>
                  <label htmlFor={`title-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                    Section Title *
                  </label>
                  <input
                    type="text"
                    id={`title-${index}`}
                    name="title"
                    value={section.title}
                    onChange={(e) => handleChange(index, e)}
                    className={`w-full bg-[#1A1A1A] border ${errors[index]?.title ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                    placeholder="e.g., Certifications, Languages, Publications"
                  />
                  {errors[index]?.title && <p className="mt-1 text-sm text-red-500">{errors[index].title}</p>}
                </div>
                
                <div>
                  <label htmlFor={`content-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                    Content *
                  </label>
                  <textarea
                    id={`content-${index}`}
                    name="content"
                    value={section.content}
                    onChange={(e) => handleChange(index, e)}
                    rows={4}
                    className={`w-full bg-[#1A1A1A] border ${errors[index]?.content ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                    placeholder="Describe your certifications, language proficiency, or other relevant information..."
                  />
                  {errors[index]?.content && <p className="mt-1 text-sm text-red-500">{errors[index].content}</p>}
                </div>
              </div>
            ))}
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addSection}
                className="flex items-center bg-[#333333] text-white px-4 py-2 rounded-md hover:bg-[#444444] transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Another Section
              </button>
            </div>
          </>
        )}
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-semibold"
          >
            Previous
          </button>
          
          <button
            type="submit"
            className="bg-[#BCE784] text-black px-6 py-2 rounded-md hover:bg-[#BCE784]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 font-semibold"
          >
            Review & Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdditionalSectionsStep; 