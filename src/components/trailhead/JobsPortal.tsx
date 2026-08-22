import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobOpening } from '../../types';
import {
  Briefcase,
  MapPin,
  Filter,
  X,
  CalendarDays,
} from 'lucide-react';

const OWNER_EMAIL = 'vetrim7ruga@gmail.com';
const JOB_STATUS_STORAGE_KEY = 'careeros_job_statuses';

const getStoredJobStatuses = (): Record<string, JobOpening['status']> => {
  try {
    return JSON.parse(localStorage.getItem(JOB_STATUS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const storeJobStatus = (jobId: string, status: JobOpening['status']) => {
  const statuses = getStoredJobStatuses();
  statuses[jobId] = status;
  localStorage.setItem(JOB_STATUS_STORAGE_KEY, JSON.stringify(statuses));
};

export const JobsPortal: React.FC = () => {
  const { jobs, setJobs, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const selectedJobDetails = selectedJob ? jobs.find((job) => job.id === selectedJob) : null;

  const updateJobStatus = (jobId: string, status: JobOpening['status']) => {
    storeJobStatus(jobId, status);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status } : j))
    );
  };

  React.useEffect(() => {
    setIsLoading(true);
    const storedStatuses = getStoredJobStatuses();
    const approveJobId = new URLSearchParams(window.location.hash.split('?')[1] || '').get('approveJob');
    fetch('/api/jobs?role=Software+Engineer')
      .then(res => res.json())
      .then(data => {
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs.map((j: any, index: number) => {
            const status = approveJobId === String(j.id) ? 'Approved' : storedStatuses[String(j.id)] || 'Not Applied';
            if (approveJobId === String(j.id)) storeJobStatus(String(j.id), 'Approved');
            return {
              ...j,
              type: j.type || 'Full-time',
              package: j.package || 'Competitive',
              deadline: j.deadline || `In ${index + 3} Days`,
              matchedSkills: j.matchedSkills || [],
              missingSkills: j.missingSkills || [],
              status,
            };
          }));
          if (approveJobId) showToast('Application approved from owner email link.');
        } else if (approveJobId) {
          updateJobStatus(approveJobId, 'Approved');
          showToast('Application approved from owner email link.');
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (approveJobId) {
          updateJobStatus(approveJobId, 'Approved');
          showToast('Application approved from owner email link.');
        }
        setIsLoading(false);
      });
  }, []);

  const handleApplyClick = (id: string) => {
    setSelectedJob(id);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const applicantName = String(formData.get('fullName') || 'Candidate');
    const applicantEmail = String(formData.get('email') || 'candidate@example.com');
    const applicantPhone = String(formData.get('phone') || '');
    const coverNote = String(formData.get('coverNote') || '');
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (selectedJob) {
        const jobId = selectedJob;
        const job = jobs.find(j => j.id === jobId);
        updateJobStatus(jobId, 'Under Review');
        if (job) {
          const approveUrl = `${window.location.origin}${window.location.pathname}#/jobs?approveJob=${encodeURIComponent(job.id)}`;
          const subject = `New CareerOS application: ${applicantName} for ${job.role}`;
          const body = [
            'New application received from CareerOS.',
            '',
            `Candidate: ${applicantName}`,
            `Email: ${applicantEmail}`,
            `Phone: ${applicantPhone}`,
            `Company: ${job.company}`,
            `Role: ${job.role}`,
            `Location: ${job.location}`,
            `Deadline: ${job.deadline}`,
            '',
            'Cover note:',
            coverNote,
            '',
            'Approve this application:',
            approveUrl,
          ].join('\n');
          window.location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          showToast('Application sent for owner review.');
        }
      }
      setSelectedJob(null);
      showToast('Application is under review until owner approval.');
    }, 1200);
  };

  const filteredJobs = jobs.filter((j) =>
    filterStatus === 'All' ? true : j.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 space-y-6 selection:bg-[#C9962C]/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD4C0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-800 text-white font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              CAMPUS PLACEMENT BOARD
            </span>
            <span className="text-xs font-mono text-[#1A1D1B]/60">
              CAMPUS RECRUITING DRIVES 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1D1B]">
            Placement Drives & Skill Matching
          </h1>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-[#FAF8F2] p-1.5 rounded-xl border border-[#DCD4C0] text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-[#1F3A34] ml-1" />
          {['All', 'Not Applied', 'Applied', 'Under Review', 'Shortlisted', 'Approved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filterStatus === status
                  ? 'bg-[#1F3A34] text-[#EFE9D8] font-bold'
                  : 'text-[#1A1D1B]/70 hover:text-[#1A1D1B]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-6xl mx-auto space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#1F3A34] transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1F3A34] text-[#C9962C]">
                  {job.company}
                </span>
                <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  {job.package}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-red-800 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg shadow-sm">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Deadline: {job.deadline}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-[#1A1D1B]">
                {job.role}
              </h3>

              <div className="flex items-center gap-4 text-xs text-[#1A1D1B]/70 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
                <span>-</span>
                <span>{job.type}</span>
              </div>

              {/* Matched Skills Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[11px] font-mono text-[#1A1D1B]/50 mr-1">Skills:</span>
                {job.matchedSkills.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium"
                  >
                    OK {s}
                  </span>
                ))}
                {job.missingSkills.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-medium"
                  >
                    Missing: {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Match Score & Action */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#DCD4C0]">
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-mono text-[#1A1D1B]/60">SKILL MATCH</div>
                <div className="text-2xl font-bold font-mono text-[#1F3A34]">
                  {job.matchScore}%
                </div>
              </div>

              {job.status === 'Not Applied' ? (
                <button
                  onClick={() => handleApplyClick(job.id)}
                  className="px-5 py-2 rounded-xl bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26] text-xs font-mono font-bold transition-colors shadow-sm"
                >
                  Apply Now
                </button>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    job.status === 'Approved' || job.status === 'Offer'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : job.status === 'Shortlisted'
                      ? 'bg-violet-100 text-violet-800 border border-violet-300'
                      : job.status === 'Under Review'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : job.status === 'Applied'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-[#1F3A34]/10 text-[#1F3A34]'
                  }`}
                >
                  {job.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF8F2] w-full max-w-lg rounded-2xl border border-[#DCD4C0] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#DCD4C0] flex justify-between items-center bg-white">
              <h2 className="font-display font-bold text-xl text-[#1A1D1B]">Submit Application</h2>
              <button 
                onClick={() => setSelectedJob(null)}
                className="p-1.5 hover:bg-[#EFE9D8] rounded-lg transition-colors text-[#1A1D1B]/50 hover:text-[#1A1D1B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitApplication} className="p-6 space-y-4">
              {selectedJobDetails && (
                <div className="rounded-xl border border-[#DCD4C0] bg-white p-4">
                  <div className="text-xs font-mono font-bold text-[#1A1D1B]/50 uppercase">Applying for</div>
                  <div className="mt-1 font-display font-bold text-lg text-[#1A1D1B]">{selectedJobDetails.role}</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono font-extrabold text-red-800 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Deadline: {selectedJobDetails.deadline}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#1A1D1B]/70 uppercase">Full Name</label>
                  <input name="fullName" type="text" required className="w-full px-3 py-2 bg-white border border-[#DCD4C0] rounded-xl text-sm focus:outline-none focus:border-[#1F3A34]" placeholder="Jane Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#1A1D1B]/70 uppercase">Phone</label>
                  <input name="phone" type="tel" required className="w-full px-3 py-2 bg-white border border-[#DCD4C0] rounded-xl text-sm focus:outline-none focus:border-[#1F3A34]" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#1A1D1B]/70 uppercase">Email Address</label>
                <input name="email" type="email" required className="w-full px-3 py-2 bg-white border border-[#DCD4C0] rounded-xl text-sm focus:outline-none focus:border-[#1F3A34]" placeholder="jane@example.com" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#1A1D1B]/70 uppercase">Cover Note / Why this role?</label>
                <textarea name="coverNote" required rows={3} className="w-full px-3 py-2 bg-white border border-[#DCD4C0] rounded-xl text-sm focus:outline-none focus:border-[#1F3A34] resize-none" placeholder="I am excited about this opportunity because..."></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#DCD4C0] mt-6">
                <button 
                  type="button" 
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 font-mono text-xs font-bold text-[#1A1D1B]/70 hover:text-[#1A1D1B] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#1F3A34] hover:bg-[#162B26] text-[#EFE9D8] font-mono text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#EFE9D8]/30 border-t-[#EFE9D8] rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

