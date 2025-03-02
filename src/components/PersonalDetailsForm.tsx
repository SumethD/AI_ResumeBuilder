import React, { useState, ChangeEvent } from 'react';
import { PersonalDetails } from '../types/resume';

interface PersonalDetailsFormProps {
  data: PersonalDetails;
  onChange: (data: PersonalDetails) => void;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ data, onChange }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(data.photo || null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value
    });
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        onChange({
          ...data,
          photo: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-black/30 rounded-lg p-6 md:p-8 w-full">
      <h2 className="text-2xl md:text-3xl font-semibold text-[#BCE784] mb-4 md:mb-6">Personal Details</h2>
      <p className="text-white/70 mb-6 md:text-lg max-w-4xl">
        This section is crucial as it provides recruiters with your essential information.
        Make sure to include accurate and professional details.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="space-y-8">
          <div>
            <label htmlFor="firstName" className="block text-white text-lg mb-3">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={data.firstName || ''}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-[#BCE784]/30 text-white rounded-lg p-3.5 md:p-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-white text-lg mb-3">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={data.lastName || ''}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-[#BCE784]/30 text-white rounded-lg p-3.5 md:p-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="Enter your last name"
            />
          </div>
          
          <div>
            <label htmlFor="jobTitle" className="block text-white text-lg mb-3">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={data.jobTitle || ''}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-[#BCE784]/30 text-white rounded-lg p-3.5 md:p-4 text-lg focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
              placeholder="e.g. Software Engineer"
            />
          </div>
          
          {/* Preview section */}
          {(data.firstName || data.lastName || data.jobTitle) && (
            <div className="mt-8 p-5 md:p-6 bg-black/40 rounded-lg border border-[#BCE784]/20">
              <h3 className="text-[#BCE784] text-lg mb-3">Preview</h3>
              <div className="text-white text-xl md:text-2xl font-semibold">
                {data.firstName} {data.lastName}
              </div>
              {data.jobTitle && (
                <div className="text-white/80 text-lg md:text-xl mt-2">{data.jobTitle}</div>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <label className="block text-white text-lg mb-3">
            Profile Photo
          </label>
          <div className="flex flex-col items-center justify-center bg-black/50 border-2 border-dashed border-[#BCE784]/30 rounded-lg p-6 h-[280px] md:h-[320px]">
            {photoPreview ? (
              <div className="relative w-full h-full">
                <img 
                  src={photoPreview} 
                  alt="Profile Preview" 
                  className="w-full h-full object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    onChange({
                      ...data,
                      photo: undefined
                    });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 md:h-16 md:w-16 text-[#BCE784]/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white/70 text-center mb-4 md:text-lg">Upload a professional photo</p>
                <label className="bg-[#BCE784]/20 text-[#BCE784] px-5 py-3 md:px-6 md:py-3.5 rounded-lg cursor-pointer hover:bg-[#BCE784]/30 transition-colors md:text-lg">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>
          <div className="mt-5 p-5 bg-black/40 rounded-lg border border-[#BCE784]/20">
            <h4 className="text-[#BCE784] mb-3 text-lg">Photo Tips:</h4>
            <ul className="text-white/70 space-y-2.5 list-disc pl-5">
              <li>Use a professional headshot with good lighting</li>
              <li>Choose a neutral background that isn't distracting</li>
              <li>Dress professionally as you would for the job</li>
              <li>Recommended size: 400x400 pixels (square format)</li>
              <li>Keep file size under 2MB for optimal performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm; 