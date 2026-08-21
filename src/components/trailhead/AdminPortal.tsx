import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Users,
  TrendingUp,
  Building,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { showToast } = useApp();

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 space-y-6 selection:bg-[#C9962C]/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD4C0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1F3A34] text-[#C9962C] font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              TPO OFFICER CONSOLE
            </span>
            <span className="text-xs font-mono text-[#1A1D1B]/60">
              CAMPUS PLACEMENT HEALTH & RECRUITER CLEARANCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1D1B]">
            Batch 2026 Placement Telemetry
          </h1>
        </div>

        <button
          onClick={() => showToast('Exported Recruiter Placement Clearance Sheet (CSV).')}
          className="px-4 py-2 rounded-xl bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26] font-mono text-xs font-semibold flex items-center gap-2 shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#C9962C]" />
          <span>Export Recruiter Roster</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0]">
          <div className="text-[11px] font-mono text-[#1A1D1B]/60">BATCH READINESS INDEX</div>
          <div className="text-3xl font-bold font-mono text-[#1F3A34] mt-1">79.4%</div>
          <span className="text-xs text-emerald-700 font-mono mt-1 block">
            +14% vs Previous Year
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0]">
          <div className="text-[11px] font-mono text-[#1A1D1B]/60">CRUCIBLE CERTIFIED CANDIDATES</div>
          <div className="text-3xl font-bold font-mono text-[#C9962C] mt-1">68 / 180</div>
          <span className="text-xs text-[#1A1D1B]/70 font-mono mt-1 block">
            Tier-1 Company Ready
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0]">
          <div className="text-[11px] font-mono text-[#1A1D1B]/60">AVERAGE PROJECTED PACKAGE</div>
          <div className="text-3xl font-bold font-mono text-[#2E6E8E] mt-1">â‚¹24.8 LPA</div>
          <span className="text-xs text-[#1A1D1B]/70 font-mono mt-1 block">
            Product Engineering Offers
          </span>
        </div>
      </div>

      {/* Recruiter Shortlist & Deficit Heatmap */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCD4C0] pb-3">
            <span className="text-xs font-mono font-bold text-[#1F3A34] uppercase">
              RECRUITER VISITING SCHEDULE
            </span>
            <span className="text-xs font-mono text-[#C9962C] font-bold">DRIVES ACTIVE</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#DCD4C0] flex items-center justify-between">
              <div>
                <strong className="text-sm font-display text-[#1A1D1B]">Stripe</strong>
                <p className="text-[11px] text-[#1A1D1B]/60 font-mono">Infrastructure SDE Â· 18 Shortlisted</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Drive: In 3 Days
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#DCD4C0] flex items-center justify-between">
              <div>
                <strong className="text-sm font-display text-[#1A1D1B]">Google L3</strong>
                <p className="text-[11px] text-[#1A1D1B]/60 font-mono">Campus Drive Â· 24 Shortlisted</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Drive: In 8 Days
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#DCD4C0] flex items-center justify-between">
              <div>
                <strong className="text-sm font-display text-[#1A1D1B]">CRED</strong>
                <p className="text-[11px] text-[#1A1D1B]/60 font-mono">Backend Systems Â· 14 Shortlisted</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Drive: In 5 Days
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCD4C0] pb-3">
            <span className="text-xs font-mono font-bold text-[#1F3A34] uppercase">
              BATCH SKILL DEFICIT RADAR
            </span>
            <span className="text-xs font-mono text-rose-700 font-bold">ACTION NEEDED</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#DCD4C0]">
              <div className="flex justify-between mb-1">
                <span className="font-semibold">60s Spoken Technical Defense</span>
                <span className="font-mono text-rose-700 font-bold">Deficit: 28%</span>
              </div>
              <p className="text-[11px] text-[#1A1D1B]/70">
                Students need more Crucible live verbal defense drills to clear managerial cross-examination.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#DCD4C0]">
              <div className="flex justify-between mb-1">
                <span className="font-semibold">Kafka Partitions & Event Ordering</span>
                <span className="font-mono text-amber-700 font-bold">Deficit: 18%</span>
              </div>
              <p className="text-[11px] text-[#1A1D1B]/70">
                Scheduled faculty workshop & Waypoint 4 systems reinforcement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

