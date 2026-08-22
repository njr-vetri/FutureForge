import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Flame,
  Code2,
  BrainCircuit,
  Video,
  FileText,
  MessageSquareCode,
  Milestone,
  Briefcase,
  Trophy,
  User,
  GitBranch,
  BarChart3,
  Target,
  X,
  Lock,
  LogOut,
} from 'lucide-react';
import { CareerOSLogo } from '../common/CareerOSLogo';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface SidebarLink {
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose = () => {} }) => {
  const {
    track,
    setTrack,
    currentRoute,
    navigate,
    profile,
    logout,
  } = useApp();

  const isCrucible = track === 'crucible';
  const hasCompletedTrailhead = profile.trailheadCompletedWaypoints >= profile.totalWaypoints;

  const trailheadLinks: SidebarLink[] = [
    { label: 'Dashboard', route: '/dashboard', icon: Compass },
    { label: 'Coding Lab', route: '/coding', icon: Code2 },
    { label: 'Aptitude Practice', route: '/aptitude', icon: BrainCircuit },
    { label: 'Video Hub', route: '/video-hub', icon: Video },
    { label: 'Resume & ATS', route: '/resume', icon: FileText },
    { label: 'Interview Practice', route: '/interview', icon: MessageSquareCode },
    { label: 'Career Roadmap', route: '/roadmap', icon: Milestone },
    { label: 'Job Board', route: '/jobs', icon: Briefcase },
    { label: 'Leaderboard', route: '/leaderboard', icon: Trophy },
    { label: 'Profile', route: '/profile', icon: User },
  ];

  const crucibleLinks: SidebarLink[] = [
    {
      label: '3-Phase Continuous Flow',
      route: '/crucible/workflow',
      icon: Flame,
      badge: 'UNIFIED IDE',
    },
    {
      label: 'Roast My Repo',
      route: '/crucible/roast-my-repo',
      icon: GitBranch,
      badge: 'LIVE CHAT',
    },
    {
      label: 'Benchmark Gap Analyzer',
      route: '/crucible/gap-analyzer',
      icon: BarChart3,
      badge: '7-DAY FIX',
    },
    {
      label: 'Profile',
      route: '/profile',
      icon: User,
    },
  ];

  const currentLinks = isCrucible ? crucibleLinks : trailheadLinks;

  const handleLinkClick = (route: string) => {
    navigate(route);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        id="app-main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col justify-between transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isCrucible
            ? 'bg-[#161311] text-[#EFE9D8] border-r border-[#4A5A63]/50'
            : 'bg-[#14231E] text-[#F7F8F5] border-r border-[#DDE4DE]'
        }`}
      >
        {/* Top Header of Sidebar */}
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <CareerOSLogo variant="horizontal" size="sm" theme="dark" showTagline={true} />
            
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors focus:outline-none ml-2"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5 opacity-70" />
            </button>
          </div>

          {/* Track Context Switcher Card */}
          <div className="p-4">
            <div
              className={`p-3 rounded-xl border text-xs ${
                isCrucible
                  ? 'bg-[#211D1B] border-[#B8872F]/50 text-[#F7F8F5]'
                  : 'bg-[#1A2E28] border-[#C9962C]/40 text-[#F7F8F5]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono opacity-70 uppercase tracking-widest text-[#94A3B8]">
                  ACTIVE TRACK
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isCrucible
                      ? 'bg-[#B8872F]/20 text-[#B8872F] border border-[#B8872F]/40'
                      : 'bg-[#B8872F]/20 text-[#B8872F] border border-[#B8872F]/40'
                  }`}
                >
                  {isCrucible ? 'TRACK 02' : 'TRACK 01'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  id="sidebar-toggle-trailhead"
                  onClick={() => setTrack('trailhead')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-medium transition-all ${
                    !isCrucible
                      ? 'bg-[#1F5E4D] text-white font-bold shadow-xs'
                      : 'bg-black/40 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Trailhead
                </button>
                <button
                  id="sidebar-toggle-crucible"
                  onClick={() => {
                    setTrack('crucible');
                    navigate('/crucible/workflow');
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-mono font-medium transition-all ${
                    isCrucible
                      ? 'bg-[#B8872F] text-[#14231E] font-bold shadow-xs'
                      : 'bg-black/40 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Crucible
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto">
            {currentLinks.map((item) => {
              const isActive =
                currentRoute === item.route ||
                (item.route === '/coding' && currentRoute.startsWith('/coding')) ||
                (item.route === '/aptitude' && currentRoute.startsWith('/aptitude'));
              const Icon = item.icon;

              return (
                <button
                  key={item.route}
                  id={`nav-link-${item.route.replace(/[\/:]/g, '-')}`}
                  onClick={() => handleLinkClick(item.route)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group focus:outline-none ${
                    isActive
                      ? isCrucible
                        ? 'bg-[#E8622C] text-[#211D1B] font-bold shadow-sm'
                        : 'bg-[#1F5E4D] text-white font-bold shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F7F8F5] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive
                          ? isCrucible
                            ? 'text-[#14231E]'
                            : 'text-white'
                          : isCrucible
                          ? 'text-[#B8872F]'
                          : 'text-[#B8872F]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isActive
                          ? 'bg-black/20 text-[#14231E]'
                          : 'bg-[#B8872F]/20 text-[#B8872F] border border-[#B8872F]/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Skill Graph & Placement Readiness Action */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <button
            id="sidebar-readiness-button"
            onClick={() => {
              navigate('/readiness');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
              isCrucible
                ? 'bg-[#211D1B] border-[#B8872F]/50 hover:border-[#B8872F] text-[#F7F8F5]'
                : 'bg-[#1F3A34] border-[#C9962C]/50 hover:border-[#C9962C] text-[#F7F8F5]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Target
                className={`w-4 h-4 ${
                  isCrucible ? 'text-[#B8872F]' : 'text-[#B8872F]'
                }`}
              />
              <div className="text-left">
                <div className="text-[10px] text-[#DDE4DE]/75">MY READINESS</div>
                <div className="font-bold font-mono">Placement Readiness</div>
              </div>
            </div>
            <span
              className={`text-sm font-bold font-mono ${
                isCrucible ? 'text-[#B8872F]' : 'text-[#B8872F]'
              }`}
            >
              {profile.readinessScore}%
            </span>
          </button>

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-2 justify-center p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors text-xs font-mono mt-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>

          <div className="text-[10px] font-mono text-center text-[#64748B] pt-2">
            CareerOS • 2026 Batch NIT-CSE
          </div>
        </div>
      </aside>
    </>
  );
};

