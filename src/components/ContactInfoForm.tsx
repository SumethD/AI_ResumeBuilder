import React, { ChangeEvent } from 'react';
import { ContactInfo } from '../types/resume';

interface ContactInfoFormProps {
  data: ContactInfo;
  onChange: (data: ContactInfo) => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ data, onChange }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      [name]: value
    });
  };

  return (
    <div className="bg-black/30 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-[#BCE784] mb-6">Contact Information</h2>
      <p className="text-white/70 mb-6">
        Make it easy for employers to reach you by providing accurate contact details.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="email" className="block text-white mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email || ''}
            onChange={handleInputChange}
            className="w-full bg-black/50 border border-[#BCE784]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-white mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={data.phone || ''}
            onChange={handleInputChange}
            className="w-full bg-black/50 border border-[#BCE784]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label htmlFor="country" className="block text-white mb-2">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={data.country || ''}
            onChange={handleInputChange}
            className="w-full bg-black/50 border border-[#BCE784]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
            placeholder="United States"
          />
        </div>
        
        <div>
          <label htmlFor="city" className="block text-white mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={data.city || ''}
            onChange={handleInputChange}
            className="w-full bg-black/50 border border-[#BCE784]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
            placeholder="New York"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-white mb-2">
            Address (Optional)
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={data.address || ''}
            onChange={handleInputChange}
            className="w-full bg-black/50 border border-[#BCE784]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
            placeholder="123 Main St"
          />
        </div>
        
        <div>
          <label htmlFor="postalCode" className="block text-white mb-2">
            Postal Code (Optional)
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={data.postalCode || ''}
            onChange={handleInputChange}
            className="w-full bg-black/50 border border-[#BCE784]/30 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#BCE784]"
            placeholder="10001"
          />
        </div>
      </div>
      
      <div className="mt-6 text-white/50 text-sm">
        <p>
          <strong className="text-[#BCE784]">Privacy Tip:</strong> Consider which contact details you want to include on your resume. 
          Email and phone are essential, but full address may not be necessary.
        </p>
      </div>
    </div>
  );
};

export default ContactInfoForm; 