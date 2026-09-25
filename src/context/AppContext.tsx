import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Job,
  JobMatch,
  ResumeData,
  UserProfile,
  ApplicationRecord,
  StakeholderPersona,
} from '../types';
import { api } from '../services/api';

export type NavigationTab =
  | 'dashboard'
  | 'jobs'
  | 'top_matches'
  | 'resume'
  | 'skills'
  | 'tailor'
  | 'cover_letter'
  | 'interview'
  | 'labour_market'
  | 'tracker'
  | 'navigator'
  | 'mcp_hub';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  stakeholder: StakeholderPersona;
  setStakeholder: (persona: StakeholderPersona) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  resumes: ResumeData[];
  setResumes: React.Dispatch<React.SetStateAction<ResumeData[]>>;
  activeResume: ResumeData;
  setActiveResume: (resume: ResumeData) => void;
  jobs: Job[];
  loadingJobs: boolean;
  refreshJobs: () => Promise<void>;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  topMatches: { job: Job; match: JobMatch }[];
  calculateTopMatches: () => Promise<void>;
  calculatingMatches: boolean;
  selectedJobForDetail: Job | null;
  setSelectedJobForDetail: (job: Job | null) => void;
  selectedJobForTailoring: Job | null;
  setSelectedJobForTailoring: (job: Job | null) => void;
  selectedJobForInterview: Job | null;
  setSelectedJobForInterview: (job: Job | null) => void;
  selectedJobForCoverLetter: Job | null;
  setSelectedJobForCoverLetter: (job: Job | null) => void;
  applications: ApplicationRecord[];
  addApplication: (job: Job, status?: ApplicationRecord['status']) => void;
  updateApplicationStatus: (id: string, status: ApplicationRecord['status']) => void;
  updateApplicationNotes: (id: string, notes: string) => void;
  autoApplyModalOpen: boolean;
  setAutoApplyModalOpen: (open: boolean) => void;
  autoApplyJob: Job | null;
  startAutoApply: (job: Job) => void;
  notification: string | null;
  showNotification: (msg: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Alex Tan",
  email: "alex.tan@example.sg",
  phone: "+65 9123 4567",
  currentTitle: "Software & Data Engineer",
  targetTitle: "Senior Full Stack / Analytics Engineer",
  yearsOfExperience: 4,
  targetSalarySGD: 8500,
  location: "Singapore",
  workModePreference: "Hybrid",
  targetIndustries: ["Information & Communications", "Financial Services"],
  skills: ["TypeScript", "React", "Node.js", "Python", "SQL", "Docker", "AWS", "Data Analysis", "Git", "REST APIs"]
};

const DEFAULT_RESUME: ResumeData = {
  id: "resume-master-01",
  versionName: "Master Resume (Verified)",
  isMaster: true,
  name: "Alex Tan",
  email: "alex.tan@example.sg",
  phone: "+65 9123 4567",
  location: "Singapore (Central)",
  summary: "Software and analytics professional with 4 years of hands-on experience building distributed web platforms and automated data pipelines across Singapore's digital technology landscape.",
  experiences: [
    {
      company: "SingTel Digital Hub",
      role: "Software & Data Engineer",
      startDate: "2023-01",
      endDate: "Present",
      highlights: [
        "Architected full-stack operational dashboards with React, TypeScript, and Node.js serving 45+ network engineers.",
        "Engineered automated ETL data extraction pipelines in Python & SQL processing 500,000+ daily operational records.",
        "Containerized core microservices with Docker on AWS, reducing deployment release cycle from 3 days to 45 minutes."
      ]
    },
    {
      company: "NCS Group",
      role: "Associate Systems Analyst",
      startDate: "2021-06",
      endDate: "2022-12",
      highlights: [
        "Implemented secure RESTful API integrations and database query performance tuning for Singapore public sector clients.",
        "Conducted end-to-end integration testing and automated regression suites, maintaining 99.8% test coverage.",
        "Collaborated in Agile Scrum squads to deliver feature specifications ahead of scheduled milestone reviews."
      ]
    }
  ],
  educations: [
    {
      institution: "National University of Singapore (NUS)",
      degree: "Bachelor of Computing",
      fieldOfStudy: "Information Systems",
      graduationYear: "2021"
    }
  ],
  skills: ["TypeScript", "React", "Node.js", "Python", "SQL", "Docker", "AWS", "Data Analysis", "Git", "REST APIs", "PostgreSQL"],
  certifications: ["AWS Certified Solutions Architect - Associate", "SkillsFuture Certified Data Analytics Specialist"],
  updatedAt: "2026-09-24T18:00:00Z"
};

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "app-01",
    jobId: "job-sg-001",
    jobTitle: "Senior Full Stack Engineer (Cloud & AI)",
    company: "GovTech Singapore",
    source: "Google Jobs",
    location: "One-North, Singapore",
    salarySGD: "SGD $7,800 - $12,500/mo",
    status: "Interview",
    dateAdded: "2026-09-19",
    appliedDate: "2026-09-20",
    interviewDate: "2026-09-28",
    resumeVersionName: "Tailored - GovTech AI",
    notes: "First technical round scheduled with GovTech GDS Lead. Review AWS architecture & container security.",
    matchScore: 92
  },
  {
    id: "app-02",
    jobId: "job-sg-002",
    jobTitle: "Data Analyst / Analytics Engineer",
    company: "DBS Bank",
    source: "Indeed",
    location: "Marina Bay Financial Centre, Singapore",
    salarySGD: "SGD $5,800 - $8,600/mo",
    status: "Applied",
    dateAdded: "2026-09-21",
    appliedDate: "2026-09-21",
    resumeVersionName: "Master Resume (Verified)",
    notes: "Submitted via official career portal. Awaiting screening status.",
    matchScore: 88
  },
  {
    id: "app-03",
    jobId: "job-sg-003",
    jobTitle: "AI / Machine Learning Engineer",
    company: "Grab Holdings",
    source: "Glassdoor",
    location: "One-North, Singapore",
    salarySGD: "SGD $8,500 - $14,000/mo",
    status: "Preparing",
    dateAdded: "2026-09-23",
    resumeVersionName: "Master Resume (Verified)",
    notes: "Tailoring resume bullet points to emphasize PyTorch and LLM agent experiments.",
    matchScore: 82
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [stakeholder, setStakeholder] = useState<StakeholderPersona>('job_seeker');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [resumes, setResumes] = useState<ResumeData[]>([DEFAULT_RESUME]);
  const [activeResume, setActiveResume] = useState<ResumeData>(DEFAULT_RESUME);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState<boolean>(true);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(['job-sg-001', 'job-sg-003']);
  const [topMatches, setTopMatches] = useState<{ job: Job; match: JobMatch }[]>([]);
  const [calculatingMatches, setCalculatingMatches] = useState<boolean>(false);

  const [selectedJobForDetail, setSelectedJobForDetail] = useState<Job | null>(null);
  const [selectedJobForTailoring, setSelectedJobForTailoring] = useState<Job | null>(null);
  const [selectedJobForInterview, setSelectedJobForInterview] = useState<Job | null>(null);
  const [selectedJobForCoverLetter, setSelectedJobForCoverLetter] = useState<Job | null>(null);

  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);

  const [autoApplyModalOpen, setAutoApplyModalOpen] = useState<boolean>(false);
  const [autoApplyJob, setAutoApplyJob] = useState<Job | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const refreshJobs = async () => {
    try {
      setLoadingJobs(true);
      const data = await api.getJobs();
      setJobs(data.jobs);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      showNotification('Unable to fetch jobs from server');
    } finally {
      setLoadingJobs(false);
    }
  };

  const calculateTopMatches = async () => {
    if (jobs.length === 0) return;
    try {
      setCalculatingMatches(true);
      // Run explainable matching on jobs
      const candidateProfile = {
        currentTitle: profile.currentTitle,
        yearsOfExperience: profile.yearsOfExperience,
        skills: profile.skills,
        experiences: activeResume.experiences,
        educations: activeResume.educations,
      };

      // Match each job (using top 10 ranked)
      const results: { job: Job; match: JobMatch }[] = [];
      for (const job of jobs) {
        try {
          const match = await api.matchJob(candidateProfile, job);
          results.push({ job, match });
        } catch (e) {
          console.error(`Match error for ${job.title}:`, e);
        }
      }

      // Sort descending by matchScore
      results.sort((a, b) => b.match.matchScore - a.match.matchScore);
      setTopMatches(results.slice(0, 10));
    } catch (err) {
      console.error('Error calculating top matches:', err);
    } finally {
      setCalculatingMatches(false);
    }
  };

  useEffect(() => {
    refreshJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0 && topMatches.length === 0) {
      calculateTopMatches();
    }
  }, [jobs, profile.skills]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      const next = exists ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      showNotification(exists ? 'Job removed from saved list' : 'Job saved to your portfolio');
      return next;
    });
  };

  const addApplication = (job: Job, status: ApplicationRecord['status'] = 'Saved') => {
    const existing = applications.find((a) => a.jobId === job.id);
    if (existing) {
      showNotification(`Application for ${job.company} is already in your tracker (${existing.status}).`);
      return;
    }

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      source: job.source,
      location: job.location,
      salarySGD: `SGD $${job.minSalarySGD.toLocaleString()} - $${job.maxSalarySGD.toLocaleString()}/mo`,
      status,
      dateAdded: new Date().toISOString().slice(0, 10),
      appliedDate: status === 'Applied' ? new Date().toISOString().slice(0, 10) : undefined,
      resumeVersionName: activeResume.versionName,
      notes: `Saved via unified job explorer.`,
    };

    setApplications((prev) => [newApp, ...prev]);
    showNotification(`Added ${job.title} at ${job.company} to application tracker.`);
  };

  const updateApplicationStatus = (id: string, status: ApplicationRecord['status']) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status,
              appliedDate: status === 'Applied' && !app.appliedDate ? new Date().toISOString().slice(0, 10) : app.appliedDate,
            }
          : app
      )
    );
    showNotification(`Status updated to "${status}"`);
  };

  const updateApplicationNotes = (id: string, notes: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, notes } : app))
    );
  };

  const startAutoApply = (job: Job) => {
    setAutoApplyJob(job);
    setAutoApplyModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        stakeholder,
        setStakeholder,
        profile,
        setProfile,
        resumes,
        setResumes,
        activeResume,
        setActiveResume,
        jobs,
        loadingJobs,
        refreshJobs,
        savedJobIds,
        toggleSaveJob,
        topMatches,
        calculateTopMatches,
        calculatingMatches,
        selectedJobForDetail,
        setSelectedJobForDetail,
        selectedJobForTailoring,
        setSelectedJobForTailoring,
        selectedJobForInterview,
        setSelectedJobForInterview,
        selectedJobForCoverLetter,
        setSelectedJobForCoverLetter,
        applications,
        addApplication,
        updateApplicationStatus,
        updateApplicationNotes,
        autoApplyModalOpen,
        setAutoApplyModalOpen,
        autoApplyJob,
        startAutoApply,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
