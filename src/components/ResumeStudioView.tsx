import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Check,
  Download,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Copy,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ResumeData, Experience, Education } from '../types';
import { api } from '../services/api';

export const ResumeStudioView: React.FC = () => {
  const {
    resumes,
    setResumes,
    activeResume,
    setActiveResume,
    showNotification,
    setProfile
  } = useApp();

  const [parsingText, setParsingText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableResume, setEditableResume] = useState<ResumeData>(activeResume);

  // Sync editable state when active resume changes
  const handleSelectResume = (r: ResumeData) => {
    setActiveResume(r);
    setEditableResume(r);
    setIsEditing(false);
  };

  const handleParseText = async () => {
    if (!parsingText.trim()) {
      showNotification('Please paste resume text to extract');
      return;
    }

    try {
      setIsParsing(true);
      const parsed = await api.parseResume(parsingText);
      const newVersion: ResumeData = {
        ...parsed,
        versionName: `Uploaded Resume (${new Date().toLocaleDateString()})`,
        isMaster: false,
      };

      setResumes((prev) => [newVersion, ...prev]);
      setActiveResume(newVersion);
      setEditableResume(newVersion);

      // Sync skills to profile
      setProfile((prev) => ({
        ...prev,
        skills: Array.from(new Set([...prev.skills, ...parsed.skills])),
        name: parsed.name || prev.name,
      }));

      showNotification('Resume parsed successfully! You can verify and edit all extracted details below.');
      setParsingText('');
    } catch (err) {
      console.error('Failed to parse resume:', err);
      showNotification('Error parsing resume. Please check server logs.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveEdits = () => {
    setResumes((prev) =>
      prev.map((r) => (r.id === editableResume.id ? { ...editableResume, updatedAt: new Date().toISOString() } : r))
    );
    setActiveResume(editableResume);
    setIsEditing(false);

    // Sync demonstrated skills to active profile
    setProfile((prev) => ({
      ...prev,
      skills: editableResume.skills,
      name: editableResume.name,
    }));

    showNotification('Resume corrections saved and synced to your career profile.');
  };

  const handleAddSkill = (skill: string) => {
    if (!skill.trim()) return;
    if (editableResume.skills.includes(skill.trim())) return;
    setEditableResume((prev) => ({
      ...prev,
      skills: [...prev.skills, skill.trim()],
    }));
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditableResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Master Resume & Version Management</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Resume Studio & Extraction Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Extract experience, education, and skills with AI HR Management Toolkit. Review and edit extracted entries to eliminate AI misinterpretations before matching with Singapore jobs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Clean PDF</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Versions & Upload Parser (1 Col) */}
        <div className="space-y-6">
          {/* Version Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center justify-between">
              <span>Resume Versions ({resumes.length})</span>
              <span className="text-[11px] font-normal text-slate-500">Historical versions</span>
            </h3>

            <div className="space-y-2">
              {resumes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectResume(r)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    activeResume.id === r.id
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-900">{r.versionName}</span>
                    {r.isMaster && (
                      <span className="text-[10px] font-bold text-indigo-700 uppercase">Master</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Updated {new Date(r.updatedAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{r.skills.length} skills</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Parser / Ingest */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Ingest Resume Text</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Paste your resume or bio text. Gemini 3.8 Flash will structure employers, dates, and competencies with strict zero-hallucination rules.
            </p>

            <textarea
              rows={6}
              value={parsingText}
              onChange={(e) => setParsingText(e.target.value)}
              placeholder="Paste raw resume or LinkedIn text here..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 mb-3"
            />

            <button
              onClick={handleParseText}
              disabled={isParsing || !parsingText.trim()}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer disabled:opacity-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isParsing ? 'Parsing & Extracting...' : 'Extract Experience & Skills'}</span>
            </button>
          </div>

          {/* Anti-Hallucination & Bias Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Human-in-the-Loop Safeguard</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Our system never assumes or invents qualifications. You have complete authority to correct, add, or delete any extracted skill or experience entry.
            </p>
          </div>
        </div>

        {/* Right Column: Active Resume Viewer & Inline Editor (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          {/* Card Top Actions */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Document View
              </div>
              <h2 className="text-lg font-bold text-slate-900">{editableResume.versionName}</h2>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSaveEdits}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Corrections</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Information</span>
                </button>
              )}
            </div>
          </div>

          {/* Contact / Header Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableResume.name}
                  onChange={(e) => setEditableResume({ ...editableResume, name: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              ) : (
                <div className="font-semibold text-slate-900 text-sm">{editableResume.name}</div>
              )}
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editableResume.email}
                  onChange={(e) => setEditableResume({ ...editableResume, email: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              ) : (
                <div className="text-slate-800">{editableResume.email}</div>
              )}
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableResume.phone}
                  onChange={(e) => setEditableResume({ ...editableResume, phone: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              ) : (
                <div className="text-slate-800">{editableResume.phone}</div>
              )}
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableResume.location}
                  onChange={(e) => setEditableResume({ ...editableResume, location: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              ) : (
                <div className="text-slate-800">{editableResume.location}</div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              Professional Summary
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={editableResume.summary}
                onChange={(e) => setEditableResume({ ...editableResume, summary: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs leading-relaxed"
              />
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                {editableResume.summary}
              </p>
            )}
          </div>

          {/* Demonstrated Skills Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Demonstrated Technical & Core Skills ({editableResume.skills.length})
              </label>
              {isEditing && (
                <span className="text-[11px] text-slate-500">Click x to remove or add below</span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {editableResume.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="new-skill-input"
                  placeholder="Add skill (e.g. Kubernetes, Power BI)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="p-1.5 text-xs border border-slate-200 rounded-md w-64"
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('new-skill-input') as HTMLInputElement;
                    if (el && el.value) {
                      handleAddSkill(el.value);
                      el.value = '';
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md cursor-pointer"
                >
                  Add Skill
                </button>
              </div>
            )}
          </div>

          {/* Work Experience */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Work Experience ({editableResume.experiences.length})
            </h3>
            <div className="space-y-4">
              {editableResume.experiences.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{exp.role}</div>
                      <div className="text-xs text-indigo-700 font-medium">{exp.company}</div>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {exp.startDate} - {exp.endDate}
                    </div>
                  </div>

                  <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-slate-600">
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider mb-2">Education</h3>
              {editableResume.educations.map((edu, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-semibold text-slate-900">{edu.institution}</div>
                  <div className="text-slate-700">{edu.degree} in {edu.fieldOfStudy}</div>
                  <div className="text-[11px] text-slate-500">Class of {edu.graduationYear}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 uppercase tracking-wider mb-2">Certifications</h3>
              <div className="space-y-2">
                {editableResume.certifications.map((cert, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
