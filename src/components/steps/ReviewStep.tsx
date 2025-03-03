import React from 'react';
import { useResumeForm } from '../../context/ResumeFormContext';
import { useNavigate } from 'react-router-dom';

const ReviewStep: React.FC = () => {
  const { formData, goToPreviousStep } = useResumeForm();
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Here you would typically send the data to a server or generate a PDF
    console.log('Resume data submitted:', formData);
    
    // Navigate back to dashboard
    navigate('/dashboard', { state: { resumeData: formData } });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#2A2A2A] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-white">Review Your Resume</h2>
      
      <div className="space-y-8">
        {/* Personal Details */}
        <div className="bg-[#1A1A1A] p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-[#BCE784] mb-3">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Full Name</p>
              <p className="text-white">{formData.personalDetails.firstName} {formData.personalDetails.lastName}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Professional Title</p>
              <p className="text-white">{formData.personalDetails.title}</p>
            </div>
            {formData.personalDetails.dateOfBirth && (
              <div>
                <p className="text-gray-400 text-sm">Date of Birth</p>
                <p className="text-white">{formData.personalDetails.dateOfBirth}</p>
              </div>
            )}
            {formData.personalDetails.nationality && (
              <div>
                <p className="text-gray-400 text-sm">Nationality</p>
                <p className="text-white">{formData.personalDetails.nationality}</p>
              </div>
            )}
          </div>
          {formData.personalDetails.summary && (
            <div className="mt-4">
              <p className="text-gray-400 text-sm">Professional Summary</p>
              <p className="text-white">{formData.personalDetails.summary}</p>
            </div>
          )}
        </div>
        
        {/* Contact Information */}
        <div className="bg-[#1A1A1A] p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-[#BCE784] mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white">{formData.contactInfo.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Phone</p>
              <p className="text-white">{formData.contactInfo.phone}</p>
            </div>
            {formData.contactInfo.address && (
              <div className="md:col-span-2">
                <p className="text-gray-400 text-sm">Address</p>
                <p className="text-white">
                  {formData.contactInfo.address}
                  {formData.contactInfo.city && `, ${formData.contactInfo.city}`}
                  {formData.contactInfo.state && `, ${formData.contactInfo.state}`}
                  {formData.contactInfo.zipCode && ` ${formData.contactInfo.zipCode}`}
                  {formData.contactInfo.country && `, ${formData.contactInfo.country}`}
                </p>
              </div>
            )}
            {formData.contactInfo.linkedin && (
              <div>
                <p className="text-gray-400 text-sm">LinkedIn</p>
                <p className="text-white">{formData.contactInfo.linkedin}</p>
              </div>
            )}
            {formData.contactInfo.website && (
              <div>
                <p className="text-gray-400 text-sm">Website</p>
                <p className="text-white">{formData.contactInfo.website}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Employment History */}
        <div className="bg-[#1A1A1A] p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-[#BCE784] mb-3">Employment History</h3>
          {formData.employment.map((job, index) => (
            <div key={index} className={index > 0 ? 'mt-6 pt-6 border-t border-gray-700' : ''}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-white">{job.position}</h4>
                  <p className="text-gray-300">{job.company}</p>
                </div>
                <div className="text-right text-gray-400 text-sm">
                  <p>{job.startDate} - {job.current ? 'Present' : job.endDate}</p>
                </div>
              </div>
              <p className="mt-2 text-white">{job.description}</p>
              {job.achievements && job.achievements.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-400 text-sm">Key Achievements:</p>
                  <ul className="list-disc pl-5 mt-1 text-white">
                    {job.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Education */}
        <div className="bg-[#1A1A1A] p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-[#BCE784] mb-3">Education</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className={index > 0 ? 'mt-6 pt-6 border-t border-gray-700' : ''}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-white">{edu.degree} in {edu.field}</h4>
                  <p className="text-gray-300">{edu.institution}</p>
                </div>
                <div className="text-right text-gray-400 text-sm">
                  <p>{edu.startDate} - {edu.endDate}</p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              </div>
              {edu.description && <p className="mt-2 text-white">{edu.description}</p>}
            </div>
          ))}
        </div>
        
        {/* Skills */}
        <div className="bg-[#1A1A1A] p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-[#BCE784] mb-3">Skills</h3>
          {formData.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span key={index} className="bg-[#333333] text-white px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No skills added</p>
          )}
        </div>
        
        {/* Additional Sections */}
        {formData.additionalSections.length > 0 && (
          <div className="bg-[#1A1A1A] p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-[#BCE784] mb-3">Additional Sections</h3>
            {formData.additionalSections.map((section, index) => (
              <div key={index} className={index > 0 ? 'mt-6 pt-6 border-t border-gray-700' : ''}>
                <h4 className="text-lg font-medium text-white">{section.title}</h4>
                <p className="mt-2 text-white whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        )}
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
          type="button"
          onClick={handleSubmit}
          className="bg-[#BCE784] text-black px-6 py-2 rounded-md hover:bg-[#BCE784]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCE784] focus:ring-offset-2 font-semibold"
        >
          Generate Resume
        </button>
      </div>
    </div>
  );
};

export default ReviewStep; 