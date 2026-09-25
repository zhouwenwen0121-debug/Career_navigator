import React from 'react';
import {
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  Bookmark,
  Sparkles,
  ExternalLink,
  Wand2,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Job, JobMatch } from '../types';
import { useApp } from '../context/AppContext';

interface JobCardProps {
  job: Job;
  match?: JobMatch;
  isSaved?: boolean;
  onViewDetail?: () => void;
  onAnalyzeMatch?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  match,
  isSaved = false,
  onViewDetail,
  onAnalyzeMatch,
}) => {
  const {
    toggleSaveJob,
    setSelectedJobForTailoring,
    setActiveTab,
    startAutoApply,
    setSelectedJobForDetail
  } = useApp();

  const handleTailor = () => {
    setSelectedJobForTailoring(job);
    setActiveTab('tailor');
  };

  const handleApply = () => {
    startAutoApply(job);
  };

  const handleView = () => {
    if (onViewDetail) {
      onViewDetail();
    } else {
      setSelectedJobForDetail(job);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between">
      <div>
        {/* Top Header: Company, Source & Save */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{job.company}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">{job.source}</span>
            </div>
            <h3
              onClick={handleView}
              className="text-base font-semibold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer leading-snug"
            >
              {job.title}
            </h3>
          </div>

          <button
            onClick={() => toggleSaveJob(job.id)}
            aria-label={isSaved ? 'Remove from saved' : 'Save job'}
            className={`p-2 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        {/* Metadata Line: Zero-pill typography with separators */}
        <div className="flex flex-wrap items-center gap-y-1 text-xs text-slate-600 mb-3">
          <span className="flex items-center gap-1 font-medium text-slate-900">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            SGD ${job.minSalarySGD.toLocaleString()} - ${job.maxSalarySGD.toLocaleString()}/mo
          </span>
          <span className="mx-2 text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location} ({job.workMode})
          </span>
          <span className="mx-2 text-slate-300">·</span>
          <span>{job.experienceLevel}</span>
          <span className="mx-2 text-slate-300">·</span>
          <span className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Posted {job.datePosted}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {job.description}
        </p>

        {/* Match Explanation Box (Transparent & Explainable AI) */}
        {match && (
          <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Explainable Fit Assessment</span>
              </div>
              <span className="text-xs font-bold text-indigo-700">
                {match.matchScore}% Alignment
              </span>
            </div>
            <p className="text-xs text-slate-700 mb-2 leading-relaxed">
              {match.explanation}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {match.matchingSkills.length} Matching Skills Demonstrated
              </span>
              {match.missingSkills.length > 0 && (
                <span className="flex items-center gap-1 text-amber-700">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  {match.missingSkills.length} Skills for Targeted Upskilling
                </span>
              )}
            </div>
          </div>
        )}

        {/* Required Skills list */}
        <div className="flex flex-wrap items-center gap-1 mb-4 text-xs text-slate-500">
          <span className="font-medium text-slate-700 mr-1">Skills:</span>
          {job.requiredSkills.slice(0, 5).map((skill, idx) => (
            <span key={skill} className="text-slate-600">
              {skill}
              {idx < Math.min(job.requiredSkills.length, 5) - 1 ? ',' : ''}
            </span>
          ))}
          {job.requiredSkills.length > 5 && (
            <span className="text-slate-400">+{job.requiredSkills.length - 5} more</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleView}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Job</span>
          </button>
          {onAnalyzeMatch && (
            <button
              onClick={onAnalyzeMatch}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Match</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTailor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Tailor Resume</span>
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-indigo-400" />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
};
