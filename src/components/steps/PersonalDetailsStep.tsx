import React, { useState } from 'react';
import { useResumeForm } from '../../context/ResumeFormContext';

const PersonalDetailsStep: React.FC = () => {
  const { formData, updatePersonalDetails, goToNextStep } = useResumeForm();
  
  // Local state for form fields
  const [localFormData, setLocalFormData] = useState({
    firstName: formData.personalDetails.firstName || '',
    lastName: formData.personalDetails.lastName || '',
    title: formData.personalDetails.title || '',
    dateOfBirth: formData.personalDetails.dateOfBirth || '',
    nationality: formData.personalDetails.nationality || '',
    summary: formData.personalDetails.summary || ''
  });
  
  // Local state for validation errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    title: ''
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!localFormData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    
    if (!localFormData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    
    if (!localFormData.title.trim()) {
      newErrors.title = 'Professional title is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      updatePersonalDetails(localFormData);
      goToNextStep();
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#2A2A2A] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-white">Personal Details</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={localFormData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-[#1A1A1A] border ${errors.firstName ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
              placeholder="John"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
          </div>
          
          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={localFormData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-[#1A1A1A] border ${errors.lastName ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
          </div>
          
          {/* Professional Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Professional Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={localFormData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-[#1A1A1A] border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
              placeholder="Software Engineer"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          
          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
              Date of Birth <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={localFormData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
            />
          </div>
          
          {/* Nationality */}
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-300 mb-1">
              Nationality <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={localFormData.nationality}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="American"
            />
          </div>
          
          {/* Professional Summary */}
          <div className="md:col-span-2">
            <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-1">
              Professional Summary <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              id="summary"
              name="summary"
              value={localFormData.summary}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="A brief summary of your professional background and career goals..."
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
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

export default PersonalDetailsStep; 