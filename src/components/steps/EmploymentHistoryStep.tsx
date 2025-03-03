import React, { useState, useEffect } from 'react';
import { useResumeForm } from '../../context/ResumeFormContext';
import { Employment } from '../../types/resume';
import { PlusCircle, Trash2 } from 'lucide-react';

const EmploymentHistoryStep: React.FC = () => {
  const { formData, updateEmployment, goToNextStep, goToPreviousStep } = useResumeForm();
  const [employmentList, setEmploymentList] = useState<Employment[]>(
    formData.employment.length > 0 ? formData.employment : [
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: []
      }
    ]
  );
  const [errors, setErrors] = useState<Record<string, string>[]>([]);

  // Update local state when formData changes
  useEffect(() => {
    if (formData.employment.length > 0) {
      setEmploymentList(formData.employment);
    }
  }, [formData.employment]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedList = [...employmentList];
    updatedList[index] = {
      ...updatedList[index],
      [name]: value
    };
    setEmploymentList(updatedList);
  };

  const handleCheckboxChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    const updatedList = [...employmentList];
    updatedList[index] = {
      ...updatedList[index],
      current: checked,
      endDate: checked ? '' : updatedList[index].endDate
    };
    setEmploymentList(updatedList);
  };

  const handleAchievementChange = (employmentIndex: number, achievementIndex: number, value: string) => {
    const updatedList = [...employmentList];
    if (!updatedList[employmentIndex].achievements) {
      updatedList[employmentIndex].achievements = [];
    }
    
    const achievements = [...(updatedList[employmentIndex].achievements || [])];
    achievements[achievementIndex] = value;
    
    updatedList[employmentIndex] = {
      ...updatedList[employmentIndex],
      achievements
    };
    
    setEmploymentList(updatedList);
  };

  const addAchievement = (employmentIndex: number) => {
    const updatedList = [...employmentList];
    if (!updatedList[employmentIndex].achievements) {
      updatedList[employmentIndex].achievements = [];
    }
    
    updatedList[employmentIndex] = {
      ...updatedList[employmentIndex],
      achievements: [...(updatedList[employmentIndex].achievements || []), '']
    };
    
    setEmploymentList(updatedList);
  };

  const removeAchievement = (employmentIndex: number, achievementIndex: number) => {
    const updatedList = [...employmentList];
    const achievements = [...(updatedList[employmentIndex].achievements || [])];
    achievements.splice(achievementIndex, 1);
    
    updatedList[employmentIndex] = {
      ...updatedList[employmentIndex],
      achievements
    };
    
    setEmploymentList(updatedList);
  };

  const addEmployment = () => {
    setEmploymentList([
      ...employmentList,
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: []
      }
    ]);
    setErrors([...errors, {}]);
  };

  const removeEmployment = (index: number) => {
    if (employmentList.length > 1) {
      const updatedList = [...employmentList];
      updatedList.splice(index, 1);
      setEmploymentList(updatedList);
      
      const updatedErrors = [...errors];
      updatedErrors.splice(index, 1);
      setErrors(updatedErrors);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string>[] = employmentList.map(employment => {
      const errors: Record<string, string> = {};
      
      if (!employment.company.trim()) {
        errors.company = 'Company name is required';
      }
      
      if (!employment.position.trim()) {
        errors.position = 'Position is required';
      }
      
      if (!employment.startDate) {
        errors.startDate = 'Start date is required';
      }
      
      if (!employment.current && !employment.endDate) {
        errors.endDate = 'End date is required if not current position';
      }
      
      if (!employment.description.trim()) {
        errors.description = 'Description is required';
      }
      
      return errors;
    });
    
    setErrors(newErrors);
    return newErrors.every(error => Object.keys(error).length === 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      updateEmployment(employmentList);
      goToNextStep();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#2A2A2A] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-white">Employment History</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {employmentList.map((employment, index) => (
          <div key={index} className="p-4 border border-gray-700 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Position {index + 1}</h3>
              {employmentList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmployment(index)}
                  className="text-red-400 hover:text-red-300 focus:outline-none"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  id={`company-${index}`}
                  name="company"
                  value={employment.company}
                  onChange={(e) => handleChange(index, e)}
                  className={`w-full bg-[#1A1A1A] border ${errors[index]?.company ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                />
                {errors[index]?.company && <p className="mt-1 text-sm text-red-500">{errors[index].company}</p>}
              </div>
              
              <div>
                <label htmlFor={`position-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  id={`position-${index}`}
                  name="position"
                  value={employment.position}
                  onChange={(e) => handleChange(index, e)}
                  className={`w-full bg-[#1A1A1A] border ${errors[index]?.position ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                />
                {errors[index]?.position && <p className="mt-1 text-sm text-red-500">{errors[index].position}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  id={`startDate-${index}`}
                  name="startDate"
                  value={employment.startDate}
                  onChange={(e) => handleChange(index, e)}
                  className={`w-full bg-[#1A1A1A] border ${errors[index]?.startDate ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                />
                {errors[index]?.startDate && <p className="mt-1 text-sm text-red-500">{errors[index].startDate}</p>}
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`current-${index}`}
                    name="current"
                    checked={employment.current}
                    onChange={(e) => handleCheckboxChange(index, e)}
                    className="mr-2 h-4 w-4 text-[#BCE784] focus:ring-[#BCE784] bg-[#1A1A1A] border-gray-700 rounded"
                  />
                  <label htmlFor={`current-${index}`} className="text-sm font-medium text-gray-300">
                    I currently work here
                  </label>
                </div>
                
                {!employment.current && (
                  <>
                    <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      id={`endDate-${index}`}
                      name="endDate"
                      value={employment.endDate}
                      onChange={(e) => handleChange(index, e)}
                      className={`w-full bg-[#1A1A1A] border ${errors[index]?.endDate ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                    />
                    {errors[index]?.endDate && <p className="mt-1 text-sm text-red-500">{errors[index].endDate}</p>}
                  </>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                id={`description-${index}`}
                name="description"
                value={employment.description}
                onChange={(e) => handleChange(index, e)}
                rows={3}
                className={`w-full bg-[#1A1A1A] border ${errors[index]?.description ? 'border-red-500' : 'border-gray-700'} rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
                placeholder="Describe your responsibilities and achievements..."
              />
              {errors[index]?.description && <p className="mt-1 text-sm text-red-500">{errors[index].description}</p>}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Key Achievements
                </label>
                <button
                  type="button"
                  onClick={() => addAchievement(index)}
                  className="text-[#BCE784] hover:text-[#BCE784]/80 flex items-center text-sm focus:outline-none"
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Achievement
                </button>
              </div>
              
              {employment.achievements && employment.achievements.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => handleAchievementChange(index, achievementIndex, e.target.value)}
                    className="flex-1 bg-[#1A1A1A] border border-gray-700 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
                    placeholder="e.g., Increased sales by 20%"
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(index, achievementIndex)}
                    className="ml-2 text-red-400 hover:text-red-300 focus:outline-none"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addEmployment}
            className="flex items-center bg-[#333333] text-white px-4 py-2 rounded-md hover:bg-[#444444] transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Another Position
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

export default EmploymentHistoryStep; 