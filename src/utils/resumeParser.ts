import { ResumeData, PersonalDetails, ContactInfo, Employment, Education } from '../types/resume';

/**
 * Parses raw resume content into structured ResumeData
 * @param content The raw text content of the resume
 * @returns A structured ResumeData object
 */
export function parseResumeContent(content: string): ResumeData {
  // Split the content into sections based on common resume section headings
  const sections = extractSections(content);
  
  // Initialize the resume data object
  const resumeData: ResumeData = {
    personalDetails: extractPersonalDetails(sections, content),
    contactInfo: extractContactInfo(sections),
    summary: sections.summary || '',
    employment: extractEmployment(sections),
    education: extractEducation(sections),
    skills: extractSkills(sections),
    additionalSections: extractAdditionalSections(sections)
  };
  
  return resumeData;
}

/**
 * Extracts sections from resume content
 */
function extractSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // Common section headings in resumes
  const sectionHeadings = [
    { key: 'personalDetails', regex: /(?:^|\n)(?:PERSONAL DETAILS|PERSONAL INFORMATION|ABOUT ME)(?:\s*:|\s*\n)/i },
    { key: 'contactInfo', regex: /(?:^|\n)(?:CONTACT|CONTACT INFORMATION|CONTACT DETAILS)(?:\s*:|\s*\n)/i },
    { key: 'summary', regex: /(?:^|\n)(?:SUMMARY|PROFESSIONAL SUMMARY|CAREER SUMMARY|PROFILE|OBJECTIVE)(?:\s*:|\s*\n)/i },
    { key: 'employment', regex: /(?:^|\n)(?:EMPLOYMENT|EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|WORK HISTORY)(?:\s*:|\s*\n)/i },
    { key: 'education', regex: /(?:^|\n)(?:EDUCATION|EDUCATIONAL BACKGROUND|ACADEMIC BACKGROUND|QUALIFICATIONS)(?:\s*:|\s*\n)/i },
    { key: 'skills', regex: /(?:^|\n)(?:SKILLS|TECHNICAL SKILLS|KEY SKILLS|CORE COMPETENCIES|COMPETENCIES)(?:\s*:|\s*\n)/i },
    { key: 'languages', regex: /(?:^|\n)(?:LANGUAGES|LANGUAGE SKILLS)(?:\s*:|\s*\n)/i },
    { key: 'certifications', regex: /(?:^|\n)(?:CERTIFICATIONS|CERTIFICATES|ACCREDITATIONS)(?:\s*:|\s*\n)/i },
    { key: 'projects', regex: /(?:^|\n)(?:PROJECTS|PROJECT EXPERIENCE|KEY PROJECTS)(?:\s*:|\s*\n)/i },
    { key: 'awards', regex: /(?:^|\n)(?:AWARDS|HONORS|ACHIEVEMENTS)(?:\s*:|\s*\n)/i },
    { key: 'references', regex: /(?:^|\n)(?:REFERENCES|PROFESSIONAL REFERENCES)(?:\s*:|\s*\n)/i }
  ];
  
  // Find the indices of all section headings
  const sectionIndices: { key: string; index: number }[] = [];
  
  sectionHeadings.forEach(({ key, regex }) => {
    const match = content.match(regex);
    if (match && match.index !== undefined) {
      sectionIndices.push({ key, index: match.index });
    }
  });
  
  // Sort section indices by their position in the content
  sectionIndices.sort((a, b) => a.index - b.index);
  
  // Extract content for each section
  for (let i = 0; i < sectionIndices.length; i++) {
    const currentSection = sectionIndices[i];
    const nextSection = sectionIndices[i + 1];
    
    const startIndex = currentSection.index;
    const endIndex = nextSection ? nextSection.index : content.length;
    
    sections[currentSection.key] = content.substring(startIndex, endIndex).trim();
  }
  
  // If no sections were found, try to extract information from the entire content
  if (Object.keys(sections).length === 0) {
    // Try to identify personal details from the beginning
    const firstParagraphMatch = content.match(/^(.*?)(?:\n\n|\n\s*\n)/s);
    if (firstParagraphMatch) {
      sections.personalDetails = firstParagraphMatch[1].trim();
    }
    
    // Try to identify contact information
    const emailMatch = content.match(/[a-zA-Z0-9._%+]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}/);
    const phoneMatch = content.match(/(?:\+\d{1,3}[ .]?)?\(?\d{3}\)?[ .]?\d{3}[ .]?\d{4}/);
    
    if (emailMatch || phoneMatch) {
      sections.contactInfo = content.substring(0, 500); // Use first 500 characters for contact info
    }
    
    // Try to identify summary
    const summaryMatch = content.match(/(?:^|\n)(?:.*?(?:professional|experienced|skilled|dedicated|passionate|results|oriented|driven).*?)(?:\n\n|\n\s*\n)/is);
    if (summaryMatch) {
      sections.summary = summaryMatch[0].trim();
    }
  }
  
  return sections;
}

/**
 * Extracts personal details from sections
 */
function extractPersonalDetails(sections: Record<string, string>, content: string): PersonalDetails {
  const personalDetails: PersonalDetails = {};
  
  // Try to extract name from the personal details section or from the beginning of the resume
  const nameRegex = /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/;
  const personalSection = sections.personalDetails || '';
  
  const nameMatch = personalSection.match(nameRegex);
  if (nameMatch && nameMatch[1]) {
    const fullName = nameMatch[1].trim();
    const nameParts = fullName.split(' ');
    
    if (nameParts.length >= 2) {
      personalDetails.firstName = nameParts[0];
      personalDetails.lastName = nameParts.slice(1).join(' ');
    } else {
      personalDetails.firstName = fullName;
    }
  }
  
  // Try to extract job title
  const jobTitleRegex = /(?:^|\n)([A-Z][a-z]+(?:\s+[A-Za-z&]+)*(?:\s+Developer|\s+Engineer|\s+Designer|\s+Manager|\s+Director|\s+Analyst|\s+Specialist|\s+Consultant|\s+Coordinator|\s+Assistant|\s+Executive|\s+Officer|\s+Administrator|\s+Supervisor|\s+Lead|\s+Head|\s+Chief|\s+Architect))/;
  const jobTitleMatch = personalSection.match(jobTitleRegex) || content.match(jobTitleRegex);
  
  if (jobTitleMatch && jobTitleMatch[1]) {
    personalDetails.jobTitle = jobTitleMatch[1].trim();
  }
  
  return personalDetails;
}

/**
 * Extracts contact information from sections
 */
function extractContactInfo(sections: Record<string, string>): ContactInfo {
  const contactInfo: ContactInfo = {};
  const contactSection = sections.contactInfo || '';
  
  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = contactSection.match(emailRegex);
  if (emailMatch) {
    contactInfo.email = emailMatch[0];
  }
  
  // Extract phone number - fixed unnecessary escape characters
  const phoneRegex = /(?:\+\d{1,3}[ .]?)?\(?\d{3}\)?[ .]?\d{3}[ .]?\d{4}/;
  const phoneMatch = contactSection.match(phoneRegex);
  if (phoneMatch) {
    contactInfo.phone = phoneMatch[0];
  }
  
  // Extract location information (city, country)
  const locationRegex = /[A-Z][a-z]+(?:,\s*[A-Z]{2})?/;
  const locationMatch = contactSection.match(locationRegex);
  if (locationMatch) {
    const location = locationMatch[0].trim();
    
    // Try to extract city and country
    const locationParts = location.split(/,\s*/);
    if (locationParts.length >= 2) {
      contactInfo.city = locationParts[0];
      contactInfo.country = locationParts[locationParts.length - 1];
    } else {
      contactInfo.city = location;
    }
  }
  
  return contactInfo;
}

/**
 * Extracts employment history from sections
 */
function extractEmployment(sections: Record<string, string>): Employment[] {
  const employment: Employment[] = [];
  
  // Get the employment section
  const employmentSection = sections.employment || '';
  if (!employmentSection) return employment;
  
  // Split the section into job entries
  const jobEntries = employmentSection.split(/\n(?=[A-Z][a-z]+(?:\s+[A-Za-z&]+)*\s+\|\s+[A-Z][a-z]+)/);
  
  for (const entry of jobEntries) {
    if (!entry.trim()) continue;
    
    const job: Employment = {
      jobTitle: '',
      employer: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    };
    
    // Extract job title and employer
    const titleEmployerRegex = /([A-Z][a-z]+(?:\s+[A-Za-z&]+)*)\s+(?:\|\s+|at\s+|@\s+)([A-Z][a-z]+(?:\s+[A-Za-z&.,]+)*)/;
    const titleEmployerMatch = entry.match(titleEmployerRegex);
    
    if (titleEmployerMatch) {
      job.jobTitle = titleEmployerMatch[1].trim();
      job.employer = titleEmployerMatch[2].trim();
    }
    
    // Extract dates
    const datesRegex = /(?:^|\n)(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*(?:-|–|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|Present|Current))/i;
    const datesMatch = entry.match(datesRegex);
    
    if (datesMatch) {
      const dateRange = datesMatch[0].trim();
      const dates = dateRange.split(/\s*(?:-|–|to)\s*/i);
      
      if (dates.length >= 2) {
        job.startDate = dates[0].trim();
        job.endDate = dates[1].trim();
      }
    }
    
    // Extract location
    const locationRegex = /(?:^|\n)([A-Z][a-z]+(?:[\s,]+[A-Z][a-z]+)*(?:[\s,]+[A-Z]{2})?)/m;
    const locationMatch = entry.match(locationRegex);
    
    if (locationMatch && locationMatch[1]) {
      job.location = locationMatch[1].trim();
    }
    
    // Extract description (everything else)
    const descriptionRegex = /(?:^|\n)(?:•|\*||\d+\.)\s+(.+)(?:\n(?:•|\*||\d+\.)\s+(.+))*/m;
    const descriptionMatch = entry.match(descriptionRegex);
    
    if (descriptionMatch) {
      job.description = descriptionMatch[0].trim();
    }
    
    // Only add the job if we have at least a job title and employer
    if (job.jobTitle && job.employer) {
      employment.push(job);
    }
  }
  
  return employment;
}

/**
 * Extracts education history from sections
 */
function extractEducation(sections: Record<string, string>): Education[] {
  const education: Education[] = [];
  
  // Get the education section
  const educationSection = sections.education || '';
  if (!educationSection) return education;
  
  // Split the section into education entries
  const educationEntries = educationSection.split(/\n(?=[A-Z][a-z]+(?:\s+[A-Za-z&]+)*\s+(?:in|of|from)\s+[A-Z][a-z]+)/);
  
  for (const entry of educationEntries) {
    if (!entry.trim()) continue;
    
    const edu: Education = {
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ''
    };
    
    // Extract degree and institution
    const degreeInstitutionRegex = /([A-Z][a-z]+(?:\s+[A-Za-z&]+)*)\s+(?:in|of|from)\s+([A-Z][a-z]+(?:\s+[A-Za-z&.,]+)*)/;
    const degreeInstitutionMatch = entry.match(degreeInstitutionRegex);
    
    if (degreeInstitutionMatch) {
      edu.degree = degreeInstitutionMatch[1].trim();
      edu.institution = degreeInstitutionMatch[2].trim();
    }
    
    // Extract dates
    const datesRegex = /(?:^|\n)(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*(?:-|–|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|Present|Current))/i;
    const datesMatch = entry.match(datesRegex);
    
    if (datesMatch) {
      const dateRange = datesMatch[0].trim();
      const dates = dateRange.split(/\s*(?:-|–|to)\s*/i);
      
      if (dates.length >= 2) {
        edu.startDate = dates[0].trim();
        edu.endDate = dates[1].trim();
      }
    }
    
    // Extract location
    const locationRegex = /(?:^|\n)([A-Z][a-z]+(?:[\s,]+[A-Z][a-z]+)*(?:[\s,]+[A-Z]{2})?)/m;
    const locationMatch = entry.match(locationRegex);
    
    if (locationMatch && locationMatch[1]) {
      edu.location = locationMatch[1].trim();
    }
    
    // Only add the education if we have at least a degree and institution
    if (edu.degree && edu.institution) {
      education.push(edu);
    }
  }
  
  return education;
}

/**
 * Extracts skills from sections
 */
function extractSkills(sections: Record<string, string>): string[] {
  const skills: string[] = [];
  
  // Get the skills section
  const skillsSection = sections.skills || '';
  if (!skillsSection) return skills;
  
  // Extract skills listed with bullets or commas
  const skillLines = skillsSection.split('\n');
  
  for (const line of skillLines) {
    // Check if the line contains bullet points
    if (line.includes('•') || line.includes('*') || line.includes('-')) {
      const bulletSkills = line.split(/[•*-]/).map(s => s.trim()).filter(Boolean);
      skills.push(...bulletSkills);
    } else if (line.includes(',')) {
      // Check if the line contains comma-separated skills
      const commaSkills = line.split(',').map(s => s.trim()).filter(Boolean);
      skills.push(...commaSkills);
    } else if (line.trim()) {
      // Otherwise, add the whole line as a skill
      skills.push(line.trim());
    }
  }
  
  return skills;
}

/**
 * Extracts additional sections from the resume
 */
function extractAdditionalSections(sections: Record<string, string>): { title: string; content: string }[] {
  const additionalSections: { title: string; content: string }[] = [];
  
  // Check for common additional sections
  const additionalSectionNames = [
    'certifications',
    'languages',
    'projects',
    'awards',
    'references'
  ];
  
  for (const sectionName of additionalSectionNames) {
    if (sections[sectionName]) {
      additionalSections.push({
        title: capitalizeFirstLetter(sectionName),
        content: sections[sectionName]
      });
    }
  }
  
  return additionalSections;
}

/**
 * Utility function to capitalize the first letter of a string
 */
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
} 