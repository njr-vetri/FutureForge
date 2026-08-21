import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, Target, Zap, Shield, Sparkles } from 'lucide-react';

export const SkillGraphModal: React.FC = () => {
  const { isSkillGraphOpen, setIsSkillGraphOpen, profile, track } = useApp();

  if (!isSkillGraphOpen) return null;

  const isCrucible = track === 'crucible';

  const categories = ['Algorithms', 'System Design', 'Aptitude', 'Communication', 'Projects'] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsSkillGraphOpen(false)}
    >
      <div
        id="skill-graph-modal-content"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl rounded-2xl p-6 sm:p-8 shadow-sm border ${
          isCrucible
            ? 'bg-[#211D1B] text-[#EFE9D8] border-[#4A5A63]'
            : 'bg-[#FAF8F2] text-[#1A1D1B] border-[#DCD4C0]'
        } max-h-[90vh] overflow-y-auto`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-current/15">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                isCrucible
                  ? 'bg-[#E8622C]/20 text-[#E8622C] border border-[#E8622C]/30'
                  : 'bg-[#1F3A34] text-[#C9962C]'
              }`}
            >
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono opacity-70">CANDIDATE INTELLIGENCE</div>
              <h2 className="text-2xl font-display font-bold">Verified Skill Matrix & Readiness</h2>
            </div>
          </div>

          <button
            id="close-skill-graph-modal"
            onClick={() => setIsSkillGraphOpen(false)}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Banner */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl mb-6 border ${
            isCrucible
              ? 'bg-[#161311] border-[#4A5A63]/50'
              : 'bg-[#EFE9D8] border-[#DCD4C0]'
          }`}
        >
          <div>
            <span className="text-[11px] font-mono opacity-70">PLACEMENT READINESS</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-3xl font-mono font-bold ${
                  isCrucible ? 'text-[#E8622C]' : 'text-[#1F3A34]'
                }`}
              >
                {profile.readinessScore}%
              </span>
              <span className="text-xs font-mono opacity-60">/ 100</span>
            </div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Tier-1 Placement Capable
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono opacity-70">VERIFIED DRILLS</span>
            <div className="text-2xl font-mono font-bold mt-0.5">38 Solved</div>
            <span className="text-xs font-mono opacity-60">14-Day Streak Active</span>
          </div>

          <div>
            <span className="text-[11px] font-mono opacity-70">STRONGEST DEFENSE</span>
            <div className="text-base font-semibold truncate mt-1">Quantitative & DB Indexing</div>
            <span className="text-xs font-mono opacity-60">91% Mastery Percentile</span>
          </div>
        </div>

        {/* Detailed Category Progress Bars */}
        <div className="space-y-6">
          {categories.map((cat) => {
            const skillsInCat = profile.skills.filter((s) => s.category === cat);
            const avgScore = Math.round(
              skillsInCat.reduce((acc, s) => acc + s.score, 0) / (skillsInCat.length || 1)
            );

            return (
              <div key={cat} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold tracking-wide font-display">
                      {cat}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                      Avg: {avgScore}%
                    </span>
                  </div>
                  <span className="text-xs font-mono opacity-70">Target: 90%</span>
                </div>

                <div className="space-y-2">
                  {skillsInCat.map((s) => {
                    const isExceeding = s.score >= s.target;
                    return (
                      <div
                        key={s.name}
                        className={`p-3 rounded-lg border text-xs ${
                          isCrucible
                            ? 'bg-[#2B2623] border-[#4A5A63]/60'
                            : 'bg-white border-[#DCD4C0]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-medium text-xs">{s.name}</span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-xs font-bold ${
                                isCrucible ? 'text-[#F2B705]' : 'text-[#C9962C]'
                              }`}
                            >
                              {s.score}%
                            </span>
                            <span className="font-mono text-[10px] opacity-60">
                              (Min {s.target}%)
                            </span>
                          </div>
                        </div>

                        {/* Bar with Marker */}
                        <div className="relative w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <div
                            style={{ width: `${s.score}%` }}
                            className={`h-full rounded-full transition-all duration-700 ${
                              isCrucible
                                ? isExceeding
                                  ? 'bg-[#F2B705]'
                                  : 'bg-[#E8622C]'
                                : isExceeding
                                ? 'bg-[#1F3A34]'
                                : 'bg-[#C9962C]'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-4 border-t border-current/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 opacity-80 font-mono">
            <Shield className="w-4 h-4" />
            <span>Cryptographically Verified Placement Record (College ID: 2026-NIT-CS88)</span>
          </div>

          <button
            id="modal-confirm-continue"
            onClick={() => setIsSkillGraphOpen(false)}
            className={`px-5 py-2 rounded-lg font-medium text-xs transition-colors ${
              isCrucible
                ? 'bg-[#E8622C] text-[#211D1B] hover:bg-[#F2B705]'
                : 'bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26]'
            }`}
          >
            Back to Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

