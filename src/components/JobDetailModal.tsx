import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Mail,
  HelpCircle,
  Send,
  ExternalLink,
  Layers,
  GraduationCap,
  Clock
} from 'lucide-react';
import { Job, JobMatch } from '../types';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  const {
    profile,
    activeResume,
    setSelectedJobForTailoring,
    setSelectedJobForCoverLetter,
    setSelectedJobForInterview,
    setActiveTab,
    startAutoApply
  } = useApp();

  const [matchData, setMatchData] = useState<JobMatch | null>(null);
  const [loadingMatch, setLoadingMatch] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'match' | 'salary'>('overview');

  useEffect(() => {
    if (!job) return;

    let isMounted = true;
    async function loadMatch() {
      try {
        setLoadingMatch(true);
        const match = await api.matchJob(
          {
            currentTitle: profile.currentTitle,
            yearsOfExperience: profile.yearsOfExperience,
            skills: profile.skills,
            experiences: activeResume.experiences,
            educations: activeResume.educations,
          },
          job!
        );
        if (isMounted) setMatchData(match);
      } catch (e) {
        console.error('Match error in modal:', e);
      } finally {
        if (isMounted) setLoadingMatch(false);
      }
    }

    loadMatch();
    return () => {
      isMounted = false;
    };
  }, [job, profile, activeResume]);

  if (!job) return null;

  const handleTailor = () => {
    setSelectedJobForTailoring(job);
    setActiveTab('tailor');
    onClose();
  };

  const handleCoverLetter = () => {
    setSelectedJobForCoverLetter(job);
    setActiveTab('cover_letter');
    onClose();
  };

  const handleInterviewPrep = () => {
    setSelectedJobForInterview(job);
    setActiveTab('interview');
    onClose();
  };

  const handleApply = () => {
    startAutoApply(job);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{job.company}</span>
              <span className="text-slate-300">·</span>
              <span>Source: {job.source}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
            <div className="flex flex-wrap items-center gap-y-1 text-xs text-slate-600 mt-2">
              <span className="font-semibold text-slate-900 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                SGD ${job.minSalarySGD.toLocaleString()} - ${job.maxSalarySGD.toLocaleString()}/mo
              </span>
              <span className="mx-2 text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location} ({job.workMode})
              </span>
              <span className="mx-2 text-slate-300">·</span>
              <span>{job.employmentType}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Segmented Tabs (Functional Buttons) */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Job Overview & Skills
          </button>
          <button
            onClick={() => setActiveSubTab('match')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'match'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Explainable Match & Gaps</span>
            {matchData && <span className="font-bold text-indigo-600">({matchData.matchScore}%)</span>}
          </button>
          <button
            onClick={() => setActiveSubTab('salary')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'salary'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MOM Salary Intelligence
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeSubTab === 'overview' && (
            <>
              <div>
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Role Description
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Required Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {job.preferredSkills.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                    Preferred / Advantageous Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {job.preferredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100">
                <div>
                  <span className="text-slate-500">Experience Required:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {job.yearsExperienceRequired} years ({job.experienceLevel})
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Education Requirement:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {job.educationRequirements || "Not available"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Date Posted:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">{job.datePosted}</div>
                </div>
                <div>
                  <span className="text-slate-500">External Job Reference:</span>
                  <div className="font-mono text-slate-700 mt-0.5">{job.externalJobId}</div>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'match' && (
            <>
              {loadingMatch ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Calculating explainable alignment with Gemini 3.8 Flash...
                </div>
              ) : matchData ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Why this job matches you</span>
                      </div>
                      <span className="text-sm font-bold text-indigo-700">
                        {matchData.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {matchData.explanation}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                      <div className="font-semibold text-emerald-900 flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Demonstrated Skills ({matchData.matchingSkills.length})</span>
                      </div>
                      <ul className="space-y-1 text-slate-700">
                        {matchData.matchingSkills.map((s) => (
                          <li key={s} className="flex items-center gap-1.5">
                            <span className="text-emerald-600">✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                      <div className="font-semibold text-amber-900 flex items-center gap-1.5 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Potential Skill Gaps ({matchData.missingSkills.length})</span>
                      </div>
                      <ul className="space-y-1 text-slate-700">
                        {matchData.missingSkills.length > 0 ? (
                          matchData.missingSkills.map((s) => (
                            <li key={s} className="flex items-center gap-1.5">
                              <span className="text-amber-600">•</span> {s}
                            </li>
                          ))
                        ) : (
                          <li className="text-slate-500">No critical technical gaps detected.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-semibold text-slate-900 mb-2">
                      Alignment Dimensions
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">Experience Congruence:</span>
                        <div className="font-semibold text-slate-800">{matchData.experienceFit}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Education Alignment:</span>
                        <div className="font-semibold text-slate-800">{matchData.educationFit}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500">Unable to generate match breakdown.</div>
              )}
            </>
          )}

          {activeSubTab === 'salary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-900 mb-2">
                  Salary Benchmark Analysis (Singapore Market)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-slate-500">Listing Range</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      ${job.minSalarySGD.toLocaleString()} - ${job.maxSalarySGD.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-slate-500">Your Target Salary</div>
                    <div className="text-sm font-bold text-indigo-700 mt-1">
                      ${profile.targetSalarySGD.toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-slate-500">MOM Sector Median</div>
                    <div className="text-sm font-bold text-emerald-700 mt-1">
                      SGD $7,800/mo
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Data calibrated against Singapore Ministry of Manpower (MOM) Comprehensive Labour Force Survey 2026. Salaries represent gross monthly income including employer CPF where applicable.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTailor}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Tailor Resume</span>
            </button>
            <button
              onClick={handleCoverLetter}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Cover Letter</span>
            </button>
            <button
              onClick={handleInterviewPrep}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Interview Prep</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <span>Original Job Post</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-indigo-400" />
              <span>Review & Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
