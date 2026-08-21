import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobOpening } from '../../types';
import {
  Briefcase,
  Target,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Building,
  Filter,
} from 'lucide-react';

export const JobsPortal: React.FC = () => {
  const { jobs, setJobs, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const handleApply = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'Applied' } : j))
    );
    showToast('Application submitted via CareerOS Verified Placement Bridge.');
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-[#FAF8F2] p-1.5 rounded-xl border border-[#DCD4C0] text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-[#1F3A34] ml-1" />
          {['All', 'Shortlisted', 'Under Review', 'Applied'].map((status) => (
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
                <span className="text-xs font-mono text-[#1A1D1B]/60">
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
                <span>â€¢</span>
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
                    âœ“ {s}
                  </span>
                ))}
                {job.missingSkills.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-medium"
                  >
                    Î” {s}
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
                  onClick={() => handleApply(job.id)}
                  className="px-5 py-2 rounded-xl bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26] text-xs font-mono font-bold transition-colors shadow-sm"
                >
                  Apply Now
                </button>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    job.status === 'Shortlisted'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : job.status === 'Under Review'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
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
    </div>
  );
};

