import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Play,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Terminal,
  Database,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
  Zap,
  Globe,
  Radio,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const RealMcpHub: React.FC = () => {
  const { showNotification } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'tools' | 'resources' | 'prompts' | 'matrix' | 'external'>('tools');
  const [mcpSpec, setMcpSpec] = useState<any>(null);
  const [loadingSpec, setLoadingSpec] = useState(true);

  // Tool Runner state
  const [selectedTool, setSelectedTool] = useState<string>('benchmark_salary_sgd');
  const [toolArgsText, setToolArgsText] = useState<string>('{\n  "jobTitle": "Data Analyst",\n  "industry": "Financial Services"\n}');
  const [toolRunning, setToolRunning] = useState(false);
  const [rpcRequestLog, setRpcRequestLog] = useState<any>(null);
  const [rpcResponseLog, setRpcResponseLog] = useState<any>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);

  // Resource Explorer state
  const [selectedResourceUri, setSelectedResourceUri] = useState<string>('labour-market://singapore/mom-q2-2026');
  const [resourceContent, setResourceContent] = useState<any>(null);
  const [loadingResource, setLoadingResource] = useState(false);

  // External MCP Server state
  const [customServerUrl, setCustomServerUrl] = useState<string>('/api/mcp/rpc');
  const [externalPingStatus, setExternalPingStatus] = useState<string | null>(null);

  // Preset arguments for MCP tools
  const toolArgPresets: Record<string, any> = {
    benchmark_salary_sgd: {
      jobTitle: "Data Analyst",
      industry: "Financial Services"
    },
    search_singapore_jobs: {
      query: "React",
      industry: "Information & Communications",
      workMode: "Hybrid",
      minSalarySGD: 6000
    },
    get_mom_labour_indicators: {
      industry: "Information & Communications"
    },
    query_skills_framework: {
      skillQuery: "Python"
    },
    analyze_skill_gap: {
      candidateSkills: ["Python", "SQL", "Excel"],
      requiredSkills: ["Python", "SQL", "Tableau", "Power BI", "AWS"]
    },
    screen_resume_v1: {
      resumeText: "Alex Tan\nSoftware Engineer with 4 years experience in Singapore.\nSkills: TypeScript, React, Node.js, Docker, AWS.\nWorked at SingTel building operational dashboards."
    },
    tailor_candidate_resume: {
      jobId: "job-sg-001",
      masterResume: {
        experiences: [
          { company: "SingTel", role: "Software Engineer", highlights: ["Built web dashboard using React and Python."] }
        ]
      }
    },
    generate_star_interview_guide: {
      jobId: "job-sg-002",
      candidateProfile: {
        currentTitle: "Data Analyst",
        skills: ["SQL", "Python", "Tableau"]
      }
    },
    execute_guarded_autoapply: {
      jobId: "job-sg-001",
      candidateConsentToken: "VERIFIED_CONSENT_TOKEN_12345",
      applicantName: "Alex Tan"
    }
  };

  const loadSpec = async () => {
    try {
      setLoadingSpec(true);
      const spec = await api.getMcpSpec();
      setMcpSpec(spec);
    } catch (err) {
      console.error('Failed to load MCP spec:', err);
    } finally {
      setLoadingSpec(false);
    }
  };

  useEffect(() => {
    loadSpec();
  }, []);

  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName);
    const preset = toolArgPresets[toolName] || {};
    setToolArgsText(JSON.stringify(preset, null, 2));
    setRpcResponseLog(null);
    setExecutionTimeMs(null);
  };

  const handleExecuteTool = async () => {
    let parsedArgs: any = {};
    try {
      parsedArgs = JSON.parse(toolArgsText);
    } catch {
      showNotification('Invalid JSON in tool arguments');
      return;
    }

    const startTime = performance.now();
    setToolRunning(true);
    const reqPayload = {
      jsonrpc: '2.0',
      id: `mcp-${Date.now()}`,
      method: 'tools/call',
      params: {
        name: selectedTool,
        arguments: parsedArgs,
      },
    };
    setRpcRequestLog(reqPayload);

    try {
      const res = await api.sendMcpJsonRpc('tools/call', { name: selectedTool, arguments: parsedArgs }, customServerUrl);
      const duration = Math.round(performance.now() - startTime);
      setExecutionTimeMs(duration);
      setRpcResponseLog(res);
      showNotification(`MCP tool "${selectedTool}" executed in ${duration}ms`);
    } catch (err: any) {
      console.error('MCP tool call failed:', err);
      setExecutionTimeMs(Math.round(performance.now() - startTime));
      setRpcResponseLog({ error: err.message });
      showNotification(`MCP Execution Error: ${err.message}`);
    } finally {
      setToolRunning(false);
    }
  };

  const handleReadResource = async (uri: string) => {
    setSelectedResourceUri(uri);
    try {
      setLoadingResource(true);
      const res = await api.sendMcpJsonRpc('resources/read', { uri }, customServerUrl);
      if (res.contents?.[0]?.text) {
        try {
          setResourceContent(JSON.parse(res.contents[0].text));
        } catch {
          setResourceContent(res.contents[0].text);
        }
      } else {
        setResourceContent(res);
      }
    } catch (err: any) {
      console.error('Failed to read MCP resource:', err);
      setResourceContent({ error: err.message });
    } finally {
      setLoadingResource(false);
    }
  };

  const handlePingServer = async () => {
    try {
      setExternalPingStatus('Testing JSON-RPC connection...');
      const res = await api.sendMcpJsonRpc('initialize', {}, customServerUrl);
      setExternalPingStatus(`Connected to: ${res.serverInfo?.name || 'MCP Server'} (Protocol v${res.protocolVersion || '2024-11-05'})`);
      showNotification('MCP Server handshaked successfully!');
    } catch (err: any) {
      setExternalPingStatus(`Connection Failed: ${err.message}`);
      showNotification(`Ping error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Active Model Context Protocol (MCP) Server</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Live MCP Service & Protocol Inspector
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Direct JSON-RPC 2.0 communication over HTTP and Server-Sent Events (SSE). Conforms to official Model Context Protocol specifications (tools, resources, prompts).
          </p>
        </div>

        {/* Live Server Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Protocol Version</div>
            <div className="text-xs font-mono font-bold text-slate-800">2024-11-05</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-800">MCP Online</span>
          </div>
        </div>
      </div>

      {/* Connection & Endpoint Diagnostic Bar */}
      <div className="bg-slate-900 text-slate-300 rounded-xl p-4 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-indigo-400 font-bold">ENDPOINTS:</span>
          <span>POST <code className="text-white">/api/mcp/rpc</code> (Stateless JSON-RPC 2.0)</span>
          <span className="text-slate-600">|</span>
          <span>GET <code className="text-white">/api/mcp/sse</code> (SSE Transport)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Server: <strong className="text-white">ai-career-navigator-mcp v1.0.0</strong></span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg max-w-2xl overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('tools')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'tools' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Live Tools ({mcpSpec?.tools?.length || 9})</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('resources');
            if (!resourceContent) {
              handleReadResource(selectedResourceUri);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'resources' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Resources ({mcpSpec?.resources?.length || 4})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prompts')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'prompts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-purple-600" />
          <span>Prompts ({mcpSpec?.prompts?.length || 2})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('external')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
            activeSubTab === 'external' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-amber-600" />
          <span>Remote MCP Connector</span>
        </button>
      </div>

      {/* TAB 1: LIVE TOOLS EXECUTION RUNNER */}
      {activeSubTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tool Selector List (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Registered MCP Tools
            </div>
            <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
              {(mcpSpec?.tools || []).map((tool: any) => (
                <button
                  key={tool.name}
                  onClick={() => handleToolSelect(tool.name)}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedTool === tool.name
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-mono text-xs font-bold text-slate-900 mb-1">
                    {tool.name}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Tool Parameter Editor & Execution Inspector (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Tool Header & Trigger */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-bold text-indigo-700 font-mono">
                    tools/call → {selectedTool}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                    {mcpSpec?.tools?.find((t: any) => t.name === selectedTool)?.description}
                  </h3>
                </div>

                <button
                  onClick={handleExecuteTool}
                  disabled={toolRunning}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
                >
                  <Play className={`w-3.5 h-3.5 text-emerald-400 ${toolRunning ? 'animate-spin' : ''}`} />
                  <span>{toolRunning ? 'Executing Tool...' : 'Execute MCP Tool'}</span>
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs text-slate-600 font-medium">
                  <span>Input Arguments (JSON Schema Compliant):</span>
                  <span className="text-[11px] text-slate-400 font-mono">JSON-RPC params.arguments</span>
                </div>
                <textarea
                  rows={6}
                  value={toolArgsText}
                  onChange={(e) => setToolArgsText(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Execution Logs: JSON-RPC 2.0 Request and Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Request Inspector */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    <span>JSON-RPC 2.0 Request</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">HTTP POST</span>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg overflow-x-auto max-h-[350px]">
                  {rpcRequestLog
                    ? JSON.stringify(rpcRequestLog, null, 2)
                    : '// Execute a tool above to view live JSON-RPC request frame'}
                </pre>
              </div>

              {/* Response Inspector */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tool Output Result</span>
                  </span>
                  {executionTimeMs !== null && (
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">
                      {executionTimeMs}ms
                    </span>
                  )}
                </div>
                <pre className="p-3 bg-slate-50 border border-slate-200 text-slate-900 font-mono text-[11px] rounded-lg overflow-x-auto max-h-[350px]">
                  {rpcResponseLog
                    ? JSON.stringify(rpcResponseLog, null, 2)
                    : '// Awaiting tool execution output...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE RESOURCES EXPLORER */}
      {activeSubTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Available MCP Resources ({mcpSpec?.resources?.length || 4})
            </div>
            <div className="space-y-1.5">
              {(mcpSpec?.resources || []).map((res: any) => (
                <button
                  key={res.uri}
                  onClick={() => handleReadResource(res.uri)}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedResourceUri === res.uri
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-mono text-[11px] text-indigo-700 font-semibold mb-0.5 truncate">
                    {res.uri}
                  </div>
                  <div className="font-bold text-xs text-slate-900 mb-1">{res.name}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Resource URI</span>
                <div className="font-mono text-xs font-bold text-slate-900">{selectedResourceUri}</div>
              </div>
              <button
                onClick={() => handleReadResource(selectedResourceUri)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingResource ? 'animate-spin' : ''}`} />
                <span>Read Resource</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto max-h-[500px] leading-relaxed">
              {loadingResource
                ? '// Fetching resource content via resources/read...'
                : JSON.stringify(resourceContent, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: PROMPTS SPECIFICATION */}
      {activeSubTab === 'prompts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(mcpSpec?.prompts || []).map((prompt: any) => (
              <div key={prompt.name} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-700">prompts/{prompt.name}</span>
                  <span className="text-[10px] bg-purple-50 text-purple-800 font-semibold px-2 py-0.5 rounded">Prompt Template</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {prompt.description}
                </h3>
                <div className="text-xs text-slate-600">
                  <div className="font-semibold text-slate-700 mb-1">Required Arguments:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 font-mono">
                    {prompt.arguments.map((arg: any) => (
                      <li key={arg.name}>
                        {arg.name} <span className="text-slate-400">({arg.description})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REMOTE MCP SERVER CONNECTOR */}
      {activeSubTab === 'external' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Connect to External / Custom MCP Server</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Connect the Career Navigator to any external remote MCP server by URL. Supports JSON-RPC 2.0 initialize handshakes and tool discovery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={customServerUrl}
              onChange={(e) => setCustomServerUrl(e.target.value)}
              placeholder="e.g. /api/mcp/rpc or https://my-remote-mcp.internal/rpc"
              className="flex-1 p-2.5 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
            />
            <button
              onClick={handlePingServer}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors"
            >
              Test MCP Handshake
            </button>
          </div>

          {externalPingStatus && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800">
              {externalPingStatus}
            </div>
          )}

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900">How to connect external MCP clients (e.g. Claude Desktop, Cursor, AI Studio Build):</div>
            <p className="text-[11px] leading-relaxed">
              Add the following configuration to your client's <code>mcpServers</code> configuration file:
            </p>
            <pre className="p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg overflow-x-auto">
{`{
  "mcpServers": {
    "career-navigator": {
      "url": "http://localhost:3000/api/mcp/sse",
      "transport": "sse"
    }
  }
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
