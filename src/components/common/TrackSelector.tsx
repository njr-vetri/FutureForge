import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Flame, ArrowRight, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { CareerOSLogo } from './CareerOSLogo';

export const TrackSelector: React.FC = () => {
  const { setTrack, navigate, profile } = useApp();
  const [candidateName, setCandidateName] = useState(profile.name);
  const [selectedRole, setSelectedRole] = useState(profile.targetRoles[0]);

  const handleSelectTrack = (selectedTrack: 'trailhead' | 'crucible') => {
    if (selectedTrack === 'trailhead') {
      setTrack('trailhead');
      // note: setTrack now handles navigating to /dashboard or /crucible/workflow internally if needed,
      // but AppContext was modified to only navigate if needed. Let's just use navigate here.
      navigate('/dashboard');
    } else {
      navigate('/crucible-assessment');
    }
  };

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] flex flex-col justify-between p-6 md:p-12 selection:bg-[#C9962C]/30">
      {/* Top Brand Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <CareerOSLogo variant="horizontal" size="md" theme="light" showTagline={true} />

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 border border-[#DCD4C0] text-xs font-mono shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#1F5E4D]" />
          <span className="font-semibold text-[#14231E]">NIT Placement Portal Active</span>
        </div>
      </div>

      {/* Main Selection Body */}
      <div className="max-w-5xl mx-auto w-full my-auto py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#1F3A34]/10 text-[#1F3A34] border border-[#1F3A34]/20 mb-3 font-medium">
            <UserCheck className="w-3.5 h-3.5" />
            PLACEMENT CANDIDATE VERIFIED
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-[#1A1D1B] mb-4">
            Select Your Placement Track
          </h2>
          <p className="text-sm sm:text-base text-[#1A1D1B]/75 leading-relaxed">
            CareerOS adapts to your preparation stage. Choose your entry point below â€” you can
            switch between tracks anytime from the sidebar without losing skill records.
          </p>
        </div>

        {/* Two Large Tappable Track Panels Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* TRACK 1: TRAILHEAD (Beginner - Intermediate) */}
          <div
            id="select-trailhead-track"
            role="button"
            tabIndex={0}
            onClick={() => handleSelectTrack('trailhead')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectTrack('trailhead')}
            className="group relative rounded-2xl bg-[#1F3A34] text-[#EFE9D8] p-8 border-2 border-[#2A4D45] hover:border-[#C9962C] transition-all duration-300 shadow-sm flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#C9962C]/40 hover:-translate-y-1"
          >
            {/* Background Topographic subtle accent */}
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Compass className="w-32 h-32 text-[#C9962C]" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#162B26] text-[#C9962C] border border-[#C9962C]/40 flex items-center justify-center shadow-sm">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#C9962C]/20 text-[#C9962C] border border-[#C9962C]/40 font-semibold tracking-wider">
                  TRACK 01
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#EFE9D8] mb-2 group-hover:text-[#C9962C] transition-colors">
                Trailhead
              </h3>

              <div className="text-xs font-mono text-[#C9962C] mb-4 uppercase tracking-wider font-semibold">
                Expedition & Milestones
              </div>

              <p className="text-sm text-[#EFE9D8]/80 leading-relaxed mb-6">
                Guided expedition route mapped with waypoints across core algorithms, aptitude elimination drills, resume audits, and mock interview rooms.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2.5 pt-4 border-t border-[#2A4D45] text-xs font-mono text-[#EFE9D8]/70">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9962C]" />
                  <span>Topographic trail with dynamic milestone pins</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E6E8E]" />
                  <span>Timed aptitude speed-tests & percentile report</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9962C]" />
                  <span>Full-featured coding IDE with test runners</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#2A4D45] flex items-center justify-between">
              <span className="text-xs font-mono text-[#EFE9D8]/60">Recommended for initial prep</span>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9962C] text-[#1A1D1B] font-semibold text-xs group-hover:bg-[#B58422] transition-colors shadow-sm">
                <span>Enter Trailhead</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* TRACK 2: CRUCIBLE (Intermediate - Advanced) */}
          <div
            id="select-crucible-track"
            role="button"
            tabIndex={0}
            onClick={() => handleSelectTrack('crucible')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectTrack('crucible')}
            className="group relative rounded-2xl bg-[#211D1B] text-[#EFE9D8] p-8 border-2 border-[#4A5A63] hover:border-[#E8622C] transition-all duration-300 shadow-sm flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#E8622C]/40 hover:-translate-y-1"
          >
            {/* Background Forge subtle accent */}
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Flame className="w-32 h-32 text-[#E8622C]" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#161311] text-[#E8622C] border border-[#E8622C]/40 flex items-center justify-center shadow-sm">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#E8622C]/20 text-[#E8622C] border border-[#E8622C]/40 font-semibold tracking-wider">
                  TRACK 02
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#EFE9D8] mb-2 group-hover:text-[#E8622C] transition-colors">
                Crucible
              </h3>

              <div className="text-xs font-mono text-[#E8622C] mb-4 uppercase tracking-wider font-semibold">
                Tested by Fire
              </div>

              <p className="text-sm text-[#EFE9D8]/80 leading-relaxed mb-6">
                High-intensity forge evaluation: continuous 3-phase live problem solving + IDE + 60-second spoken defense under stern hiring manager scrutiny.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2.5 pt-4 border-t border-[#4A5A63] text-xs font-mono text-[#EFE9D8]/70">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8622C]" />
                  <span>3-Phase Continuous Workflow (No page reload)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2B705]" />
                  <span>Roast My Repo with live code file-tree review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8622C]" />
                  <span>Gap Analyzer against target company benchmarks</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#4A5A63] flex items-center justify-between">
              <span className="text-xs font-mono text-[#EFE9D8]/60">For intensive placement trials</span>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8622C] text-[#211D1B] font-semibold text-xs group-hover:bg-[#F2B705] transition-colors shadow-sm">
                <span>Enter Crucible</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Shared Placement Readiness Strip */}
        <div className="mt-12 bg-white/60 backdrop-blur-xs rounded-xl p-4 border border-[#DCD4C0] max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1F3A34] text-[#C9962C] font-mono font-bold flex items-center justify-center text-xs">
              {profile.avatar}
            </div>
            <div>
              <span className="font-semibold text-[#1A1D1B]">{profile.name}</span>
              <span className="text-[#1A1D1B]/60 font-mono ml-2">({profile.college})</span>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <div>
              <span className="text-[#1A1D1B]/60">SHARED READINESS: </span>
              <span className="font-bold text-[#1F3A34]">{profile.readinessScore}%</span>
            </div>
            <div>
              <span className="text-[#1A1D1B]/60">STREAK: </span>
              <span className="font-bold text-[#C9962C]">{profile.currentStreakDays} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs font-mono text-[#1A1D1B]/50 py-4 border-t border-[#DCD4C0]/60">
        CareerOS Placement Engine Â· Strict Anti-SaaS Design System Â· Built for Production Placement Readiness
      </div>
    </div>
  );
};

