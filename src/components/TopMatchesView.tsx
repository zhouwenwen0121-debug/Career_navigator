import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Send,
  Eye,
  Bookmark,
  RefreshCw,
  HelpCircle,
  GraduationCap,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job, JobMatch } from '../types';

export const TopMatchesView: React.FC = () => {
  const {
    topMatches,
    calculateTopMatches,
    calculatingMatches,
    savedJobIds,
    toggleSaveJob,
    setSelectedJobForTailoring,
    setSelectedJobForDetail,
    startAutoApply,
    setActiveTab,
    profile
  } = useApp();

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const toggleExpand = (jobId: string) => {
    setExpandedJobId(prev => (prev === jobId ? null : jobId));
  };

  return (
    <div className="space-y-6">
      {/* Header and Recalculate */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Singapore & Regional Ranking Engine</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Top 10 Most Matched Jobs
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Algorithmic ranking grounded in your verified skills, years of experience, and Singapore Skills Framework benchmarks. Match assessments provide full explainability without black-box scores.
          </p>
        </div>

        <button
          onClick={calculateTopMatches}
          disabled={calculatingMatches}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${calculatingMatches ? 'animate-spin' : ''}`} />
          <span>{calculatingMatches ? 'Recalculating...' : 'Recalculate Matches'}</span>
        </button>
      </div>

      {/* Top 10 List */}
      <div className="space-y-4">
        {topMatches.map(({ job, match }, index) => {
          const isSaved = savedJobIds.includes(job.id);
          const isExpanded = expandedJobId === job.id;

          return (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all p-5 shadow-xs"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-800">{job.company}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{job.source}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{job.industry}</span>
                    </div>
                    <h2
                      onClick={() => setSelectedJobForDetail(job)}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      {job.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Alignment Score</div>
                    <div className="text-lg font-bold text-indigo-700">
                      {match.matchScore}%
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    aria-label="Save Job"
                    className={`p-2 rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Zero-Pill Metadata Line */}
              <div className="flex flex-wrap items-center text-xs text-slate-600 gap-y-1 mb-4">
                <span className="flex items-center gap-1 font-semibold text-slate-900">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  SGD ${job.minSalarySGD.toLocaleString()} - ${job.maxSalarySGD.toLocaleString()}/mo
                </span>
                <span className="mx-2 text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location} ({job.workMode})
                </span>
                <span className="mx-2 text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {job.yearsExperienceRequired} yrs req · Fit: {match.experienceFit}
                </span>
                <span className="mx-2 text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  Edu: {match.educationFit}
                </span>
              </div>

              {/* Explainable Match Highlight (Zero black box!) */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 mb-4">
                <div className="text-xs font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Why this job matches you:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {match.explanation}
                </p>

                {/* Demonstrated vs Missing Skills breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200/70 text-xs">
                  <div>
                    <div className="font-semibold text-emerald-800 flex items-center gap-1 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Demonstrated Matching Skills ({match.matchingSkills.length})</span>
                    </div>
                    <div className="text-slate-600">
                      {match.matchingSkills.join(', ') || 'No direct overlap'}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-amber-800 flex items-center gap-1 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Potential Skill Gaps to Bridge ({match.missingSkills.length})</span>
                    </div>
                    <div className="text-slate-600">
                      {match.missingSkills.join(', ') || 'None identified'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Full Description & Requirements */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 space-y-3 mb-4 animate-in fade-in-50">
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">Job Description & Responsibilities</div>
                    <p className="leading-relaxed whitespace-pre-line">{job.description}</p>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">Education Requirements</div>
                    <p className="text-slate-600">{job.educationRequirements}</p>
                  </div>
                  {match.strengthsSummary && match.strengthsSummary.length > 0 && (
                    <div>
                      <div className="font-semibold text-slate-900 mb-1">Candidate Strengths Assessment</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {match.strengthsSummary.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => toggleExpand(job.id)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  {isExpanded ? '▲ Hide Details' : '▼ Read Full Job Specification'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJobForDetail(job)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Deep Analysis</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedJobForTailoring(job);
                      setActiveTab('tailor');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Tailor Resume</span>
                  </button>

                  <button
                    onClick={() => startAutoApply(job)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Review & Apply</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
