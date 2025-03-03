import React, { useState } from 'react';
import { useResumeForm } from '../../context/ResumeFormContext';

const ContactInfoStep: React.FC = () => {
  const { formData, updateContactInfo, goToNextStep, goToPreviousStep } = useResumeForm();
  
  // Local state for form fields
  const [localFormData, setLocalFormData] = useState({
    email: formData.contactInfo.email || '',
    phone: formData.contactInfo.phone || '',
    address: formData.contactInfo.address || '',
    city: formData.contactInfo.city || '',
    state: formData.contactInfo.state || '',
    zipCode: formData.contactInfo.zipCode || '',
    country: formData.contactInfo.country || '',
    linkedin: formData.contactInfo.linkedin || '',
    website: formData.contactInfo.website || ''
  });
  
  // Local state for validation errors
  const [errors, setErrors] = useState({
    email: '',
    phone: ''
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    // Email validation
    if (!localFormData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(localFormData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }
    
    // Phone validation
    if (!localFormData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      updateContactInfo(localFormData);
      goToNextStep();
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#2A2A2A] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-white">Contact Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={localFormData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-[#1A1A1A] border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
              placeholder="john.doe@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={localFormData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-[#1A1A1A] border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>
          
          {/* Address */}
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
              Address <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={localFormData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="123 Main St"
            />
          </div>
          
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
              City <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={localFormData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="San Francisco"
            />
          </div>
          
          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
              State/Province <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={localFormData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="California"
            />
          </div>
          
          {/* Zip Code */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-1">
              Zip/Postal Code <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={localFormData.zipCode}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="94105"
            />
          </div>
          
          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
              Country <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={localFormData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="United States"
            />
          </div>
          
          {/* LinkedIn */}
          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">
              LinkedIn URL <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={localFormData.linkedin}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
          
          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
              Personal Website <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={localFormData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="https://johndoe.com"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
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

export default ContactInfoStep; 