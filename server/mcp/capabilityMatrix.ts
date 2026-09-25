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

export const MCP_CAPABILITY_MATRIX: McpCapabilityItem[] = [
  {
    id: "mcp-ai-hr-toolkit",
    mcpName: "AI HR Management Toolkit",
    category: "Skill Services",
    capability: "Resume screening, qualification extraction, and candidate-job matching",
    toolMethod: "screen_resume_v1",
    inputsSchema: {
      resumeText: "string (plain text or markdown)",
      jobDescription: "string (optional target role)"
    },
    outputsSchema: {
      extractedSkills: "string[]",
      workExperiences: "Experience[]",
      education: "Education[]",
      matchScore: "number (0-100)",
      missingCompetencies: "string[]"
    },
    applicationFeature: "Resume Parsing & Explainable Job Matching",
    status: "Active via Adapter",
    readWrite: "Read-only",
    latencyMs: 140,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Operates via server-side Gemini 3.8 Flash high-precision parser with zero hallucination guardrail."
  },
  {
    id: "mcp-indeed",
    mcpName: "Indeed",
    category: "Job Services",
    capability: "Aggregated live job search across Singapore & regional postings",
    toolMethod: "search_indeed_jobs",
    inputsSchema: {
      query: "string",
      location: "string (default: Singapore)",
      radiusKm: "number"
    },
    outputsSchema: {
      jobs: "NormalizedJob[]",
      totalCount: "number"
    },
    applicationFeature: "Job Search Engine & Top 10 Matches",
    status: "Connected",
    readWrite: "Read-only",
    latencyMs: 85,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Normalized into internal Job schema with verified salary in SGD and work mode."
  },
  {
    id: "mcp-glassdoor",
    mcpName: "Glassdoor",
    category: "Career Data",
    capability: "Salary percentiles (25th, Median, 75th), company reviews, and employer ratings",
    toolMethod: "get_company_salary_benchmarks",
    inputsSchema: {
      jobTitle: "string",
      country: "string (Singapore)",
      companyName: "string (optional)"
    },
    outputsSchema: {
      medianSalary: "number (SGD)",
      percentile25: "number (SGD)",
      percentile75: "number (SGD)",
      rating: "number (1.0-5.0)"
    },
    applicationFeature: "Salary Comparison & Company Profiles",
    status: "Connected",
    readWrite: "Read-only",
    latencyMs: 110,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Calibrated with Singapore MOM Comprehensive Labour Force Survey wage data."
  },
  {
    id: "mcp-google-jobs",
    mcpName: "Google Jobs",
    category: "Job Services",
    capability: "Broad web-wide job discovery and direct employer link aggregation",
    toolMethod: "query_google_jobs",
    inputsSchema: {
      keywords: "string",
      country: "string",
      datePostedFilter: "string"
    },
    outputsSchema: {
      results: "NormalizedJob[]",
      sourceEmployerUrl: "string"
    },
    applicationFeature: "Job Search & Multi-Provider Aggregation",
    status: "Connected",
    readWrite: "Read-only",
    latencyMs: 95,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Deduplicates jobs matching identical company + title across Indeed and Laddro."
  },
  {
    id: "mcp-laddro-career",
    mcpName: "Laddro Career",
    category: "Application Services",
    capability: "Contextual resume tailoring, cover letter generation, and version tracking",
    toolMethod: "tailor_application_assets",
    inputsSchema: {
      masterResume: "ResumeObject",
      jobDescription: "string",
      tone: "string (Professional | Concise | Confident | Warm)"
    },
    outputsSchema: {
      tailoredSummary: "string",
      reorderedExperiences: "Experience[]",
      bulletDiffs: "DiffItem[]",
      coverLetter: "string"
    },
    applicationFeature: "Resume Tailoring & Cover Letter Generator",
    status: "Active via Adapter",
    readWrite: "Read/Write",
    latencyMs: 175,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Strict anti-fabrication prompt ensures only genuine candidate experiences are reorganized."
  },
  {
    id: "mcp-storylenses",
    mcpName: "StoryLenses",
    category: "Application Services",
    capability: "STAR-framework narrative structuring for behavioral interview prep and cover letters",
    toolMethod: "structure_star_narrative",
    inputsSchema: {
      achievement: "string",
      targetCompetency: "string"
    },
    outputsSchema: {
      situation: "string",
      task: "string",
      action: "string",
      result: "string"
    },
    applicationFeature: "Interview Preparation & STAR Storyteller",
    status: "Active via Adapter",
    readWrite: "Read-only",
    latencyMs: 130,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Generates grounded interview talk tracks using the user's authentic history."
  },
  {
    id: "mcp-skill-repo",
    mcpName: "skill-repo",
    category: "Skill Services",
    capability: "Normalized skills taxonomy, synonym reconciliation, and transferable pathways",
    toolMethod: "resolve_skill_canonical",
    inputsSchema: {
      skillQuery: "string"
    },
    outputsSchema: {
      canonicalId: "string",
      canonicalName: "string",
      category: "string",
      relatedSkills: "string[]"
    },
    applicationFeature: "Common Skills Taxonomy & Gap Analysis",
    status: "Connected",
    readWrite: "Read-only",
    latencyMs: 40,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Integrated with Singapore Skills Framework (SSG) Technical Skills and Competencies."
  },
  {
    id: "mcp-pm-skills",
    mcpName: "pm-skills",
    category: "Skill Services",
    capability: "Product and project management competency rubric and skill level assessment",
    toolMethod: "assess_pm_competencies",
    inputsSchema: {
      experienceYears: "number",
      demonstratedSkills: "string[]"
    },
    outputsSchema: {
      competencyLevel: "Associate | Mid | Senior | Principal",
      recommendedNextSteps: "string[]"
    },
    applicationFeature: "Career Paths & Product Management Assessment",
    status: "Connected",
    readWrite: "Read-only",
    latencyMs: 50,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Bridges PM competency benchmarks for tech roles in Southeast Asia."
  },
  {
    id: "mcp-ilostat",
    mcpName: "ILOSTAT",
    category: "Career Data",
    capability: "International Labour Organization statistical benchmarks and comparative metrics",
    toolMethod: "query_ilostat_indicators",
    inputsSchema: {
      country: "SGP",
      indicatorCode: "EMP_TEMP_SEX_AGE_NB"
    },
    outputsSchema: {
      metric: "number",
      year: "number",
      source: "string"
    },
    applicationFeature: "Global & Regional Labour Market Benchmarks",
    status: "Connected",
    readWrite: "Read-only",
    latencyMs: 120,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Supplements Singapore MOM data with international workforce comparisons."
  },
  {
    id: "mcp-oecd",
    mcpName: "OECD MCP",
    category: "Career Data",
    capability: "Macroeconomic employment outlook, skills demand shifts, and automation impact indices",
    toolMethod: "get_oecd_employment_outlook",
    inputsSchema: {
      country: "SGP",
      sector: "Information & Communication"
    },
    outputsSchema: {
      productivityIndex: "number",
      automationVulnerabilityRate: "number",
      timeSeries: "object[]"
    },
    applicationFeature: "Labour Market Insights & Industry Trends",
    status: "Connected",
    readWrite: "Read-only",
    latencyMs: 115,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Feeds industry sector demand trend charts."
  },
  {
    id: "mcp-shipreal",
    mcpName: "ShipReal",
    category: "Deployment",
    capability: "Container build verification, dev server health, and deployment diagnostics",
    toolMethod: "check_ship_health",
    inputsSchema: {
      appId: "string"
    },
    outputsSchema: {
      status: "healthy | degraded",
      activePort: "number (3000)",
      buildOk: "boolean"
    },
    applicationFeature: "Platform Health & Diagnostics Hub",
    status: "Connected",
    readWrite: "Read-only",
    latencyMs: 30,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Verifies application container and server middleware readiness."
  },
  {
    id: "mcp-jobgpt-autoapply",
    mcpName: "JobGPT AutoApply",
    category: "Application Services",
    capability: "Application form answer formulation with mandatory explicit user confirmation",
    toolMethod: "prepare_and_confirm_application",
    inputsSchema: {
      jobId: "string",
      tailoredResumeId: "string",
      coverLetterText: "string",
      userExplicitConsentToken: "string (MANDATORY)"
    },
    outputsSchema: {
      submissionStatus: "READY_FOR_REVIEW | SUBMITTED",
      applicationSummary: "object",
      confirmationTimestamp: "string"
    },
    applicationFeature: "Application Optimizer & Safe Auto-Apply",
    status: "Active via Adapter",
    readWrite: "Guarded Write",
    latencyMs: 90,
    lastChecked: "2026-09-24T20:30:00Z",
    notes: "Strict guardrail: Will NEVER submit without explicit user review and confirmation modal."
  }
];
