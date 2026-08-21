import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Award,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { profile } = useApp();
  const [activeBranch, setActiveBranch] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const rawMockUsers = [
    { id: '1', name: 'Priya Narang', branch: 'CSE', readiness: 96, solved: 44, streak: 22, badges: 'Crucible Titan', trend: 1 },
    { id: '2', name: 'Rohan Deshmukh', branch: 'ECE', readiness: 93, solved: 41, streak: 19, badges: 'Algorithmic Master', trend: -1 },
    { id: '3', name: 'Ananya Roy', branch: 'CSE', readiness: 89, solved: 39, streak: 16, badges: 'Concurrency Pro', trend: 0 },
    { id: '5', name: 'Vikram Mehta', branch: 'IT', readiness: 79, solved: 35, streak: 12, badges: 'Aptitude Ace', trend: 2 },
    { id: '6', name: 'Sneha Patel', branch: 'CSE', readiness: 77, solved: 33, streak: 10, badges: 'System Builder', trend: -2 },
    { id: '7', name: 'Karthik Iyer', branch: 'ECE', readiness: 74, solved: 30, streak: 8, badges: 'Trailhead Explorer', trend: 1 },
    { id: '8', name: 'Rahul Singh', branch: 'IT', readiness: 65, solved: 22, streak: 4, badges: 'Code Novice', trend: 0 },
    { id: '9', name: 'Neha Gupta', branch: 'ECE', readiness: 82, solved: 36, streak: 11, badges: 'Fast Solver', trend: 3 },
    { id: '10', name: 'Amit Kumar', branch: 'CSE', readiness: 88, solved: 38, streak: 15, badges: 'Bug Hunter', trend: -1 },
  ];

  // Helper to map branch name
  const getBranchShort = (longName: string) => {
    if (longName.includes('Computer Science')) return 'CSE';
    if (longName.includes('Electronics')) return 'ECE';
    if (longName.includes('Information')) return 'IT';
    return 'CSE'; // fallback
  };

  const branches = ['All', 'CSE', 'ECE', 'IT'];

  const rankedUsers = useMemo(() => {
    const currentUser = {
      id: profile.id,
      name: `${profile.name} (You)`,
      branch: getBranchShort(profile.branch),
      readiness: profile.readinessScore,
      solved: profile.trailheadCompletedWaypoints * 8, 
      streak: profile.currentStreakDays,
      badges: profile.crucibleBadges[0] || 'Trailblazer',
      trend: 2, 
      isUser: true,
    };

    const combined = [...rawMockUsers, currentUser];
    
    // Sort descending by readiness
    combined.sort((a, b) => b.readiness - a.readiness);
    
    // Assign ranks
    return combined.map((u, i) => ({ ...u, rank: i + 1 }));
  }, [profile]);

  const filteredUsers = useMemo(() => {
    if (activeBranch === 'All') return rankedUsers;
    return rankedUsers.filter(u => u.branch === activeBranch);
  }, [rankedUsers, activeBranch]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentUserData = filteredUsers.find(u => u.isUser);
  const isUserVisibleOnPage = currentUsers.some(u => u.isUser);
  const shouldPinUser = currentUserData && !isUserVisibleOnPage;

  // Render Trend Indicator
  const renderTrend = (trend: number) => {
    if (trend > 0) return <span className="flex items-center gap-0.5 text-emerald-600"><TrendingUp className="w-3 h-3" />{trend}</span>;
    if (trend < 0) return <span className="flex items-center gap-0.5 text-rose-600"><TrendingDown className="w-3 h-3" />{Math.abs(trend)}</span>;
    return <span className="flex items-center gap-0.5 text-[#1A1D1B]/40"><Minus className="w-3 h-3" /></span>;
  };

  const renderRankBadge = (rank: number) => {
    if (rank === 1) return '🥇 #1';
    if (rank === 2) return '🥈 #2';
    if (rank === 3) return '🥉 #3';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 space-y-6 selection:bg-[#C9962C]/30 font-sans">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD4C0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1F3A34] text-[#C9962C] font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              BATCH LEADERBOARD
            </span>
            <span className="text-xs font-mono text-[#1A1D1B]/60 uppercase tracking-widest">
              NATIONAL INSTITUTE OF TECHNOLOGY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1D1B]">
            Placement Velocity Rankings
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        {/* Branch Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {branches.map(b => (
            <button
              key={b}
              onClick={() => { setActiveBranch(b); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-sm ${
                activeBranch === b 
                  ? 'bg-[#1F3A34] text-[#EFE9D8] border border-[#1F3A34]' 
                  : 'bg-white text-[#1A1D1B]/70 border border-[#DCD4C0] hover:border-[#1F3A34]/50'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#1F3A34] text-[#EFE9D8] uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-2">Trend</th>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4 text-center">Readiness %</th>
                <th className="py-3.5 px-4 text-center">Solved</th>
                <th className="py-3.5 px-4 text-center">Streak</th>
                <th className="py-3.5 px-4">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCD4C0]">
              {currentUsers.map((c) => (
                <tr
                  key={c.id}
                  className={`transition-colors ${
                    c.isUser ? 'bg-[#C9962C]/15 font-bold' : 'hover:bg-black/5'
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-sm">{renderRankBadge(c.rank)}</td>
                  <td className="py-3.5 px-2 font-bold">{renderTrend(c.trend)}</td>
                  <td className="py-3.5 px-4 font-semibold text-xs">{c.name}</td>
                  <td className="py-3.5 px-4 text-[#1A1D1B]/70">{c.branch}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#1F3A34] text-sm">{c.readiness}%</td>
                  <td className="py-3.5 px-4 text-center">{c.solved}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#C9962C]">{c.streak}d</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#1F3A34]/10 text-[#1F3A34] border border-[#1F3A34]/20 whitespace-nowrap">
                      <Award className="w-3 h-3 text-[#C9962C]" />
                      {c.badges}
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Pinned User Row */}
              {shouldPinUser && (
                <>
                  <tr className="bg-[#1F3A34]/5 border-t-[3px] border-[#C9962C]/30">
                    <td colSpan={8} className="py-1 px-4 text-center text-[10px] text-[#1A1D1B]/50 font-bold tracking-widest uppercase">
                      ... YOUR RANKING ...
                    </td>
                  </tr>
                  <tr className="bg-[#C9962C]/15 font-bold transition-colors">
                    <td className="py-3.5 px-4 font-bold text-sm">{renderRankBadge(currentUserData.rank)}</td>
                    <td className="py-3.5 px-2 font-bold">{renderTrend(currentUserData.trend)}</td>
                    <td className="py-3.5 px-4 font-semibold text-xs">{currentUserData.name}</td>
                    <td className="py-3.5 px-4 text-[#1A1D1B]/70">{currentUserData.branch}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#1F3A34] text-sm">{currentUserData.readiness}%</td>
                    <td className="py-3.5 px-4 text-center">{currentUserData.solved}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#C9962C]">{currentUserData.streak}d</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#1F3A34]/10 text-[#1F3A34] border border-[#1F3A34]/20 whitespace-nowrap">
                        <Award className="w-3 h-3 text-[#C9962C]" />
                        {currentUserData.badges}
                      </span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="md:hidden space-y-3">
          {currentUsers.map((c) => (
            <div key={c.id} className={`p-4 rounded-xl border flex items-center justify-between shadow-sm ${c.isUser ? 'bg-[#C9962C]/15 border-[#C9962C]/40' : 'bg-[#FAF8F2] border-[#DCD4C0]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#DCD4C0] flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-xs">
                  {c.rank}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1A1D1B] flex items-center gap-2">
                    {c.name} {renderTrend(c.trend)}
                  </div>
                  <div className="text-[11px] font-mono text-[#1A1D1B]/60 uppercase tracking-wide">
                    {c.branch} • Streak: {c.streak}d
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xl font-display font-bold text-[#1F3A34]">{c.readiness}%</div>
                <div className="text-[9px] font-mono text-[#1A1D1B]/40 uppercase tracking-widest">Readiness</div>
              </div>
            </div>
          ))}

          {shouldPinUser && (
            <>
              <div className="flex items-center justify-center gap-2 py-1 opacity-50">
                <div className="h-px bg-[#1F3A34] flex-1"></div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Your Ranking</span>
                <div className="h-px bg-[#1F3A34] flex-1"></div>
              </div>
              <div className="p-4 rounded-xl border bg-[#C9962C]/15 border-[#C9962C]/40 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#C9962C] flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-xs text-[#1F3A34]">
                    {currentUserData.rank}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#1A1D1B] flex items-center gap-2">
                      {currentUserData.name} {renderTrend(currentUserData.trend)}
                    </div>
                    <div className="text-[11px] font-mono text-[#1A1D1B]/60 uppercase tracking-wide">
                      {currentUserData.branch} • Streak: {currentUserData.streak}d
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-display font-bold text-[#1F3A34]">{currentUserData.readiness}%</div>
                  <div className="text-[9px] font-mono text-[#1A1D1B]/40 uppercase tracking-widest">Readiness</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white border border-[#DCD4C0] rounded-xl px-4 py-2 shadow-sm">
            <span className="text-xs font-mono text-[#1A1D1B]/60">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#DCD4C0] hover:bg-[#F7F8F5] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#DCD4C0] hover:bg-[#F7F8F5] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
