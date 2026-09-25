import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Kanban,
  Building,
  Target,
  Users,
  Compass,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JobCard } from './JobCard';

export const DashboardView: React.FC = () => {
  const {
    profile,
    activeResume,
    topMatches,
    jobs,
    applications,
    setActiveTab,
    setSelectedJobForDetail,
    stakeholder
  } = useApp();

  const profileCompletePercent = Math.min(
    100,
    Math.round(
      ((profile.name ? 20 : 0) +
        (profile.targetTitle ? 20 : 0) +
        (profile.skills.length >= 5 ? 20 : 0) +
        (activeResume.experiences.length > 0 ? 20 : 0) +
        (activeResume.educations.length > 0 ? 20 : 0))
    )
  );

  const pendingApplications = applications.filter(a => a.status === 'Applied' || a.status === 'Interview');
  const topThreeMatches = topMatches.slice(0, 3);

  // Collect aggregated missing skills across matches for quick upskilling priority
  const missingSkillFrequency: Record<string, number> = {};
  topMatches.forEach(m => {
    m.match.missingSkills.forEach(s => {
      missingSkillFrequency[s] = (missingSkillFrequency[s] || 0) + 1;
    });
  });

  const topMissingSkills = Object.entries(missingSkillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([skill, count]) => ({ skill, count }));

  return (
    <div className="space-y-6">
      {/* Stakeholder Perspective Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>AI Career Navigator · Singapore Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Welcome back, {profile.name}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {stakeholder === 'fresh_graduate' &&
              "Explore entry-level tech and business opportunities in Singapore aligned with your degree and foundational projects. Identify key SkillsFuture competencies required by local employers."}
            {stakeholder === 'retrenched_worker' &&
              "Map your existing professional experience into high-growth sectors (Information & Communications, Advanced Manufacturing, Financial Services). Prioritize transferable skills to fast-track your career transition."}
            {stakeholder === 'career_coach' &&
              "Coach-view enabled: Review candidate skill alignments, labor market wage bands, and generate customized career progression recommendations for client consultations."}
            {stakeholder === 'workforce_agency' &&
              "Workforce Agency Dashboard: Monitor job vacancy ratios, sector employment trends, and evaluate curriculum relevance against Singapore Skills Framework standards."}
            {stakeholder === 'job_seeker' &&
              `You have ${topMatches.length} highly aligned job opportunities in Singapore. Your demonstrated skills in ${profile.skills.slice(0, 3).join(', ')} match high-demand openings across GovTech, DBS, and local innovation clusters.`}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('top_matches')}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Top 10 Matched Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('navigator')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Ask AI Career Navigator</span>
            </button>
            <button
              onClick={() => setActiveTab('labour_market')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>MOM Labour Market Report</span>
            </button>
          </div>
        </div>

        {/* Ambient background graphic */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* High-Level Pulse Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Profile Completeness */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Profile Completeness</span>
            <span className="font-semibold text-slate-900">{profileCompletePercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">{activeResume.versionName}</span>
            <button
              onClick={() => setActiveTab('resume')}
              className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            >
              Edit Resume
            </button>
          </div>
        </div>

        {/* Card 2: Top Matches Ready */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>High-Fit Jobs Identified</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {topMatches.length} Roles
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Avg Fit: {topMatches.length > 0 ? Math.round(topMatches.reduce((acc, m) => acc + m.match.matchScore, 0) / topMatches.length) : 0}%</span>
            <button
              onClick={() => setActiveTab('top_matches')}
              className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            >
              View Top 10
            </button>
          </div>
        </div>

        {/* Card 3: Active Application Pipeline */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Active Pipeline</span>
            <Kanban className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1">
            {applications.length} Tracked
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">{pendingApplications.length} In-Review / Interview</span>
            <button
              onClick={() => setActiveTab('tracker')}
              className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            >
              Open Tracker
            </button>
          </div>
        </div>

        {/* Card 4: SG Market Indicator */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>SG Tech Vacancy Ratio</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mb-1">
            1.65 Ratio
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">MOM Q2 2026 Data</span>
            <button
              onClick={() => setActiveTab('labour_market')}
              className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            >
              Sector Trends
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Matched Jobs Preview (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Top Matched Opportunities (Singapore)
              </h2>
              <p className="text-xs text-slate-500">
                Ranked by demonstrated skill alignment, experience fit, and MOM industry outlook.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('top_matches')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View all Top 10</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {topThreeMatches.length > 0 ? (
              topThreeMatches.map(({ job, match }) => (
                <JobCard
                  key={job.id}
                  job={job}
                  match={match}
                  onViewDetail={() => setSelectedJobForDetail(job)}
                />
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                Analyzing your profile against available Singapore job postings...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Skill Gap Snapshot & Career Tools (1 Col) */}
        <div className="space-y-6">
          {/* Skill Gap Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                <span>Priority Skill Gap Areas</span>
              </h3>
              <button
                onClick={() => setActiveTab('skills')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                SSG Roadmap
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              These competencies are requested by your target jobs but not yet demonstrated in your resume:
            </p>

            <div className="space-y-3">
              {topMissingSkills.map(({ skill, count }) => (
                <div key={skill} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{skill}</div>
                    <div className="text-[11px] text-slate-500">Requested in {count} of your matched jobs</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('skills')}
                    className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 cursor-pointer"
                  >
                    View Courses
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Fast Application Workflows
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('tailor')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">Tailor Master Resume</div>
                  <div className="text-[11px] text-slate-500">Align bullet points to specific JD with zero fabrication</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('cover_letter')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">Craft Targeted Cover Letter</div>
                  <div className="text-[11px] text-slate-500">Select Professional, Concise, or Warm tone</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('interview')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">STAR Interview Preparation</div>
                  <div className="text-[11px] text-slate-500">Simulate technical questions & structured answers</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Singapore Labour Market Pulse Mini-Widget */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 mb-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Singapore Labour Market Focus</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Information & Communications sector saw <strong className="text-slate-900">+11.2% YoY growth</strong> in tech postings, with median gross salary at <strong className="text-slate-900">SGD $7,800/mo</strong>.
            </p>
            <div className="text-[11px] text-slate-500 mb-3">
              Source: MOM Singapore Labour Market Report Q2 2026.
            </div>
            <button
              onClick={() => setActiveTab('labour_market')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Explore Full Sector Demand Breakdown →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
