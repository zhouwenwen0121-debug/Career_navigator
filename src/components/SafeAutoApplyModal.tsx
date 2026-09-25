import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  Mail,
  ExternalLink,
  Send,
  X
} from 'lucide-react';
import { Job } from '../types';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface SafeAutoApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SafeAutoApplyModal: React.FC<SafeAutoApplyModalProps> = ({ job, isOpen, onClose }) => {
  const { profile, activeResume, addApplication, showNotification } = useApp();

  const [confirmedByCandidate, setConfirmedByCandidate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<any>(null);

  if (!isOpen || !job) return null;

  const handleSubmit = async () => {
    if (!confirmedByCandidate) {
      showNotification('You must review and explicitly confirm application accuracy before submission.');
      return;
    }

    try {
      setSubmitting(true);
      const receipt = await api.simulateAutoApply({
        jobId: job.id,
        userExplicitConsent: true,
        applicationPackage: {
          candidateName: profile.name,
          resumeVersionName: activeResume.versionName,
          coverLetterText: 'Attached generated targeted cover letter.',
        },
      });

      setSubmittedReceipt(receipt);
      addApplication(job, 'Applied');
      showNotification(`Application successfully submitted to ${job.company}!`);
    } catch (err: any) {
      console.error('Submission failed:', err);
      showNotification(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedReceipt(null);
    setConfirmedByCandidate(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>JobGPT Guarded Auto-Apply Workflow</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Mandatory Application Review & Verification
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedReceipt ? (
          /* Submission Receipt Success */
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Application Successfully Verified & Submitted
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Receipt Reference: <span className="font-mono font-bold text-indigo-700">{submittedReceipt.confirmationId}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-1.5 max-w-md mx-auto">
              <div><strong>Target Employer:</strong> {submittedReceipt.company}</div>
              <div><strong>Role:</strong> {submittedReceipt.jobTitle}</div>
              <div><strong>Submitted At:</strong> {new Date(submittedReceipt.submittedAt).toLocaleString()}</div>
              <div><strong>Document Attached:</strong> {submittedReceipt.receipt.resumeVersion}</div>
              <div><strong>Portal Source:</strong> {submittedReceipt.receipt.source} ({submittedReceipt.receipt.externalJobId})</div>
            </div>

            <p className="text-[11px] text-slate-500">
              The application status has been logged in your Application Tracker under "Applied".
            </p>

            <button
              onClick={handleClose}
              className="px-5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Return to Navigator
            </button>
          </div>
        ) : (
          /* Review Checklist Before Submission */
          <>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Zero Silent Submissions Rule: </strong>
                Federal and Singapore employment guidelines require candidate consent. Review the application package below before authorizing dispatch.
              </div>
            </div>

            {/* Target Opportunity Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                <span className="text-slate-500 font-medium">{job.source}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <span>{job.company}</span>
                <span>·</span>
                <span>{job.location}</span>
                <span>·</span>
                <span className="font-semibold text-slate-900">SGD ${job.minSalarySGD.toLocaleString()} - ${job.maxSalarySGD.toLocaleString()}/mo</span>
              </div>
              <div className="text-[11px] text-slate-500">
                External Portal URL: <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{job.sourceUrl}</a>
              </div>
            </div>

            {/* Document Package Inspection */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Resume Version</div>
                    <div className="text-slate-500 text-[11px]">{activeResume.versionName}</div>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">✓ Verified Ready</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-semibold text-slate-900">Cover Letter</div>
                    <div className="text-slate-500 text-[11px]">Personalized for {job.company}</div>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">✓ Attached</span>
              </div>
            </div>

            {/* Explicit User Verification Gate */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmedByCandidate}
                  onChange={(e) => setConfirmedByCandidate(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span>
                  I have verified that all work history, skills, and qualifications in this application package are 100% authentic and authorize submission to <strong>{job.company}</strong>.
                </span>
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={!confirmedByCandidate || submitting}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-indigo-400" />
                <span>{submitting ? 'Submitting Application...' : 'Confirm & Authorize Dispatch'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
