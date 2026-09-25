import React, { useState, useEffect } from 'react';
import {
  Wand2,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Save,
  Printer,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Job, ResumeData } from '../types';
import { api } from '../services/api';

export const ResumeTailorView: React.FC = () => {
  const {
    jobs,
    activeResume,
    resumes,
    setResumes,
    selectedJobForTailoring,
    setSelectedJobForTailoring,
    showNotification
  } = useApp();

  const [selectedJobId, setSelectedJobId] = useState<string>(
    selectedJobForTailoring?.id || (jobs[0]?.id ?? '')
  );

  const [tailoringResult, setTailoringResult] = useState<{
    tailoredSummary: string;
    keyHighlights: string[];
    modifications: { company: string; role: string; originalBullet: string; tailoredBullet: string; rationale: string }[];
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');

  const targetJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  useEffect(() => {
    if (selectedJobForTailoring) {
      setSelectedJobId(selectedJobForTailoring.id);
    }
  }, [selectedJobForTailoring]);

  const handleStartTailoring = async () => {
    if (!targetJob) return;
    try {
      setLoading(true);
      const res = await api.tailorResume(activeResume, targetJob);
      setTailoringResult(res);
      setEditedSummary(res.tailoredSummary);
      showNotification(`Resume tailored for ${targetJob.company} (${targetJob.title}). Review diffs below.`);
    } catch (err) {
      console.error('Tailoring error:', err);
      showNotification('Failed to tailor resume');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsNewVersion = () => {
    if (!targetJob || !tailoringResult) return;

    const newVersion: ResumeData = {
      ...activeResume,
      id: `resume-tailored-${Date.now()}`,
      versionName: `Tailored - ${targetJob.company} (${targetJob.title})`,
      isMaster: false,
      summary: editedSummary,
      updatedAt: new Date().toISOString(),
    };

    setResumes((prev) => [newVersion, ...prev]);
    showNotification(`Saved version: "${newVersion.versionName}" in Resume Studio.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Wand2 className="w-4 h-4" />
            <span>Laddro Career & Precision Optimization</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Target Job Resume Tailoring
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Reorder and emphasize authentic achievements to address the target job description. Strict anti-fabrication rules ensure zero invented companies, dates, or credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tailoringResult && (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Preview</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Job Selection */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Select Target Opportunity to Align Against:
        </label>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setTailoringResult(null);
            }}
            className="w-full sm:flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} · {j.company} ({j.source})
              </option>
            ))}
          </select>

          <button
            onClick={handleStartTailoring}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{loading ? 'Analyzing & Tailoring...' : 'Analyze & Tailor'}</span>
          </button>
        </div>

        {targetJob && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-y-1 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">{targetJob.company}</span>
            <span className="mx-2 text-slate-300">·</span>
            <span>{targetJob.location}</span>
            <span className="mx-2 text-slate-300">·</span>
            <span className="text-slate-500">
              Required: {targetJob.requiredSkills.slice(0, 4).join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Tailoring Diff / Result View */}
      {tailoringResult && (
        <div className="space-y-6 animate-in fade-in-50">
          {/* Executive Summary Alignment */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Targeted Professional Summary
                </h3>
                <p className="text-xs text-slate-500">
                  Reframed to highlight authentic overlap with {targetJob?.company}'s requirements.
                </p>
              </div>
              <button
                onClick={handleSaveAsNewVersion}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save as Tailored Version</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg leading-relaxed focus:bg-white focus:outline-none"
            />
          </div>

          {/* Key Optimization Rationales */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
            <div className="font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Anti-Fabrication & Precision Guardrails</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
              {tailoringResult.keyHighlights.map((k, idx) => (
                <li key={idx}>{k}</li>
              ))}
            </ul>
          </div>

          {/* Bullet Point Modifications (Side-by-Side Diffs) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Side-by-Side Bullet Point Alignment ({tailoringResult.modifications.length})
            </h3>
            <p className="text-xs text-slate-500 -mt-2">
              Transparent before-and-after comparison showing how each genuine experience bullet was reorganized.
            </p>

            <div className="space-y-4">
              {tailoringResult.modifications.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>{mod.role} at {mod.company}</span>
                    <span className="text-[11px] font-normal text-indigo-700">{mod.rationale}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Master Resume Bullet
                      </div>
                      <p className="text-slate-700 leading-relaxed">{mod.originalBullet}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
                      <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                        Target-Aligned Bullet
                      </div>
                      <p className="text-emerald-950 font-medium leading-relaxed">{mod.tailoredBullet}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
