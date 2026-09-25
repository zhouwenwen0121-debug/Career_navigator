import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  Building,
  Users,
  DollarSign,
  AlertCircle,
  Award,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { LabourMarketOverview, IndustryTrend } from '../types';
import { api } from '../services/api';

export const LabourMarketView: React.FC = () => {
  const [data, setData] = useState<LabourMarketOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('ind-infocomm');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getLabourMarketInsights();
        setData(res);
      } catch (err) {
        console.error('Failed to load labour market data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading Singapore Ministry of Manpower & SSG labour market datasets...
      </div>
    );
  }

  const selectedIndustry =
    data.industries.find((i) => i.id === selectedIndustryId) || data.industries[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Singapore Ministry of Manpower & SSG Labour Intelligence</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Labour Market & Industry Demand Trends
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Official Singapore workforce indicators, sector hiring demand indices, wage benchmarks, and emerging skills taxonomy. Calibrated from MOM Labour Market Survey and SkillsFuture frameworks.
        </p>

        {/* Source Citation Watermark */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
          <span>Authority: <strong>{data.reportingAuthority}</strong></span>
          <span>·</span>
          <span>Period: <strong>{data.surveyPeriod}</strong></span>
          <span>·</span>
          <span>Geography: <strong>Singapore</strong></span>
        </div>
      </div>

      {/* National Workforce Headline Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Overall Unemployment Rate</div>
          <div className="text-2xl font-bold text-slate-900">{data.overallUnemploymentRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Resident Rate: {data.residentUnemploymentRate}%</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Total National Job Vacancies</div>
          <div className="text-2xl font-bold text-indigo-700">{data.totalJobVacancies.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Quarterly change: +2.4%</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Job Vacancy-to-Unemployed Ratio</div>
          <div className="text-2xl font-bold text-emerald-600">{data.overallVacancyRatio}</div>
          <div className="text-[11px] text-slate-500 mt-1">&gt; 1.0 indicates job-seeker market</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 mb-1">Retrenchment per 1,000 Employees</div>
          <div className="text-2xl font-bold text-slate-900">{data.retrenchmentPerThousand}</div>
          <div className="text-[11px] text-slate-500 mt-1">Below historical average</div>
        </div>
      </div>

      {/* Featured Feature from Business Plan: Job Demand Trend by Industry Sectors */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Job Demand Trend by Industry Sectors</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an industry sector to inspect quarterly demand growth, wage percentiles, and top in-demand skills.
            </p>
          </div>

          <select
            value={selectedIndustryId}
            onChange={(e) => setSelectedIndustryId(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
          >
            {data.industries.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.industry} ({ind.jobDemandTrend})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Industry Spotlight */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Industry Focus
              </div>
              <h3 className="text-lg font-bold text-slate-900">{selectedIndustry.industry}</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] text-slate-500">Demand Trend</div>
                <div className="text-xs font-bold text-emerald-700">
                  {selectedIndustry.jobDemandTrend} ({selectedIndustry.demandGrowthYoY > 0 ? '+' : ''}{selectedIndustry.demandGrowthYoY}% YoY)
                </div>
              </div>
              <div className="text-right pl-3 border-l border-slate-200">
                <div className="text-[11px] text-slate-500">Sector Vacancy Ratio</div>
                <div className="text-xs font-bold text-indigo-700">{selectedIndustry.vacancyRatio} vacancies / person</div>
              </div>
            </div>
          </div>

          {/* Quarterly Trend Visual Bar Representation */}
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Quarterly Demand Index (Baseline: 100 = 2023)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
              {selectedIndustry.quarterlyTrends.map((q) => (
                <div key={q.quarter} className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium mb-1">{q.quarter}</div>
                  <div className="text-sm font-bold text-slate-900">{q.demandIndex}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{q.vacancies.toLocaleString()} vacancies</div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Benchmarks (25th, Median, 75th percentile in SGD) */}
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Sector Salary Distribution (Gross Monthly Income in SGD)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">25th Percentile</div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  SGD ${selectedIndustry.p25SalarySGD.toLocaleString()}/mo
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">Median Gross Income</div>
                <div className="text-base font-bold text-emerald-700 mt-1">
                  SGD ${selectedIndustry.medianSalarySGD.toLocaleString()}/mo
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">75th Percentile</div>
                <div className="text-base font-bold text-indigo-700 mt-1">
                  SGD ${selectedIndustry.p75SalarySGD.toLocaleString()}/mo
                </div>
              </div>
            </div>
          </div>

          {/* Top In-Demand Roles & Emerging Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-900 mb-2">
                Top Occupations Requested by Employers
              </div>
              <ul className="space-y-1 text-slate-700">
                {selectedIndustry.topInDemandRoles.map((role, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-900 mb-2">
                Fastest-Growing Emerging Competencies
              </div>
              <ul className="space-y-1 text-slate-700">
                {selectedIndustry.emergingSkills.map((skill, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strict Chart Citation */}
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
            Source: {selectedIndustry.sourceCitation} · Date: {selectedIndustry.sourceDate} · Geography: {selectedIndustry.geography}
          </div>
        </div>
      </div>

      {/* Emerging Occupations 2026 Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Emerging Singapore Job Roles (Skills Framework Forecast)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Forward-looking occupational profiles projected by SkillsFuture Singapore and EDB.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.emergingOccupations2026.map((occ, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{occ.title}</h3>
                  <div className="text-[11px] text-slate-500">{occ.industry}</div>
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                  {occ.growthProjection}
                </span>
              </div>

              <div className="text-xs text-slate-700">
                <span className="text-slate-500">Critical Skills: </span>
                {occ.criticalSkills.join(', ')}
              </div>

              <div className="text-[10px] font-mono text-slate-400">
                {occ.skillsFrameworkRef}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
