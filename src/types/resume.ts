export interface PersonalDetails {
  firstName: string;
  lastName: string;
  title: string;
  dateOfBirth?: string;
  nationality?: string;
  summary?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  linkedin?: string;
  website?: string;
}

export interface Employment {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface AdditionalSection {
  title: string;
  content: string;
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  contactInfo: ContactInfo;
  employment: Employment[];
  education: Education[];
  skills: string[];
  additionalSections: AdditionalSection[];
}

export interface ProcessedResume {
  originalText: string;
  optimizedText: string;
  suggestions: string[];
  score: number;
}

export type ResumeSection = 
  | 'personalDetails'
  | 'contactInfo'
  | 'summary'
  | 'employment'
  | 'education'
  | 'skills'
  | 'additional'; 