import React, { useState, useEffect } from 'react';
import { useResumeForm } from '../../context/ResumeFormContext';
import { Education } from '../../types/resume';
import { PlusCircle, Trash2 } from 'lucide-react';

const EducationStep: React.FC = () => {
  const { formData, updateEducation, goToNextStep, goToPreviousStep } = useResumeForm();
  const [educationList, setEducationList] = useState<Education[]>(
    formData.education.length > 0 ? formData.education : [
      {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
      }
    ]
  );
  const [errors, setErrors] = useState<Record<string, string>[]>([]);

  // Update local state when formData changes
  useEffect(() => {
    if (formData.education.length > 0) {
      setEducationList(formData.education);
    }
  }, [formData.education]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedList = [...educationList];
    updatedList[index] = {
      ...updatedList[index],
      [name]: value
    };
    setEducationList(updatedList);
  };

  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: ''
      }
    ]);
    setErrors([...errors, {}]);
  };

  const removeEducation = (index: number) => {
    if (educationList.length > 1) {
      const updatedList = [...educationList];
      updatedList.splice(index, 1);
      setEducationList(updatedList);
      
      const updatedErrors = [...errors];
      updatedErrors.splice(index, 1);
      setErrors(updatedErrors);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string>[] = educationList.map(education => {
      const errors: Record<string, string> = {};
      
      if (!education.institution.trim()) {
        errors.institution = 'Institution name is required';
      }
      
      if (!education.degree.trim()) {
        errors.degree = 'Degree is required';
      }
      
      if (!education.field.trim()) {
        errors.field = 'Field of study is required';
      }
      
      if (!education.startDate) {
        errors.startDate = 'Start date is required';
      }
      
      if (!education.endDate) {
        errors.endDate = 'End date is required';
      }
      
      return errors;
    });
    
    setErrors(newErrors);
    return newErrors.every(error => Object.keys(error).length === 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      updateEducation(educationList);
      goToNextStep();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#2A2A2A] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-white">Education</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {educationList.map((education, index) => (
          <div key={index} className="p-4 border border-gray-700 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Education {index + 1}</h3>
              {educationList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-400 hover:text-red-300 focus:outline-none"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div>
              <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Institution *
              </label>
              <input
                type="text"
                id={`institution-${index}`}
                name="institution"
                value={education.institution}
                onChange={(e) => handleChange(index, e)}
                className={`w-full bg-[#1A1A1A] border ${errors[index]?.institution ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                placeholder="e.g., Harvard University"
              />
              {errors[index]?.institution && <p className="mt-1 text-sm text-red-500">{errors[index].institution}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                  Degree *
                </label>
                <input
                  type="text"
                  id={`degree-${index}`}
                  name="degree"
                  value={education.degree}
                  onChange={(e) => handleChange(index, e)}
                  className={`w-full bg-[#1A1A1A] border ${errors[index]?.degree ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                  placeholder="e.g., Bachelor of Science"
                />
                {errors[index]?.degree && <p className="mt-1 text-sm text-red-500">{errors[index].degree}</p>}
              </div>
              
              <div>
                <label htmlFor={`field-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                  Field of Study *
                </label>
                <input
                  type="text"
                  id={`field-${index}`}
                  name="field"
                  value={education.field}
                  onChange={(e) => handleChange(index, e)}
                  className={`w-full bg-[#1A1A1A] border ${errors[index]?.field ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                  placeholder="e.g., Computer Science"
                />
                {errors[index]?.field && <p className="mt-1 text-sm text-red-500">{errors[index].field}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  id={`startDate-${index}`}
                  name="startDate"
                  value={education.startDate}
                  onChange={(e) => handleChange(index, e)}
                  className={`w-full bg-[#1A1A1A] border ${errors[index]?.startDate ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                />
                {errors[index]?.startDate && <p className="mt-1 text-sm text-red-500">{errors[index].startDate}</p>}
              </div>
              
              <div>
                <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  id={`endDate-${index}`}
                  name="endDate"
                  value={education.endDate}
                  onChange={(e) => handleChange(index, e)}
                  className={`w-full bg-[#1A1A1A] border ${errors[index]?.endDate ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                />
                {errors[index]?.endDate && <p className="mt-1 text-sm text-red-500">{errors[index].endDate}</p>}
              </div>
              
              <div>
                <label htmlFor={`gpa-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                  GPA
                </label>
                <input
                  type="text"
                  id={`gpa-${index}`}
                  name="gpa"
                  value={education.gpa}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
                  placeholder="e.g., 3.8/4.0"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id={`description-${index}`}
                name="description"
                value={education.description}
                onChange={(e) => handleChange(index, e)}
                rows={3}
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
                placeholder="Describe your coursework, achievements, or activities..."
              />
            </div>
          </div>
        ))}
        
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center bg-[#333333] text-white px-4 py-2 rounded-md hover:bg-[#444444] transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Another Education
          </button>
        </div>
        
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
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationStep; 