import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Compass,
  ArrowRight,
  TrendingUp,
  Briefcase,
  FileText,
  HelpCircle,
  Layers,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { api } from '../services/api';

export const CareerNavigatorChat: React.FC = () => {
  const { profile, activeResume, topMatches, jobs, setActiveTab } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Hello ${profile.name}! I am your AI Career Navigator, calibrated with the Singapore Skills Framework (SSG) and Ministry of Manpower (MOM) labour market datasets.\n\nI can help you evaluate matching job openings in Singapore, discover career pivots, bridge skill gaps with accredited SkillsFuture training, or formulate high-converting application assets. How can I guide your career journey today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Find jobs that match my experience in Singapore',
        'What skills am I missing for senior cloud/data roles?',
        'Which industry sectors have highest hiring demand?',
        'How can I pivot from engineering to product management?'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.chatNavigator(
        [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        {
          name: profile.name,
          currentTitle: profile.currentTitle,
          yearsOfExperience: profile.yearsOfExperience,
          targetSalarySGD: profile.targetSalarySGD,
          skills: activeResume.skills,
        },
        {
          matchedJobsCount: topMatches.length,
          topMatchTitles: topMatches.slice(0, 3).map((m) => `${m.job.title} at ${m.job.company}`),
        }
      );

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions || [
          'View Top 10 Matched Jobs',
          'Explore SkillsFuture Courses',
          'Tailor Master Resume'
        ]
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'I encountered an error retrieving data. Please check your network connection or server status.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action.includes('View Top') || action.includes('Top 10')) {
      setActiveTab('top_matches');
    } else if (action.includes('Tailor')) {
      setActiveTab('tailor');
    } else if (action.includes('SkillsFuture') || action.includes('Skill Gap')) {
      setActiveTab('skills');
    } else if (action.includes('MOM') || action.includes('Labour')) {
      setActiveTab('labour_market');
    } else {
      handleSend(action);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[750px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>AI Career Navigator</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.2 rounded-full">
                Gemini 3.8 Flash Engine
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Singapore Skills Framework & MOM Grounded
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'msg-reset',
                role: 'assistant',
                content: `Chat session refreshed. How can I help with your Singapore career strategy today?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                suggestedActions: [
                  'Find jobs that match my experience in Singapore',
                  'What skills am I missing?',
                  'Check Singapore MOM Wage Benchmarks'
                ]
              }
            ]);
          }}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white rounded-br-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-xs'
              }`}
            >
              <div className="whitespace-pre-line">{msg.content}</div>

              {/* Action Suggestions (for assistant) */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(action)}
                      className="text-[11px] font-medium bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      {action} →
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.role === 'user' ? 'You' : 'Navigator'} · {msg.timestamp}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Sparkles className="w-4 h-4 animate-spin text-indigo-500" />
            <span>Consulting Singapore job and skills intelligence...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything: 'What roles can I move into from my current role?', 'Show tech salary in SG'..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-indigo-400" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
