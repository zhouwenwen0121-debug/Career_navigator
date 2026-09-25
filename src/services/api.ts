import {
  Job,
  JobMatch,
  ResumeData,
  LabourMarketOverview,
  McpCapabilityItem,
  UserProfile,
} from '../types';

export const api = {
  async getJobs(params?: {
    q?: string;
    location?: string;
    workMode?: string;
    industry?: string;
    source?: string;
    minSalary?: number;
    experienceLevel?: string;
  }): Promise<{ jobs: Job[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.location) searchParams.set('location', params.location);
    if (params?.workMode) searchParams.set('workMode', params.workMode);
    if (params?.industry) searchParams.set('industry', params.industry);
    if (params?.source) searchParams.set('source', params.source);
    if (params?.minSalary) searchParams.set('minSalary', String(params.minSalary));
    if (params?.experienceLevel) searchParams.set('experienceLevel', params.experienceLevel);

    const res = await fetch(`/api/jobs?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async getJobById(id: string): Promise<Job> {
    const res = await fetch(`/api/jobs/${id}`);
    if (!res.ok) throw new Error('Job not found');
    const data = await res.json();
    return data.job;
  },

  async parseResume(text: string): Promise<ResumeData> {
    const res = await fetch('/api/resume/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('Failed to parse resume');
    const data = await res.json();
    return {
      id: `resume-${Date.now()}`,
      versionName: 'Master Resume',
      isMaster: true,
      updatedAt: new Date().toISOString(),
      ...data.resume,
    };
  },

  async matchJob(profile: Partial<UserProfile> & { experiences?: any[]; educations?: any[] }, job: Job): Promise<JobMatch> {
    const res = await fetch('/api/jobs/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, job }),
    });
    if (!res.ok) throw new Error('Failed to match job');
    const data = await res.json();
    return data.match;
  },

  async tailorResume(masterResume: ResumeData, job: Job): Promise<{
    tailoredSummary: string;
    keyHighlights: string[];
    modifications: { company: string; role: string; originalBullet: string; tailoredBullet: string; rationale: string }[];
  }> {
    const res = await fetch('/api/resume/tailor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masterResume, job }),
    });
    if (!res.ok) throw new Error('Failed to tailor resume');
    const data = await res.json();
    return data.tailored;
  },

  async generateCoverLetter(
    profile: Partial<UserProfile> & { experiences?: any[] },
    job: Job,
    tone: string = 'Professional'
  ): Promise<{
    subjectLine: string;
    greeting: string;
    openingParagraph: string;
    bodyParagraphs: string[];
    closingParagraph: string;
    fullLetterText: string;
  }> {
    const res = await fetch('/api/cover-letter/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, job, tone }),
    });
    if (!res.ok) throw new Error('Failed to generate cover letter');
    const data = await res.json();
    return data.coverLetter;
  },

  async prepareInterview(
    profile: Partial<UserProfile> & { experiences?: any[] },
    job: Job
  ): Promise<{
    technicalQuestions: { question: string; keyEvaluationPoints: string[]; suggestedApproach: string }[];
    behavioralQuestions: { question: string; competency: string; starPrompt: { situation: string; task: string; action: string; result: string } }[];
    roleSpecificTips: string[];
    questionsForInterviewer: string[];
  }> {
    const res = await fetch('/api/interview/prepare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, job }),
    });
    if (!res.ok) throw new Error('Failed to prepare interview');
    const data = await res.json();
    return data.prep;
  },

  async getLabourMarketInsights(): Promise<LabourMarketOverview> {
    const res = await fetch('/api/labour-market/insights');
    if (!res.ok) throw new Error('Failed to fetch labour market data');
    const data = await res.json();
    return data.data;
  },

  async getSkillsTaxonomy(): Promise<any[]> {
    const res = await fetch('/api/skills/taxonomy');
    if (!res.ok) throw new Error('Failed to fetch skills taxonomy');
    const data = await res.json();
    return data.skills;
  },

  async getMcpStatus(): Promise<McpCapabilityItem[]> {
    const res = await fetch('/api/mcp/status');
    if (!res.ok) throw new Error('Failed to fetch MCP status');
    const data = await res.json();
    return data.matrix;
  },

  async chatNavigator(
    messages: { role: string; content: string }[],
    profile: any,
    contextData?: any
  ): Promise<{ reply: string; suggestedActions?: string[] }> {
    const res = await fetch('/api/navigator/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, profile, contextData }),
    });
    if (!res.ok) throw new Error('Failed to get response from Career Navigator');
    return res.json();
  },

  async simulateAutoApply(payload: {
    jobId: string;
    userExplicitConsent: boolean;
    applicationPackage: any;
  }): Promise<any> {
    const res = await fetch('/api/applications/auto-apply/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Auto-apply failed');
    }
    return res.json();
  },
};
