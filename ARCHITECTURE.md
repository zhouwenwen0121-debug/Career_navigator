# AI Career Navigator: Architecture & System Specification

## 1. Product Requirements
- **Target Audience:** Job seekers (career switchers, active job hunters), Fresh graduates (entry-level role discovery, skill alignment), Retrenched/Disrupted workers (transferable skills, career pivot), Career coaches, and Educational/Labour stakeholders.
- **Geographic Focus:** Singapore initially (SSG Skills Framework, MOM labour market statistics, local salaries in SGD, regional hubs like One-North, Marina Bay, Jurong Innovation District), extensible to global markets (OECD, ILOSTAT).
- **Core Value Proposition:** "Understand your skills → discover suitable opportunities → understand the labour market → identify skill gaps → improve your application → prepare for interviews → apply safely → track your career."
- **Key Constraints:**
  - Zero hallucination: Never invent user qualifications, employers, jobs, salaries, or labour statistics.
  - Transparent & Explainable AI: No arbitrary black-box scores without evidence-based breakdowns (matching skills, missing skills, experience alignment).
  - Explicit confirmation for auto-apply: Zero silent submissions; every application package is user-reviewed and confirmed.
  - Extensible MCP / Data Provider Abstraction: Frontend never hardcoded to raw vendor APIs; adapters handle fallback and capability discovery.

---

## 2. Core User Journey
1. **Sign Up & Profile Setup:** Define career goals, current job title, years of experience, target salary, preferred work mode (Hybrid, On-site, Remote).
2. **Resume Ingestion & Parsing:** Upload resume (PDF, DOCX, text) → Extract verified experience, education, certifications, and demonstrated skills. User reviews and can correct extracted data.
3. **Skill Taxonomy & Normalization:** Map extracted skills to Singapore Skills Framework (SSG) & normalized skills taxonomy; categorize into Confirmed, Transferable, and Inferred.
4. **Unified Job Discovery:** Aggregate postings across providers (Indeed, Glassdoor, Google Jobs, Laddro) into normalized schema with verified data only.
5. **Explainable Match & Top 10 Opportunities:** Calculate skill overlap, education alignment, experience congruence, and generate natural-language explanations ("Why this matches you").
6. **Skill Gap & Development Analysis:** Identify missing required vs preferred skills, explain why each matters, and map to curated SSG training paths.
7. **Labour Market & Salary Intelligence:** Benchmark against Singapore MOM wage data and industry growth trends (Information & Communications, FinTech, Healthcare, etc.).
8. **Resume Tailoring & Cover Letter Generation:** Reorder and highlight authentic user experiences matching the selected job without inventing facts. Generate customized cover letter in selected tone (Professional, Concise, Confident, Warm).
9. **Interview Preparation:** Generate role-specific technical and behavioral STAR questions with customized answer guidance based on the candidate's actual history.
10. **Application Optimization & Safe Apply:** Final application review checklist; explicit confirmation modal; manual or JobGPT-assisted submission.
11. **Application Tracking & Career Progression:** Track progress across 8 pipeline stages (Kanban & List views); explore 2-year and 5-year progression pathways.

---

## 3. Feature Map
| Module | Sub-Features | User Goal |
|---|---|---|
| **Dashboard** | Profile completeness, active applications summary, Top 10 matches preview, urgent skill gaps, MOM labour trend alert | Single-pane-of-glass overview |
| **Job Search & Top 10** | Filter by role, industry, salary, work mode, provider; Top 10 matched jobs ranking; "Why this matches you" explainable panel | Discover high-fit jobs with transparency |
| **Resume & Profile Studio** | Multi-version resume management, parsing audit (user correction), PDF resume export, skill extraction verification | Maintain verifiable professional records |
| **Skill Analysis Hub** | Singapore Skills Framework integration, Confirmed vs Missing vs Transferable skills, SSG course/training mapping | Systematic upskilling roadmaps |
| **Resume Tailor & Cover Letter** | Side-by-side diff viewer, authentic tailoring rules, tone-selectable cover letter generator, versioning | High-conversion, honest job applications |
| **Labour Market Insights** | MOM sector demand trends, hiring vacancy rates, wage percentiles (25th/Median/75th in SGD), emerging occupations | Grounded economic decision-making |
| **Interview Prep** | Technical assessment topics, behavioral STAR scenarios, candidate background mapping, practice notes | Confident interview readiness |
| **Application Tracker** | 8 pipeline stages, Kanban board, list view, deadline alerts, interview logging, application notes | Structured pipeline management |
| **Career Navigator (AI Chat)** | Natural language career advice, career pivot discovery, interactive tool invocation (search jobs, analyze gaps) | Real-time interactive career guidance |
| **MCP & Integration Hub** | Live capability matrix, provider statuses, tool endpoints, connection health, adapter configuration | Modular system transparency |

---

## 4. MCP Capability Matrix
| MCP / Provider | Capability / Feature | Underlying Tool / Method | Input Requirements | Output Schema | System Feature | Status |
|---|---|---|---|---|---|---|
| **AI HR Toolkit** | Resume screening & candidate matching | `screen_resume`, `match_candidate_job` | Resume text, Job description | Match breakdown, skill overlap, gap list | Resume Analysis, Job Matcher | Available via Gemini Server-Side Adapter |
| **Indeed Adapter** | Job search aggregation | `search_jobs` | Query, Location, Radius, JobType | Array of NormalizedJob items | Job Search Engine | Connected (Adapter + Live Data) |
| **Glassdoor Adapter** | Salary benchmarking & company reviews | `get_salary_insights`, `get_company_reviews` | Job title, Location, Company | Salary percentiles, ratings, pros/cons | Salary Comparison & Job Cards | Connected (Adapter + MOM Benchmark) |
| **Google Jobs Adapter** | Web job discovery | `query_jobs` | Search terms, Country code | Job title, employer, apply link, description | Job Discovery | Connected (Adapter) |
| **Laddro Career** | Resume tailoring & cover letters | `tailor_resume`, `generate_cover_letter` | Master resume, Target job JD, Tone | Tailored sections, diffs, letter body | Resume Tailoring & Cover Letter | Connected via Gemini Server-Side Adapter |
| **StoryLenses** | Storytelling & behavioral cover letter | `craft_narrative` | Experience bullet points, culture fit | Value proposition narrative | Cover Letter Generator | Connected via Gemini Adapter |
| **skill-repo** | Skill taxonomy normalization | `normalize_skill`, `get_related_skills` | Raw skill string | Standardized skill ID, category, related | Common Skills Taxonomy | Connected (SSG + Standard Taxonomy) |
| **pm-skills** | Product & project management competencies | `get_pm_competencies` | Role level, domain | Competency rubric, KPIs, tools | PM Career Paths & Skill Analysis | Connected |
| **ILOSTAT** | International labour market statistics | `get_labour_indicators` | Country code, indicator, year | Employment rate, sector distribution | Global Labour Market Insights | Connected (SG MOM + ILOSTAT dataset) |
| **OECD MCP** | Macroeconomic and skill trends | `query_oecd_data` | Country, measure, frequency | Growth index, automation vulnerability | Labour Market Dashboard | Connected (OECD SG Data) |
| **ShipReal** | App deployment & build telemetry | `get_deployment_status` | Applet ID, build ID | Build health, container status | System Health Monitor | Connected |
| **JobGPT AutoApply** | Guided job application submission | `prepare_application`, `submit_application` | Application package, explicit approval | Submission receipt, external job ID | Safe Auto-Apply Optimizer | Connected with Explicit User Guardrail |

---

## 5. System Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (React 19 SPA)                   │
│  ┌───────────────┬────────────────┬────────────────┬────────────────┐  │
│  │   Dashboard   │  Jobs & Top 10 │ Resume & Tailor│ Skills Matrix  │  │
│  ├───────────────┼────────────────┼────────────────┼────────────────┤  │
│  │ Labour Market │ Interview Prep │  App Tracker   │ AI Navigator   │  │
│  └───────────────┴────────────────┴────────────────┴────────────────┘  │
│         │                 │                │                │          │
│         ▼                 ▼                ▼                ▼          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Client State & Service Hub                  │  │
│  │   (JobSearchService, ResumeService, SkillService, AppService)     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / SSE
┌───────────────────────────────────▼────────────────────────────────────┐
│                    FULL-STACK BACKEND (Express on Node.js)             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      API Router & Middleware                     │  │
│  │   - /api/jobs        - /api/resume/parse     - /api/match        │  │
│  │   - /api/tailor      - /api/cover-letter     - /api/interview    │  │
│  │   - /api/labour      - /api/navigator/chat   - /api/mcp/status   │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│         ┌───────────────────────────┴───────────────────────────┐      │
│         ▼                                                       ▼      │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐ │
│  │   Gemini 3.8 Flash Engine     │   │     MCP & Provider Layer      │ │
│  │ (@google/genai Server Client) │   │ (Indeed, Glassdoor, SSG, MOM, │ │
│  │ - Strictly Grounded Prompts   │   │  skill-repo, ILOSTAT, OECD)   │ │
│  │ - Zero Hallucination Guard    │   │ - Unified Normalization Engine│ │
│  │ - High-Precision Extraction   │   │ - Resilient Fallback Cache    │ │
│  └───────────────────────────────┘   └───────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Database / State Schema
- **User:** `id`, `name`, `email`, `role`, `createdAt`
- **UserProfile:** `userId`, `currentTitle`, `targetTitle`, `yearsOfExperience`, `targetSalarySGD`, `location`, `workModePreference`, `targetIndustries`
- **Resume:** `id`, `userId`, `versionName`, `isMaster`, `summary`, `experiences[]`, `educations[]`, `skills[]`, `certifications[]`, `rawText`, `updatedAt`
- **Skill:** `id`, `name`, `canonicalCategory`, `ssgCategory` (Skills Framework), `isEmerging`, `demandLevel` (High/Medium/Low)
- **Job:** `id`, `title`, `company`, `location`, `country`, `workMode`, `employmentType`, `minSalarySGD`, `maxSalarySGD`, `currency`, `description`, `requiredSkills[]`, `preferredSkills[]`, `experienceLevel`, `educationLevel`, `postedDate`, `source`, `sourceUrl`, `externalId`
- **JobMatch:** `id`, `userId`, `jobId`, `matchScore`, `matchingSkills[]`, `missingSkills[]`, `experienceFit`, `educationFit`, `explanation`, `calculatedAt`
- **Application:** `id`, `userId`, `jobId`, `status` (Saved, Preparing, Ready to Apply, Applied, Interview, Offer, Rejected, Withdrawn), `resumeVersionId`, `coverLetterText`, `notes`, `appliedDate`, `interviewDate`
- **LabourMarketData:** `id`, `industry`, `occupation`, `period`, `jobDemandIndex`, `medianSalarySGD`, `p25SalarySGD`, `p75SalarySGD`, `growthRate`, `emergingSkills[]`, `sourceCitation`

---

## 7. API / Service Architecture
- `POST /api/resume/parse`: Extracts verified career entities and skills using Gemini 3.8 Flash.
- `POST /api/jobs/search`: Unified query endpoint across provider adapters with filtering & sorting.
- `POST /api/jobs/match`: Computes explainable match between candidate profile and target jobs.
- `POST /api/resume/tailor`: Aligns candidate bullet points to job description with diff tracking.
- `POST /api/cover-letter/generate`: Generates personalized cover letter with user-selected tone.
- `POST /api/interview/prepare`: Produces technical, situational, and behavioral questions with STAR guide.
- `POST /api/navigator/chat`: Career Navigator conversation with intent recognition and tool orchestration.
- `GET  /api/labour-market/insights`: MOM and SSG verified sector trends and wage statistics.
- `GET  /api/mcp/status`: Real-time capability matrix and connection diagnostics.

---

## 8. AI Workflow Architecture & Anti-Hallucination Guardrails
- **Prompt Isolation:** Instructions strictly state: *"Do not invent companies, degrees, dates, skills, or achievements not explicitly stated in the input."*
- **Explainable Match Rationale:** Natural language reasons highlighting demonstrated strengths vs unproven requirements.
- **Editable AI Outputs:** All AI-extracted fields, tailored resumes, and cover letters provide instant inline editing so human judgment always takes precedence.
- **Safe Auto-Apply:** Explicit consent gate: *"I have reviewed my application package and confirm submission."*

---

## 9. MVP Scope & Phased Milestones
- **Phase 1 (Delivered):** Complete unified job search, Top 10 matches with explainable rationales, resume parsing and correction, Singapore Skills Framework mapping, resume tailoring with diffs, cover letter generation, interview preparation, application tracker (Kanban & List), AI Career Navigator chat, Singapore MOM labour market insights, and MCP capability explorer.
- **Phase 2:** Live webhook sync with company applicant tracking systems (Greenhouse, Workday), real-time wage percentile updates from MOM API releases.
- **Phase 3:** Dedicated dashboards for Career Coaches, Enterprise Employers, and Workforce Singapore (WSG) institutions.
