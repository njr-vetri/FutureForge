import React from 'react';
import { useApp } from '../../context/AppContext';
import { TopographicTrail } from '../common/TopographicTrail';
import {
  Compass,
  Code2,
  BrainCircuit,
  FileText,
  MessageSquareCode,
  CheckCircle2,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Trophy,
  Briefcase,
  Target,
} from 'lucide-react';

export const TrailheadDashboard: React.FC = () => {
  const { profile, waypoints, navigate, setTrack, showToast } = useApp();

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 space-y-8 selection:bg-[#C9962C]/30">
      {/* Top Welcome & Notification Bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1F3A34] text-[#C9962C] font-semibold">
              <Compass className="w-3.5 h-3.5" />
              TRAILHEAD Â· EXPEDITION DASHBOARD
            </span>
            <span className="text-xs font-mono text-[#1A1D1B]/60">
              SESSION ACTIVE Â· 14-DAY STREAK
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[#1A1D1B]">
            Welcome back, {profile.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dashboard-switch-crucible-btn"
            onClick={() => {
              setTrack('crucible');
              navigate('/crucible/workflow');
            }}
            className="px-4 py-2 rounded-xl bg-[#211D1B] text-[#E8622C] border border-[#4A5A63] hover:border-[#E8622C] font-mono text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Flame className="w-4 h-4" />
            <span>Switch to Crucible Forge</span>
          </button>
        </div>
      </div>

      {/* SIGNATURE ELEMENT: TOPOGRAPHIC TRAIL HEADER */}
      <div className="max-w-7xl mx-auto">
        <TopographicTrail
          waypoints={waypoints}
          readinessScore={profile.readinessScore}
          onSelectWaypoint={(wp) => {
            showToast(`Selected Waypoint ${wp.number}: ${wp.title}`);
          }}
        />
      </div>

      {/* Quick Action Queue & Daily Drills */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Module Queue (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Expedition Priority Card */}
          <div className="rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCD4C0] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9962C] animate-ping" />
                <span className="text-xs font-mono font-bold text-[#1F3A34] uppercase tracking-wider">
                  TODAY'S EXPEDITION MISSION
                </span>
              </div>
              <span className="text-xs font-mono text-[#1A1D1B]/50">EST. TIME: 45 MINS</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-display font-bold text-[#1F3A34]">
                  Monotonic Deque & Sliding Window Drills
                </h3>
                <p className="text-xs text-[#1A1D1B]/75 mt-1 max-w-xl">
                  Required for Waypoint 4 sign-off before unlocking the Crucible Gate. Solve the maximum sliding window problem with linear time guarantees.
                </p>
              </div>

              <button
                id="dashboard-start-mission-btn"
                onClick={() => navigate('/coding')}
                className="px-5 py-2.5 rounded-xl bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26] font-medium text-xs font-mono transition-all shadow-sm shrink-0 flex items-center gap-2 focus:outline-none"
              >
                <span>Launch IDE Drill</span>
                <ArrowRight className="w-4 h-4 text-[#C9962C]" />
              </button>
            </div>
          </div>

          {/* Module Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Coding Arena */}
            <div
              onClick={() => handleQuickAction('/coding')}
              className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] hover:border-[#1F3A34] transition-all cursor-pointer shadow-xs group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1F3A34]/10 text-[#1F3A34] flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#1F3A34] font-bold">12 / 15 Solved</span>
                </div>
                <h4 className="text-lg font-display font-bold text-[#1A1D1B] group-hover:text-[#1F3A34]">
                  Coding Arena
                </h4>
                <p className="text-xs text-[#1A1D1B]/70 mt-1">
                  Master data structures, algorithms, and complex edge cases with built-in test runners.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DCD4C0]/60 flex items-center justify-between text-xs font-mono text-[#1F3A34]">
                <span>Open Challenges</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Aptitude Matrix */}
            <div
              onClick={() => handleQuickAction('/aptitude')}
              className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] hover:border-[#1F3A34] transition-all cursor-pointer shadow-xs group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2E6E8E]/10 text-[#2E6E8E] flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#2E6E8E] font-bold">91st Percentile</span>
                </div>
                <h4 className="text-lg font-display font-bold text-[#1A1D1B] group-hover:text-[#2E6E8E]">
                  Aptitude Matrix
                </h4>
                <p className="text-xs text-[#1A1D1B]/70 mt-1">
                  Timed quantitative, logical reasoning, and verbal speed elimination assessments.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DCD4C0]/60 flex items-center justify-between text-xs font-mono text-[#2E6E8E]">
                <span>Start Speed Test</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Mock Interview Room */}
            <div
              onClick={() => handleQuickAction('/interview')}
              className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] hover:border-[#1F3A34] transition-all cursor-pointer shadow-xs group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C9962C]/10 text-[#C9962C] flex items-center justify-center">
                    <MessageSquareCode className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#C9962C] font-bold">3 Completed</span>
                </div>
                <h4 className="text-lg font-display font-bold text-[#1A1D1B] group-hover:text-[#C9962C]">
                  Mock Interview Room
                </h4>
                <p className="text-xs text-[#1A1D1B]/70 mt-1">
                  AI technical and behavioral simulated interviews with real-time prompt generation.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DCD4C0]/60 flex items-center justify-between text-xs font-mono text-[#C9962C]">
                <span>Enter Room</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Placement Board */}
            <div
              onClick={() => handleQuickAction('/jobs')}
              className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] hover:border-[#1F3A34] transition-all cursor-pointer shadow-xs group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-emerald-700 font-bold">4 Active Drives</span>
                </div>
                <h4 className="text-lg font-display font-bold text-[#1A1D1B] group-hover:text-emerald-700">
                  Placement Board
                </h4>
                <p className="text-xs text-[#1A1D1B]/70 mt-1">
                  Live campus recruiting drives with candidate skill match scores and application tracker.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DCD4C0]/60 flex items-center justify-between text-xs font-mono text-emerald-700">
                <span>View Openings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Candidate Readiness Overview & Recent Verification Feed (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Readiness Breakdown Card */}
          <div className="rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCD4C0] pb-3">
              <span className="text-xs font-mono text-[#1F3A34] font-bold uppercase">
                PLACEMENT METRICS
              </span>
              <span className="text-xs font-mono text-[#C9962C] font-bold">
                SCORE: {profile.readinessScore}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Algorithms & DSA</span>
                  <span className="font-mono text-[#1F3A34] font-bold">86%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                  <div className="h-full bg-[#1F3A34] rounded-full" style={{ width: '86%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">System Design & Databases</span>
                  <span className="font-mono text-[#1F3A34] font-bold">84%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                  <div className="h-full bg-[#1F3A34] rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Quantitative Aptitude</span>
                  <span className="font-mono text-[#C9962C] font-bold">91%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                  <div className="h-full bg-[#C9962C] rounded-full" style={{ width: '91%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Technical Spoken Defense</span>
                  <span className="font-mono text-[#2E6E8E] font-bold">74%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
                  <div className="h-full bg-[#2E6E8E] rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/roadmap')}
              className="w-full py-2 rounded-xl bg-[#EFE9D8] text-[#1F3A34] border border-[#DCD4C0] hover:bg-white text-xs font-mono font-bold transition-colors"
            >
              View Full Expedition Roadmap
            </button>
          </div>

          {/* Recent Verified Activities Feed */}
          <div className="rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] p-6 shadow-sm space-y-4">
            <div className="text-xs font-mono text-[#1F3A34] font-bold uppercase border-b border-[#DCD4C0] pb-3">
              RECENT VERIFIED ACTIVITIES
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Alien Dictionary Graph Traversal</span>
                  <p className="text-[11px] text-[#1A1D1B]/60 font-mono">Passed 14/14 test cases Â· 2 hrs ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">TCS / Infosys National Mock</span>
                  <p className="text-[11px] text-[#1A1D1B]/60 font-mono">Scored 94% Â· 98th Percentile</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Rate Limiter Token Bucket</span>
                  <p className="text-[11px] text-[#1A1D1B]/60 font-mono">Completed Waypoint 4 submission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

