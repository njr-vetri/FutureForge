import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockCrucibleTargetBenchmarks } from '../../data/mockData';
import { TargetBenchmark } from '../../types';
import {
  BarChart3,
  Flame,
  Calendar,
  Clock,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const GapAnalyzer: React.FC = () => {
  const { profile, showToast } = useApp();
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>('stripe-infra');

  const benchmark =
    mockCrucibleTargetBenchmarks.find((b) => b.roleId === selectedBenchmarkId) ||
    mockCrucibleTargetBenchmarks[0];

  const handleStartDrill = (day: number, focus: string) => {
    showToast(`Day ${day} Drill Activated: "${focus}". Added to your active Crucible agenda.`);
  };

  return (
    <div className="crucible-theme min-h-screen bg-[#211D1B] text-[#EFE9D8] p-4 sm:p-6 lg:p-10 space-y-8 selection:bg-[#E8622C]/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#4A5A63]/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#E8622C]/20 text-[#E8622C] border border-[#E8622C]/30 font-semibold">
              <Flame className="w-3.5 h-3.5" />
              BENCHMARK MATRIX
            </span>
            <span className="text-xs font-mono text-[#EFE9D8]/60">
              TARGET ROLE GAP REDUCTION
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#EFE9D8]">
            Benchmark Gap Analyzer
          </h1>
        </div>

        {/* Target Role Selector Dropdown */}
        <div className="flex items-center gap-3 bg-[#161311] p-2 rounded-xl border border-[#4A5A63]/70">
          <span className="text-xs font-mono text-[#EFE9D8]/60 pl-2">BENCHMARK ROLE:</span>
          <select
            id="target-role-dropdown"
            value={selectedBenchmarkId}
            onChange={(e) => setSelectedBenchmarkId(e.target.value)}
            className="bg-[#211D1B] text-[#F2B705] font-semibold border border-[#4A5A63] rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#E8622C]"
          >
            {mockCrucibleTargetBenchmarks.map((b) => (
              <option key={b.roleId} value={b.roleId}>
                {b.company} â€” {b.roleTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#161311] border border-[#4A5A63]/60">
          <div className="text-[11px] font-mono text-[#EFE9D8]/60">CURRENT ROLE FIT SCORE</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono text-[#E8622C]">
              {benchmark.candidateFitScore}%
            </span>
            <span className="text-xs font-mono text-[#4A5A63]">/ 100 Target</span>
          </div>
          <span className="text-xs text-amber-400 font-mono mt-1 block">
            Requires ~7 Days Focused Hardening
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#161311] border border-[#4A5A63]/60">
          <div className="text-[11px] font-mono text-[#EFE9D8]/60">COMPENSATION BENCHMARK</div>
          <div className="text-2xl font-bold font-mono text-[#F2B705] mt-1">
            {benchmark.salaryBenchmark}
          </div>
          <span className="text-xs text-[#EFE9D8]/50 font-mono mt-1 block">
            {benchmark.company} Campus Placement Offer Tier
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#161311] border border-[#4A5A63]/60">
          <div className="text-[11px] font-mono text-[#EFE9D8]/60">PRIMARY DEFICIT AREA</div>
          <div className="text-base font-semibold text-rose-400 mt-1 truncate">
            {benchmark.categories.reduce((prev, curr) => (curr.gap < prev.gap ? curr : prev)).name}
          </div>
          <span className="text-xs text-[#EFE9D8]/60 font-mono mt-1 block">
            Crucible drills scheduled below
          </span>
        </div>
      </div>

      {/* Category Breakdown vs Requirements */}
      <div className="max-w-6xl mx-auto rounded-2xl bg-[#161311] border border-[#4A5A63]/70 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#4A5A63]/50 pb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-[#E8622C]" />
            <h2 className="text-xl font-display font-bold text-[#EFE9D8]">
              Skill Breakdown vs. {benchmark.company} Standard
            </h2>
          </div>
          <span className="text-xs font-mono text-[#EFE9D8]/60">
            MINIMUM PASSING BAR: 90%
          </span>
        </div>

        <div className="space-y-4">
          {benchmark.categories.map((cat) => {
            const hasGap = cat.gap < 0;
            return (
              <div
                key={cat.name}
                className="p-4 rounded-xl bg-[#211D1B] border border-[#4A5A63]/50 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-[#EFE9D8]">{cat.name}</span>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-[#EFE9D8]/60">
                      Required: <strong className="text-[#EFE9D8]">{cat.required}%</strong>
                    </span>
                    <span className="text-[#EFE9D8]/60">
                      Yours: <strong className="text-[#F2B705]">{cat.candidate}%</strong>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        hasGap
                          ? 'bg-rose-950 text-rose-400 border border-rose-600/40'
                          : 'bg-emerald-950 text-emerald-400'
                      }`}
                    >
                      {cat.gap > 0 ? `+${cat.gap}%` : `${cat.gap}%`}
                    </span>
                  </div>
                </div>

                {/* Progress Bar with target marker */}
                <div className="relative w-full h-2.5 rounded-full bg-[#161311] overflow-hidden">
                  <div
                    style={{ width: `${cat.candidate}%` }}
                    className="h-full rounded-full bg-[#E8622C] transition-all duration-700"
                  />
                  {/* Required Target pin line */}
                  <div
                    style={{ left: `${cat.required}%` }}
                    className="absolute top-0 bottom-0 w-0.5 bg-[#F2B705] z-10"
                    title={`Required: ${cat.required}%`}
                  />
                </div>

                <p className="text-[11px] text-[#EFE9D8]/70 italic pt-1">
                  &ldquo;{cat.critique}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* NUMBERED 7-DAY FIX ROADMAP CARD IN EMBER/SPARK-GOLD PALETTE */}
      <div
        id="crucible-7day-roadmap-card"
        className="max-w-6xl mx-auto rounded-2xl bg-[#161311] border-2 border-[#E8622C] p-6 sm:p-8 space-y-6 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4A5A63]/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8622C] text-[#211D1B] flex items-center justify-center font-bold font-mono text-lg shadow-sm">
              7D
            </div>
            <div>
              <span className="text-xs font-mono text-[#F2B705] uppercase tracking-wider font-semibold">
                CRUCIBLE HARDENING SPRINT
              </span>
              <h2 className="text-2xl font-display font-bold text-[#EFE9D8]">
                7-Day Placement Fix Roadmap for {benchmark.company}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-[#211D1B] px-3 py-1.5 rounded-xl border border-[#4A5A63]">
            <Calendar className="w-4 h-4 text-[#F2B705]" />
            <span>Target Completion: 7 Consecutive Days</span>
          </div>
        </div>

        {/* 7 Numbered Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benchmark.sevenDayRoadmap.map((item) => (
            <div
              key={item.day}
              className="p-4 rounded-xl bg-[#211D1B] border border-[#4A5A63]/70 hover:border-[#E8622C] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#E8622C]/20 text-[#E8622C] border border-[#E8622C]/40 font-mono font-bold text-xs flex items-center justify-center">
                      {item.day}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#F2B705] uppercase">
                      DAY 0{item.day} Â· {item.focus}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#EFE9D8]/50">
                    <Clock className="w-3 h-3" />
                    <span>{item.timeCommitment}</span>
                  </div>
                </div>

                <p className="text-xs text-[#EFE9D8]/90 font-medium mb-2">
                  {item.drill}
                </p>

                <div className="p-2.5 rounded bg-[#161311] border border-[#4A5A63]/40 text-[11px] font-mono text-[#EFE9D8]/70">
                  <span className="text-[#E8622C] font-semibold">DELIVERABLE: </span>
                  {item.deliverable}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#4A5A63]/30 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#EFE9D8]/40">Status: Pending Drill</span>
                <button
                  onClick={() => handleStartDrill(item.day, item.focus)}
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#E8622C] group-hover:text-[#F2B705] transition-colors focus:outline-none"
                >
                  <span>Start Day {item.day}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Guarantee */}
        <div className="pt-4 border-t border-[#4A5A63]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#EFE9D8]/70">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#F2B705]" />
            <span>Completing all 7 deliverables unlocks Crucible Verified Placement Clearance</span>
          </div>
          <span className="text-[#E8622C] font-semibold">Expected Fit Score: 96%</span>
        </div>
      </div>
    </div>
  );
};

