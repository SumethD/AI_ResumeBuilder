import React, { useState, useEffect } from 'react';
import { useResumeForm } from '../../context/ResumeFormContext';
import { PlusCircle, X } from 'lucide-react';

const SkillsStep: React.FC = () => {
  const { formData, updateSkills, goToNextStep, goToPreviousStep } = useResumeForm();
  const [skills, setSkills] = useState<string[]>(formData.skills);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Update local state when formData changes
  useEffect(() => {
    setSkills(formData.skills);
  }, [formData.skills]);

  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      setError('Please enter a skill');
      return;
    }

    if (skills.includes(newSkill.trim())) {
      setError('This skill is already added');
      return;
    }

    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSkills(skills);
    goToNextStep();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#2A2A2A] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-white">Skills</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="skill" className="block text-sm font-medium text-gray-300 mb-1">
            Add Skills
          </label>
          <div className="flex">
            <input
              type="text"
              id="skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#1A1A1A] border border-gray-700 rounded-l-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:border-transparent"
              placeholder="e.g., JavaScript, Project Management, etc."
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-[#BCE784] text-black px-4 py-2 rounded-r-md hover:bg-[#BCE784]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <p className="mt-1 text-sm text-gray-400">Press Enter to add a skill</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Your Skills</h3>
          {skills.length === 0 ? (
            <p className="text-gray-400">No skills added yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-[#333333] text-white px-3 py-1 rounded-full flex items-center"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-gray-400 hover:text-white focus:outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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

export default SkillsStep; 