import React from 'react';
import { ResumeData } from '../types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateId: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  // We can implement different templates based on templateId later
  
  return (
    <div className="bg-white text-gray-800 p-8 overflow-auto h-[600px]">
      {/* Header with personal details */}
      <div className="flex items-start justify-between border-b border-gray-200 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {resumeData.personalDetails?.firstName} {resumeData.personalDetails?.lastName}
          </h1>
          <p className="text-xl text-gray-700 mt-1">{resumeData.personalDetails?.jobTitle}</p>
          
          {/* Contact information */}
          <div className="mt-4 space-y-1 text-sm">
            {resumeData.contactInfo?.email && (
              <p className="flex items-center">
                <span className="font-medium mr-2">Email:</span> {resumeData.contactInfo.email}
              </p>
            )}
            {resumeData.contactInfo?.phone && (
              <p className="flex items-center">
                <span className="font-medium mr-2">Phone:</span> {resumeData.contactInfo.phone}
              </p>
            )}
            {(resumeData.contactInfo?.city || resumeData.contactInfo?.country) && (
              <p className="flex items-center">
                <span className="font-medium mr-2">Location:</span>
                {resumeData.contactInfo.city}{resumeData.contactInfo.city && resumeData.contactInfo.country ? ', ' : ''}
                {resumeData.contactInfo.country}
              </p>
            )}
          </div>
        </div>
        
        {/* Photo */}
        {resumeData.personalDetails?.photo && (
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
            <img 
              src={resumeData.personalDetails.photo} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      {/* Professional Summary */}
      {resumeData.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200">
            Professional Summary
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{resumeData.summary}</p>
        </div>
      )}
      
      {/* Employment History */}
      {resumeData.employment && resumeData.employment.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200">
            Employment History
          </h2>
          <div className="space-y-5">
            {resumeData.employment.map((job, index) => (
              <div key={index} className="pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{job.jobTitle}</h3>
                  <span className="text-sm text-gray-600">
                    {job.startDate} - {job.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-700">{job.employer}{job.location ? `, ${job.location}` : ''}</p>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200">
            Education
          </h2>
          <div className="space-y-5">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-gray-700">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.description && (
                  <p className="mt-2 text-gray-700 whitespace-pre-line">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Additional Sections */}
      {resumeData.additionalSections && resumeData.additionalSections.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200">
            {section.title}
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ResumePreview;