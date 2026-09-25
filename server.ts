import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { SINGAPORE_JOBS } from './server/data/singaporeJobs.js';
import { SINGAPORE_LABOUR_MARKET } from './server/data/labourMarketData.js';
import { SKILLS_TAXONOMY, normalizeSkillName } from './server/data/skillsTaxonomy.js';
import { MCP_CAPABILITY_MATRIX } from './server/mcp/capabilityMatrix.js';
import {
  handleMcpRpc,
  handleMcpSse,
  handleMcpMessage,
  MCP_TOOLS_DEFINITIONS,
  MCP_RESOURCES_DEFINITIONS,
  MCP_PROMPTS_DEFINITIONS,
} from './server/mcp/realMcpServer.js';
import {
  parseResumeWithGemini,
  matchJobWithGemini,
  tailorResumeWithGemini,
  generateCoverLetterWithGemini,
  prepareInterviewWithGemini,
  chatWithCareerNavigator,
} from './server/geminiClient.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// --- API ROUTES ---

// 1. Resume Parsing
app.post('/api/resume/parse', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required for resume parsing' });
    }
    const result = await parseResumeWithGemini(text);
    res.json({ success: true, resume: result });
  } catch (error) {
    console.error('Error parsing resume:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

// 2. Unified Job Search
app.get('/api/jobs', (req, res) => {
  try {
    const { q, location, workMode, industry, minSalary, source, experienceLevel } = req.query;
    let filtered = [...SINGAPORE_JOBS];

    if (q && typeof q === 'string') {
      const query = q.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(query) ||
          j.company.toLowerCase().includes(query) ||
          j.description.toLowerCase().includes(query) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (location && typeof location === 'string') {
      filtered = filtered.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (workMode && typeof workMode === 'string' && workMode !== 'All') {
      filtered = filtered.filter((j) => j.workMode.toLowerCase() === workMode.toLowerCase());
    }

    if (industry && typeof industry === 'string' && industry !== 'All') {
      filtered = filtered.filter((j) => j.industry.toLowerCase().includes(industry.toLowerCase()));
    }

    if (source && typeof source === 'string' && source !== 'All') {
      filtered = filtered.filter((j) => j.source.toLowerCase() === source.toLowerCase());
    }

    if (experienceLevel && typeof experienceLevel === 'string' && experienceLevel !== 'All') {
      filtered = filtered.filter((j) => j.experienceLevel.toLowerCase() === experienceLevel.toLowerCase());
    }

    if (minSalary && !isNaN(Number(minSalary))) {
      filtered = filtered.filter((j) => j.maxSalarySGD >= Number(minSalary));
    }

    res.json({
      success: true,
      total: filtered.length,
      jobs: filtered,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to search jobs' });
  }
});

// 3. Single Job by ID
app.get('/api/jobs/:id', (req, res) => {
  const job = SINGAPORE_JOBS.find((j) => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({ success: true, job });
});

// 4. Job Match Analysis
app.post('/api/jobs/match', async (req, res) => {
  try {
    const { profile, job } = req.body;
    if (!profile || !job) {
      return res.status(400).json({ error: 'Both profile and job are required for match analysis' });
    }
    const matchResult = await matchJobWithGemini(profile, job);
    res.json({ success: true, match: matchResult });
  } catch (error) {
    console.error('Error matching job:', error);
    res.status(500).json({ error: 'Failed to calculate job match' });
  }
});

// 5. Resume Tailoring
app.post('/api/resume/tailor', async (req, res) => {
  try {
    const { masterResume, job } = req.body;
    if (!masterResume || !job) {
      return res.status(400).json({ error: 'Master resume and target job required' });
    }
    const tailored = await tailorResumeWithGemini(masterResume, job);
    res.json({ success: true, tailored });
  } catch (error) {
    console.error('Error tailoring resume:', error);
    res.status(500).json({ error: 'Failed to tailor resume' });
  }
});

// 6. Cover Letter Generation
app.post('/api/cover-letter/generate', async (req, res) => {
  try {
    const { profile, job, tone } = req.body;
    if (!profile || !job) {
      return res.status(400).json({ error: 'Profile and job required' });
    }
    const coverLetter = await generateCoverLetterWithGemini(profile, job, tone || 'Professional');
    res.json({ success: true, coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

// 7. Interview Preparation
app.post('/api/interview/prepare', async (req, res) => {
  try {
    const { profile, job } = req.body;
    if (!profile || !job) {
      return res.status(400).json({ error: 'Profile and job required' });
    }
    const prep = await prepareInterviewWithGemini(profile, job);
    res.json({ success: true, prep });
  } catch (error) {
    console.error('Error preparing interview:', error);
    res.status(500).json({ error: 'Failed to prepare interview' });
  }
});

// 8. Labour Market Insights (Singapore MOM + SSG)
app.get('/api/labour-market/insights', (req, res) => {
  res.json({
    success: true,
    data: SINGAPORE_LABOUR_MARKET,
  });
});

// 9. Skills Taxonomy & Normalization
app.get('/api/skills/taxonomy', (req, res) => {
  const { query } = req.query;
  if (query && typeof query === 'string') {
    const normalized = normalizeSkillName(query);
    return res.json({ success: true, match: normalized });
  }
  res.json({
    success: true,
    skills: SKILLS_TAXONOMY,
  });
});

// 10. MCP Capability Matrix & Status
app.get('/api/mcp/status', (req, res) => {
  res.json({
    success: true,
    matrix: MCP_CAPABILITY_MATRIX,
  });
});

// 11. Conversational AI Career Navigator
app.post('/api/navigator/chat', async (req, res) => {
  try {
    const { messages, profile, contextData } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    const response = await chatWithCareerNavigator(messages, profile, contextData);
    res.json({ success: true, ...response });
  } catch (error) {
    console.error('Error in Career Navigator chat:', error);
    res.status(500).json({ error: 'Career Navigator failed to respond' });
  }
});

// 12. Safe JobGPT AutoApply Simulation with User Consent Verification
app.post('/api/applications/auto-apply/simulate', (req, res) => {
  const { jobId, userExplicitConsent, applicationPackage } = req.body;
  if (!userExplicitConsent) {
    return res.status(403).json({
      error: 'CRITICAL SAFETY GUARDRAIL: Auto-apply requires explicit user review and confirmation before submission.',
    });
  }

  const job = SINGAPORE_JOBS.find((j) => j.id === jobId);
  if (!job) {
    return res.status(404).json({ error: 'Target job not found' });
  }

  res.json({
    success: true,
    status: 'SUBMITTED',
    confirmationId: `SG-APP-${Date.now().toString(36).toUpperCase()}`,
    jobTitle: job.title,
    company: job.company,
    submittedAt: new Date().toISOString(),
    receipt: {
      candidateName: applicationPackage?.candidateName || 'Candidate',
      resumeVersion: applicationPackage?.resumeVersionName || 'Master Resume',
      coverLetterIncluded: Boolean(applicationPackage?.coverLetterText),
      source: job.source,
      externalJobId: job.externalJobId,
    },
  });
});

// 13. Official Model Context Protocol (MCP) Endpoints
// Standard JSON-RPC 2.0 endpoint (supports initialize, tools/list, tools/call, resources/list, resources/read, prompts/list)
app.post('/api/mcp/rpc', handleMcpRpc);

// Server-Sent Events (SSE) Transport for interactive MCP clients
app.get('/api/mcp/sse', handleMcpSse);
app.post('/api/mcp/message', handleMcpMessage);

// Live MCP Specification Inspection
app.get('/api/mcp/spec', (req, res) => {
  res.json({
    success: true,
    protocolVersion: '2024-11-05',
    serverInfo: {
      name: 'ai-career-navigator-mcp',
      version: '1.0.0',
      description: 'Official Singapore workforce, job matching & skills intelligence MCP server',
    },
    capabilities: {
      toolsCount: MCP_TOOLS_DEFINITIONS.length,
      resourcesCount: MCP_RESOURCES_DEFINITIONS.length,
      promptsCount: MCP_PROMPTS_DEFINITIONS.length,
    },
    tools: MCP_TOOLS_DEFINITIONS,
    resources: MCP_RESOURCES_DEFINITIONS,
    prompts: MCP_PROMPTS_DEFINITIONS,
  });
});

// --- FRONTEND INTEGRATION (Vite / Static) ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Career Navigator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
