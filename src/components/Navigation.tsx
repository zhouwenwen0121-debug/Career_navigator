import React from 'react';
import {
  Compass,
  Briefcase,
  Sparkles,
  FileText,
  Layers,
  Wand2,
  Mail,
  HelpCircle,
  TrendingUp,
  Kanban,
  MessageSquare,
  Cpu,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';
import { StakeholderPersona } from '../types';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, stakeholder, setStakeholder, profile, applications, savedJobIds } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'top_matches', label: 'Top 10 Matches', icon: Sparkles, count: 10 },
    { id: 'jobs', label: 'Job Search', icon: Briefcase },
    { id: 'navigator', label: 'Career Navigator', icon: MessageSquare },
    { id: 'resume', label: 'Resume Studio', icon: FileText },
    { id: 'skills', label: 'Skills & SSG', icon: Layers },
    { id: 'tailor', label: 'Resume Tailor', icon: Wand2 },
    { id: 'cover_letter', label: 'Cover Letter', icon: Mail },
    { id: 'interview', label: 'Interview Prep', icon: HelpCircle },
    { id: 'labour_market', label: 'Labour Market', icon: TrendingUp },
    { id: 'tracker', label: 'Applications', icon: Kanban, count: applications.length },
    { id: 'mcp_hub', label: 'MCP & Providers', icon: Cpu }
  ];

  const stakeholderLabels: Record<StakeholderPersona, string> = {
    job_seeker: 'Job Seeker',
    fresh_graduate: 'Fresh Graduate',
    retrenched_worker: 'Disrupted Worker (Pivot)',
    career_coach: 'Career Coach View',
    workforce_agency: 'Workforce & Labour Agency'
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      {/* Top Banner & Context Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Compass className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 tracking-tight text-base">
                  AI Career Navigator
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Singapore & Global
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Skills Framework · MOM Labour Intelligence · Explainable Matching
              </p>
            </div>
          </div>

          {/* Stakeholder Persona Lens & User Info */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
              <UserCheck className="w-4 h-4 text-slate-600" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Persona Lens</div>
                <select
                  value={stakeholder}
                  onChange={(e) => setStakeholder(e.target.value as StakeholderPersona)}
                  className="text-xs font-medium text-slate-800 bg-transparent border-none p-0 focus:ring-0 cursor-pointer pr-4"
                >
                  {Object.entries(stakeholderLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-200 text-right">
              <div>
                <div className="text-xs font-semibold text-slate-900">{profile.name}</div>
                <div className="text-[11px] text-slate-500">{profile.currentTitle}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-medium text-xs flex items-center justify-center">
                {profile.name.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Sub-Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-300' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-slate-800 text-indigo-300' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
