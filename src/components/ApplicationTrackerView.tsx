import React, { useState } from 'react';
import {
  Kanban,
  List,
  Building2,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplicationRecord, ApplicationStatus } from '../types';

export const ApplicationTrackerView: React.FC = () => {
  const { applications, updateApplicationStatus, updateApplicationNotes, setActiveTab } = useApp();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  const pipelineStages: ApplicationStatus[] = [
    'Saved',
    'Preparing',
    'Ready to Apply',
    'Applied',
    'Interview',
    'Offer',
    'Rejected',
    'Withdrawn'
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Kanban className="w-4 h-4" />
            <span>End-to-End Career Progression Tracker</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Application Pipeline & Status Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Monitor and advance your job submissions across 8 stages. Track specific resume versions, interview rounds, and notes.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3 overflow-x-auto pb-4">
          {pipelineStages.map((stage) => {
            const appsInStage = applications.filter((a) => a.status === stage);

            return (
              <div
                key={stage}
                className="bg-slate-50/80 rounded-xl border border-slate-200 p-3 flex flex-col min-w-[200px]"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800">{stage}</span>
                  <span className="text-[10px] font-semibold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                    {appsInStage.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  {appsInStage.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="bg-white p-3 rounded-lg border border-slate-200 hover:border-indigo-400 shadow-xs cursor-pointer transition-colors"
                    >
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                        {app.company}
                      </div>
                      <div className="text-xs font-bold text-slate-900 leading-snug mb-2">
                        {app.jobTitle}
                      </div>

                      <div className="text-[10px] text-slate-500 space-y-0.5">
                        <div>Doc: {app.resumeVersionName}</div>
                        {app.interviewDate && (
                          <div className="text-indigo-700 font-semibold">
                            Interview: {app.interviewDate}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <select
                          value={app.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                          className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 cursor-pointer"
                        >
                          {pipelineStages.map((s) => (
                            <option key={s} value={s}>
                              Move to: {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {appsInStage.length === 0 && (
                    <div className="p-4 text-center text-[11px] text-slate-400">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Source & Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Document Version</th>
                  <th className="py-3 px-4">Date Tracked</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{app.jobTitle}</div>
                      <div className="text-slate-500 text-[11px]">{app.company} · {app.location}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{app.source}</div>
                      <div className="text-slate-500 text-[11px]">{app.salarySGD || 'Not specified'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-800 cursor-pointer"
                      >
                        {pipelineStages.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {app.resumeVersionName}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {app.dateAdded}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                      >
                        Edit Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail / Notes Drawer Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-slate-500 uppercase font-bold">{selectedApp.company}</div>
                <h3 className="text-base font-bold text-slate-900">{selectedApp.jobTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Interview / Round Notes & Follow-up
              </label>
              <textarea
                rows={4}
                value={selectedApp.notes || ''}
                onChange={(e) => updateApplicationNotes(selectedApp.id, e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none"
                placeholder="Log interviewer names, follow-up dates, technical take-home specs..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
