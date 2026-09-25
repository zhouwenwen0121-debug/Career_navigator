import React, { useState } from 'react';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Building,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JobCard } from './JobCard';
import { JobDetailModal } from './JobDetailModal';
import { Job } from '../types';

export const JobSearchView: React.FC = () => {
  const { jobs, savedJobIds, selectedJobForDetail, setSelectedJobForDetail } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedExpLevel, setSelectedExpLevel] = useState('All');
  const [minSalaryFilter, setMinSalaryFilter] = useState(0);

  const industries = [
    'All',
    'Information & Communications',
    'Financial Services',
    'Healthcare & Biomedical',
    'Professional Services',
    'Wholesale Trade & Logistics',
  ];

  const workModes = ['All', 'Hybrid', 'Remote', 'On-site'];
  const sources = ['All', 'Indeed', 'Glassdoor', 'Google Jobs', 'Laddro'];
  const expLevels = ['All', 'Entry-level', 'Mid-level', 'Senior'];

  // Filter jobs client-side with full instant responsiveness
  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(q));

    const matchesIndustry = selectedIndustry === 'All' || job.industry.includes(selectedIndustry);
    const matchesWorkMode = selectedWorkMode === 'All' || job.workMode === selectedWorkMode;
    const matchesSource = selectedSource === 'All' || job.source === selectedSource;
    const matchesExp = selectedExpLevel === 'All' || job.experienceLevel === selectedExpLevel;
    const matchesSalary = minSalaryFilter === 0 || job.maxSalarySGD >= minSalaryFilter;

    return (
      matchesQuery &&
      matchesIndustry &&
      matchesWorkMode &&
      matchesSource &&
      matchesExp &&
      matchesSalary
    );
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All');
    setSelectedWorkMode('All');
    setSelectedSource('All');
    setSelectedExpLevel('All');
    setMinSalaryFilter(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <Briefcase className="w-4 h-4" />
          <span>Unified Aggregated Job Search</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Explore Singapore & Regional Opportunities
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Search across Indeed, Glassdoor, Google Jobs, and Laddro in one normalized format. Compare verified salaries in SGD, work flexibility, and technical expectations.
        </p>

        {/* Search Bar */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, company, or skills (e.g. React, Python, Cloud, DBS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors"
            />
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Filter Bar: Functional Button Selectors (Zero-pill compliant) */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
          {/* Industry Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Industry:</span>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Work Mode:</span>
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              {workModes.map((wm) => (
                <option key={wm} value={wm}>
                  {wm}
                </option>
              ))}
            </select>
          </div>

          {/* Source Provider Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Provider:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Level:</span>
            <select
              value={selectedExpLevel}
              onChange={(e) => setSelectedExpLevel(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              {expLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Min Salary Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider">Min Salary:</span>
            <select
              value={minSalaryFilter}
              onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value={0}>Any</option>
              <option value={5000}>SGD $5,000+/mo</option>
              <option value={7000}>SGD $7,000+/mo</option>
              <option value={9000}>SGD $9,000+/mo</option>
              <option value={12000}>SGD $12,000+/mo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Feedback */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredJobs.length}</strong> verified opportunities in Singapore
        </span>
        <span>Normalized internal schema</span>
      </div>

      {/* Job Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              onViewDetail={() => setSelectedJobForDetail(job)}
            />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
            No job opportunities match your active filter criteria. Try expanding your search terms or lowering the minimum salary.
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJobForDetail && (
        <JobDetailModal
          job={selectedJobForDetail}
          onClose={() => setSelectedJobForDetail(null)}
        />
      )}
    </div>
  );
};
