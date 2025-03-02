export interface PersonalDetails {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  photo?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
}

export interface Employment {
  jobTitle: string;
  employer: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
}

export interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
}

export interface AdditionalSection {
  title: string;
  content: string;
}

export interface ResumeData {
  personalDetails?: PersonalDetails;
  contactInfo?: ContactInfo;
  summary?: string;
  employment?: Employment[];
  education?: Education[];
  skills?: string[];
  additionalSections?: AdditionalSection[];
}

export type ResumeSection = 
  | 'personalDetails'
  | 'contactInfo'
  | 'summary'
  | 'employment'
  | 'education'
  | 'skills'
  | 'additional'; 