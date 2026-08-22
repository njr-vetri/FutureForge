import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Flame,
  Target,
  Bell,
  Sparkles,
  ChevronRight,
  Shield,
  Menu,
  Lock,
  LogOut,
} from 'lucide-react';
import { CareerOSLogo } from '../common/CareerOSLogo';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    track,
    setTrack,
    currentRoute,
    profile,
    setIsSkillGraphOpen,
    activeEmberPanel,
    logout,
  } = useApp();

  const isCrucible = track === 'crucible';

  // Format route breadcrumb cleanly
  const getBreadcrumb = (route: string) => {
    if (route.startsWith('/crucible/workflow')) return 'Crucible - 3-Phase Live Workflow';
    if (route.startsWith('/crucible/roast-my-repo')) return 'Crucible - Roast My Repo';
    if (route.startsWith('/crucible/gap-analyzer')) return 'Crucible - Benchmark Gap Analyzer';
    if (route.startsWith('/coding')) return 'Trailhead - Coding Arena';
    if (route.startsWith('/aptitude')) return 'Trailhead - Aptitude Matrix';
    if (route.startsWith('/video-hub')) return 'Trailhead - Video Hub';
    if (route.startsWith('/resume')) return 'Trailhead - Resume Studio';
    if (route.startsWith('/interview')) return 'Trailhead - Mock Interview Room';
    if (route.startsWith('/roadmap')) return 'Trailhead - Career Roadmap';
    if (route.startsWith('/jobs')) return 'Trailhead - Jobs Portal';
    if (route.startsWith('/leaderboard')) return 'Trailhead - Batch Leaderboard';
    if (route.startsWith('/profile')) return 'Candidate Verified Profile';
    return 'Roadmap Dashboard';
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors duration-300 ${
        isCrucible
          ? 'bg-[#14231E] text-[#F7F8F5] border-[#DDE4DE]'
          : 'bg-[#14231E] text-[#F7F8F5] border-[#DDE4DE]'
      }`}
    >
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Left: Mobile Toggle & Brand / Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            id="mobile-sidebar-toggle"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <CareerOSLogo variant="horizontal" size="sm" theme="dark" showTagline={false} />

            <div className="hidden sm:flex flex-col border-l border-white/15 pl-3 ml-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                {getBreadcrumb(currentRoute)}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Interactive Track Switcher Pill */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 shadow-sm">
          <button
            id="nav-switch-trailhead"
            onClick={() => setTrack('trailhead')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              !isCrucible
                ? 'bg-[#1F5E4D] text-white font-bold shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F7F8F5] hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Trailhead</span>
            <span className="md:hidden">Track 1</span>
          </button>

          <button
            id="nav-switch-crucible"
            onClick={() => isCrucible ? setTrack('crucible') : null}
            disabled={!isCrucible}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              isCrucible
                ? 'bg-[#B8872F] text-[#14231E] font-bold shadow-sm'
                : 'text-[#94A3B8]/50 cursor-not-allowed'
            }`}
          >
            {isCrucible ? <Flame className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">Crucible</span>
            <span className="md:hidden">Track 2</span>
          </button>
        </div>

        {/* Right: Readiness Score, Skill Graph Trigger, Avatar */}
        <div className="flex items-center gap-3">
          {/* Shared Readiness Score Pill */}
          <button
            id="nav-open-skill-graph"
            onClick={() => setIsSkillGraphOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-mono group focus:outline-none ${
              isCrucible
                ? 'bg-[#211D1B] border-[#B8872F]/50 hover:border-[#B8872F] text-[#F7F8F5]'
                : 'bg-[#1F3A34] border-[#C9962C]/50 hover:border-[#C9962C] text-[#F7F8F5]'
            }`}
            title="Open Verified Skill Graph & Readiness Matrix"
          >
            <Target
              className={`w-3.5 h-3.5 ${
                isCrucible ? 'text-[#B8872F]' : 'text-[#B8872F]'
              } group-hover:rotate-45 transition-transform`}
            />
            <div className="flex items-baseline gap-1">
              <span className="text-[#DDE4DE]/80 text-[10px] hidden sm:inline">READINESS:</span>
              <span
                className={`font-bold ${
                  isCrucible ? 'text-[#B8872F]' : 'text-[#B8872F]'
                }`}
              >
                {profile.readinessScore}%
              </span>
            </div>
          </button>

          {/* User Profile Avatar Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/15">
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono font-bold text-xs shadow-xs ${
                isCrucible
                  ? 'bg-[#B8872F] text-[#14231E] border-[#B8872F]'
                  : 'bg-[#1F5E4D] text-white border-[#93C5FD]'
              }`}
            >
              {profile.avatar}
            </div>
            <div className="hidden xl:flex flex-col text-left mr-2">
              <span className="text-xs font-semibold leading-none">{profile.name}</span>
              <span className="text-[10px] font-mono opacity-60">NIT • CSE 2026</span>
            </div>
            
            <button
              onClick={logout}
              title="Sign Out"
              className={`p-1.5 rounded-lg transition-colors border ${
                isCrucible
                  ? 'border-transparent hover:bg-white/10 text-white/70 hover:text-white'
                  : 'border-transparent hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
