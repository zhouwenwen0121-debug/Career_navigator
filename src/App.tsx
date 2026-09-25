/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { TopMatchesView } from './components/TopMatchesView';
import { JobSearchView } from './components/JobSearchView';
import { ResumeStudioView } from './components/ResumeStudioView';
import { SkillAnalysisView } from './components/SkillAnalysisView';
import { ResumeTailorView } from './components/ResumeTailorView';
import { CoverLetterView } from './components/CoverLetterView';
import { InterviewPrepView } from './components/InterviewPrepView';
import { LabourMarketView } from './components/LabourMarketView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { CareerNavigatorChat } from './components/CareerNavigatorChat';
import { RealMcpHub } from './components/RealMcpHub';
import { SafeAutoApplyModal } from './components/SafeAutoApplyModal';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, autoApplyModalOpen, setAutoApplyModalOpen, autoApplyJob, notification } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Top Header & Navigation */}
      <Navigation />

      {/* Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'top_matches' && <TopMatchesView />}
        {activeTab === 'jobs' && <JobSearchView />}
        {activeTab === 'navigator' && <CareerNavigatorChat />}
        {activeTab === 'resume' && <ResumeStudioView />}
        {activeTab === 'skills' && <SkillAnalysisView />}
        {activeTab === 'tailor' && <ResumeTailorView />}
        {activeTab === 'cover_letter' && <CoverLetterView />}
        {activeTab === 'interview' && <InterviewPrepView />}
        {activeTab === 'labour_market' && <LabourMarketView />}
        {activeTab === 'tracker' && <ApplicationTrackerView />}
        {activeTab === 'mcp_hub' && <RealMcpHub />}
      </main>

      {/* Guarded Auto-Apply Confirmation Modal */}
      <SafeAutoApplyModal
        job={autoApplyJob}
        isOpen={autoApplyModalOpen}
        onClose={() => setAutoApplyModalOpen(false)}
      />

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">AI Career Navigator</span>
            <span>·</span>
            <span>Singapore Skills Framework & MOM Labour Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Zero Hallucination Guaranteed</span>
            <span>·</span>
            <span>Transparent Explainable Matching</span>
            <span>·</span>
            <span>Guarded Auto-Apply</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
