import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { McpCapabilityItem } from '../types';
import { api } from '../services/api';

export const McpCapabilityExplorer: React.FC = () => {
  const [matrix, setMatrix] = useState<McpCapabilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMcp, setSelectedMcp] = useState<McpCapabilityItem | null>(null);

  const fetchMatrix = async () => {
    try {
      setLoading(true);
      const res = await api.getMcpStatus();
      setMatrix(res);
      if (res.length > 0 && !selectedMcp) {
        setSelectedMcp(res[0]);
      }
    } catch (err) {
      console.error('Failed to load MCP matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatrix();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>Extensible MCP & Data Provider Abstraction Layer</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            MCP Integration & Capability Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Inspection matrix of all 12 MCP services and data adapters. The application abstracts providers so new MCP servers can be added or updated without rebuilding the frontend architecture.
          </p>
        </div>

        <button
          onClick={fetchMatrix}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh MCP Status</span>
        </button>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Provider Decoupling</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Frontend consumes unified services (<code>JobSearchService</code>, <code>SkillAnalysisService</code>) rather than vendor-specific endpoints.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Anti-Fabrication Guardrail</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Unavailable endpoints report <code>"Not available"</code> rather than synthesizing simulated statistics or unverified vacancies.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-purple-600" />
            <span>Guarded Write Submissions</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            High-impact tools like <code>JobGPT AutoApply</code> require mandatory explicit candidate authorization before dispatch.
          </p>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">MCP / Server</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Underlying Tool</th>
                <th className="py-3 px-4">Application Feature</th>
                <th className="py-3 px-4">Read/Write</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedMcp(item)}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                    selectedMcp?.id === item.id ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {item.mcpName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {item.toolMethod}
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    {item.applicationFeature}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.readWrite === 'Guarded Write'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.readWrite === 'Read/Write'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.readWrite}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1 font-medium text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono">
                    {item.latencyMs}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected MCP Inspector Detail */}
      {selectedMcp && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                MCP Capability Inspector: {selectedMcp.mcpName}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedMcp.capability}
              </h3>
            </div>
            <div className="text-xs text-slate-500">
              Verified: {new Date(selectedMcp.lastChecked).toLocaleString()}
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {selectedMcp.notes}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-900 mb-2">Input Schema Requirements:</div>
              <pre className="font-mono text-[11px] text-slate-700 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(selectedMcp.inputsSchema, null, 2)}
              </pre>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-900 mb-2">Output Schema Delivery:</div>
              <pre className="font-mono text-[11px] text-slate-700 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(selectedMcp.outputsSchema, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
