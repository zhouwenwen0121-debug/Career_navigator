import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Building2,
  Brain,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const InterviewPrepView: React.FC = () => {
  const {
    jobs,
    profile,
    activeResume,
    selectedJobForInterview,
    showNotification
  } = useApp();

  const [selectedJobId, setSelectedJobId] = useState<string>(
    selectedJobForInterview?.id || (jobs[0]?.id ?? '')
  );

  const [prepData, setPrepData] = useState<{
    technicalQuestions: { question: string; keyEvaluationPoints: string[]; suggestedApproach: string }[];
    behavioralQuestions: { question: string; competency: string; starPrompt: { situation: string; task: string; action: string; result: string } }[];
    roleSpecificTips: string[];
    questionsForInterviewer: string[];
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'tech' | 'behavioral' | 'tips'>('tech');

  const targetJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  useEffect(() => {
    if (selectedJobForInterview) {
      setSelectedJobId(selectedJobForInterview.id);
    }
  }, [selectedJobForInterview]);

  const handleGeneratePrep = async () => {
    if (!targetJob) return;
    try {
      setLoading(true);
      const res = await api.prepareInterview(
        {
          currentTitle: profile.currentTitle,
          skills: activeResume.skills,
          experiences: activeResume.experiences,
        },
        targetJob
      );
      setPrepData(res);
      showNotification(`Interview preparation generated for ${targetJob.company}.`);
    } catch (err) {
      console.error('Interview prep error:', err);
      showNotification('Failed to generate interview prep materials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Singapore Technical & Behavioral Simulator</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Role-Specific Interview Readiness
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Prepare for Singapore enterprise and tech interviews with role-specific technical evaluation questions, behavioral STAR frameworks, and high-impact questions to ask hiring managers.
        </p>
      </div>

      {/* Target Job Selection */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Select Target Job for Interview Simulator:
        </label>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <select
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setPrepData(null);
            }}
            className="w-full sm:flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} · {j.company} ({j.industry})
              </option>
            ))}
          </select>

          <button
            onClick={handleGeneratePrep}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{loading ? 'Simulating Questions...' : 'Generate Interview Plan'}</span>
          </button>
        </div>
      </div>

      {/* Results View */}
      {prepData && (
        <div className="space-y-6 animate-in fade-in-50">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg max-w-md">
            <button
              onClick={() => setActiveTabSection('tech')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
                activeTabSection === 'tech' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Technical Evaluation ({prepData.technicalQuestions.length})
            </button>
            <button
              onClick={() => setActiveTabSection('behavioral')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
                activeTabSection === 'behavioral' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Behavioral & STAR ({prepData.behavioralQuestions.length})
            </button>
            <button
              onClick={() => setActiveTabSection('tips')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
                activeTabSection === 'tips' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Culture & Questions
            </button>
          </div>

          {/* Section 1: Technical Questions */}
          {activeTabSection === 'tech' && (
            <div className="space-y-4">
              {prepData.technicalQuestions.map((q, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      Q{idx + 1}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <div className="font-semibold text-slate-700">What interviewers evaluate:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {q.keyEvaluationPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900">Recommended Structuring: </strong>
                    {q.suggestedApproach}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Section 2: Behavioral STAR Questions */}
          {activeTabSection === 'behavioral' && (
            <div className="space-y-4">
              {prepData.behavioralQuestions.map((b, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        B{idx + 1}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">
                        {b.question}
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                      {b.competency}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs pt-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900 mb-1">S · Situation</div>
                      <div className="text-slate-600 text-[11px] leading-relaxed">{b.starPrompt.situation}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900 mb-1">T · Task</div>
                      <div className="text-slate-600 text-[11px] leading-relaxed">{b.starPrompt.task}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900 mb-1">A · Action</div>
                      <div className="text-slate-600 text-[11px] leading-relaxed">{b.starPrompt.action}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900 mb-1">R · Result</div>
                      <div className="text-slate-600 text-[11px] leading-relaxed">{b.starPrompt.result}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Section 3: Role Tips & Reverse Questions */}
          {activeTabSection === 'tips' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Singapore Enterprise & Cultural Nuances
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {prepData.roleSpecificTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Impactful Questions to Ask Your Interviewer
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {prepData.questionsForInterviewer.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">?</span>
                      <span className="leading-relaxed">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
