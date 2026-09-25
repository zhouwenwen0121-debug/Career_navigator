export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type EmploymentType = 'Full-time' | 'Contract' | 'Part-time' | 'Internship';
export type JobSource = 'Indeed' | 'Glassdoor' | 'Google Jobs' | 'Laddro';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  minSalarySGD: number;
  maxSalarySGD: number;
  currency: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead / Principal';
  yearsExperienceRequired: number;
  educationRequirements: string;
  industry: string;
  datePosted: string;
  source: JobSource;
  sourceUrl: string;
  externalJobId: string;
}

export interface JobMatch {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  experienceFit: 'Strong' | 'Moderate' | 'Growth Opportunity';
  educationFit: 'Aligned' | 'Partially Aligned' | 'Not Specified';
  explanation: string;
  strengthsSummary?: string[];
  gapRecommendations?: string[];
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
}

export interface ResumeData {
  id: string;
  versionName: string;
  isMaster: boolean;
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skills: string[];
  certifications: string[];
  rawText?: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  currentTitle: string;
  targetTitle: string;
  yearsOfExperience: number;
  targetSalarySGD: number;
  location: string;
  workModePreference: WorkMode | 'Flexible';
  targetIndustries: string[];
  skills: string[];
}

export type ApplicationStatus =
  | 'Saved'
  | 'Preparing'
  | 'Ready to Apply'
  | 'Applied'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  source: JobSource;
  location: string;
  salarySGD?: string;
  status: ApplicationStatus;
  dateAdded: string;
  appliedDate?: string;
  interviewDate?: string;
  resumeVersionName: string;
  coverLetterText?: string;
  notes?: string;
  matchScore?: number;
}

export interface IndustryTrend {
  id: string;
  industry: string;
  jobDemandIndex: number;
  jobDemandTrend: 'Rapid Growth' | 'Moderate Growth' | 'Stable' | 'Softening';
  demandGrowthYoY: number;
  medianSalarySGD: number;
  p25SalarySGD: number;
  p75SalarySGD: number;
  vacancyRatio: number;
  topInDemandRoles: string[];
  emergingSkills: string[];
  coreCompetencies: string[];
  quarterlyTrends: { quarter: string; demandIndex: number; vacancies: number }[];
  sourceCitation: string;
  sourceDate: string;
  geography: string;
}

export interface LabourMarketOverview {
  overallUnemploymentRate: number;
  residentUnemploymentRate: number;
  overallVacancyRatio: number;
  totalJobVacancies: number;
  retrenchmentPerThousand: number;
  surveyPeriod: string;
  reportingAuthority: string;
  industries: IndustryTrend[];
  emergingOccupations2026: {
    title: string;
    industry: string;
    growthProjection: string;
    criticalSkills: string[];
    skillsFrameworkRef: string;
  }[];
}

export interface McpCapabilityItem {
  id: string;
  mcpName: string;
  category: 'Job Services' | 'Skill Services' | 'Career Data' | 'Application Services' | 'Deployment';
  capability: string;
  toolMethod: string;
  inputsSchema: Record<string, string>;
  outputsSchema: Record<string, string>;
  applicationFeature: string;
  status: 'Connected' | 'Active via Adapter' | 'Requires External Token' | 'Fallback Mode';
  readWrite: 'Read-only' | 'Read/Write' | 'Guarded Write';
  latencyMs: number;
  lastChecked: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}

export type StakeholderPersona =
  | 'job_seeker'
  | 'fresh_graduate'
  | 'retrenched_worker'
  | 'career_coach'
  | 'workforce_agency';
