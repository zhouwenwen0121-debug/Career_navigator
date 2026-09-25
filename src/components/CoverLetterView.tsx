import React, { useState, useEffect } from 'react';
import {
  Mail,
  Sparkles,
  Copy,
  Check,
  Send,
  Building2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const CoverLetterView: React.FC = () => {
  const {
    jobs,
    profile,
    activeResume,
    selectedJobForCoverLetter,
    showNotification,
    startAutoApply
  } = useApp();

  const [selectedJobId, setSelectedJobId] = useState<string>(
    selectedJobForCoverLetter?.id || (jobs[0]?.id ?? '')
  );
  const [tone, setTone] = useState<'Professional' | 'Concise' | 'Confident' | 'Warm'>('Professional');
  const [coverLetterData, setCoverLetterData] = useState<{
    subjectLine: string;
    greeting: string;
    openingParagraph: string;
    bodyParagraphs: string[];
    closingParagraph: string;
    fullLetterText: string;
  } | null>(null);

  const [editableLetter, setEditableLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const targetJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  useEffect(() => {
    if (selectedJobForCoverLetter) {
      setSelectedJobId(selectedJobForCoverLetter.id);
    }
  }, [selectedJobForCoverLetter]);

  const handleGenerate = async () => {
    if (!targetJob) return;
    try {
      setLoading(true);
      const res = await api.generateCoverLetter(
        {
          name: profile.name,
          currentTitle: profile.currentTitle,
          skills: activeResume.skills,
          experiences: activeResume.experiences,
        },
        targetJob,
        tone
      );
      setCoverLetterData(res);
      setEditableLetter(res.fullLetterText);
      showNotification(`Cover letter generated with ${tone} tone.`);
    } catch (err) {
      console.error('Cover letter generation error:', err);
      showNotification('Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableLetter);
    setCopied(true);
    showNotification('Cover letter copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <Mail className="w-4 h-4" />
          <span>StoryLenses & Laddro Career Adapter</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Targeted Cover Letter Generator
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Craft high-impact, employer-specific cover letters strictly grounded in your genuine career highlights. Select your preferred tone and edit directly in the workspace.
        </p>
      </div>

      {/* Controls: Target Job & Tone Selection */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Opportunity
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} · {j.company} ({j.source})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Communication Tone
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-lg">
              {(['Professional', 'Concise', 'Confident', 'Warm'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
                    tone === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{loading ? 'Crafting Cover Letter...' : `Generate ${tone} Letter`}</span>
          </button>
        </div>
      </div>

      {/* Editor & Actions */}
      {editableLetter && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Generated Document · {targetJob?.company}
              </div>
              <div className="text-[11px] text-slate-500">
                You can directly edit any paragraph before submitting.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>

              {targetJob && (
                <button
                  onClick={() => startAutoApply(targetJob)}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Attach to Application</span>
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={14}
            value={editableLetter}
            onChange={(e) => setEditableLetter(e.target.value)}
            className="w-full p-4 text-xs font-mono bg-slate-50/50 border border-slate-200 rounded-lg leading-relaxed text-slate-800 focus:bg-white focus:outline-none"
          />

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Zero invented statistics: Every reference reflects your verified resume achievements.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
