import React, { useMemo, useState } from "react";
import {
  ArrowUpRight, BarChart3, Flame, ShieldAlert, Target,
  ChevronDown, ChevronUp, Play, CalendarDays, X, Loader2
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import "./crucible.css";

const getGapTone = (gap: number) => {
  if (gap <= -18) return { label: "High Priority", bar: "#fb7185", badge: "rgba(244,63,94,0.18)", text: "#fb7185" };
  if (gap <= -6)  return { label: "Moderate Gap",  bar: "#f2b705", badge: "rgba(242,183,5,0.16)",  text: "#f2b705" };
  return             { label: "On Track",      bar: "#34d399", badge: "rgba(52,211,153,0.14)", text: "#34d399" };
};

const DonutChart = ({ value, target, size = 100, strokeWidth = 10, color, bgColor = "rgba(255,255,255,0.08)" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  
  const targetOffset = circumference - (target / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }} />
          
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#fff" strokeWidth={strokeWidth + 2}
          strokeLinecap="round" strokeDasharray={`2 ${circumference}`} strokeDashoffset={targetOffset} opacity="0.8" />
          
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
          style={{ fill: color, fontSize: size*0.22, fontWeight: 800, fontFamily: "monospace",
            transform: `rotate(90deg)`, transformOrigin: `${size/2}px ${size/2}px` }}>
          {value}%
        </text>
      </svg>
      <div className="absolute -bottom-2 text-[9px] font-mono font-bold bg-[#1a1715] px-1.5 py-0.5 rounded border border-white/10" style={{ color: "#efe9d8" }}>
        TARGET {target}%
      </div>
    </div>
  );
};

interface DayModalProps {
  item: { day: number; focus: string; drill?: string; deliverable: string; timeCommitment: string };
  onClose: () => void;
  onStart: () => void;
}

const DayModal: React.FC<DayModalProps> = ({ item, onClose, onStart }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
    <div className="w-full max-w-md rounded-2xl bg-[#1a1715] border border-[rgba(239,233,216,0.14)] p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#f2b705] text-[#211d1b]">Week {item.day}</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors text-[rgba(239,233,216,0.5)] hover:text-[#efe9d8]"><X size={16} /></button>
      </div>
      <h3 className="text-xl font-bold text-[#efe9d8] leading-tight">{item.focus}</h3>
      <div className="space-y-3 text-sm text-[rgba(239,233,216,0.72)] leading-relaxed">
        {item.drill && <div><span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[rgba(239,233,216,0.4)] mb-1">What to do</span>{item.drill}</div>}
        <div><span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[rgba(239,233,216,0.4)] mb-1">Deliverable</span>{item.deliverable}</div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[rgba(239,233,216,0.1)]">
        <span className="text-sm font-mono font-bold text-[#f2b705]">{item.timeCommitment}</span>
        <button onClick={onStart} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#e8622c] text-[#211d1b] font-bold text-sm hover:bg-[#f2b705] transition-colors">
          <Play size={14} /> Start Week
        </button>
      </div>
    </div>
  </div>
);

export const GapAnalyzer: React.FC = () => {
  const { showToast } = useApp();
  const [showAllGaps, setShowAllGaps] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Survey State
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [survey, setSurvey] = useState({
    targetRole: "Backend Engineer",
    targetCompany: "Google",
    experience: "0-6 months",
    dsa: "Barely remember",
    projects: "Basic projects only",
    systemDesign: "What's that?"
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:4000/api/crucible/gap-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "11111111-1111-1111-1111-111111111111",
          targetRole: survey.targetRole,
          company: survey.targetCompany,
          surveyAnswers: {
            experience: survey.experience,
            dsa: survey.dsa,
            projects: survey.projects,
            systemDesign: survey.systemDesign
          }
        })
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (e) {
      showToast("Failed to generate plan");
    }
    setIsGenerating(false);
  };

  if (!analysisResult) {
    return (
      <main className="crucible-screen gap-analyzer-screen">
        <section className="gap-shell max-w-2xl mx-auto">
          <header className="gap-header mb-8 text-center" style={{ flexDirection: "column", alignItems: "center" }}>
            <div className="crucible-kicker justify-center mx-auto mb-2">
              <Target size={14} />
              Placement Blueprint Survey
            </div>
            <h1 className="gap-h1">Assess Your Baseline</h1>
            <p className="gap-subtitle text-center mt-2 max-w-lg">
              Answer 4 quick questions so our AI can generate a precise 5-6 week personalized roadmap. No fake data, just real actionable steps.
            </p>
          </header>

          <div className="bg-[#161311] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-sm text-[#efe9d8] font-bold">
                Target Role
                <input type="text" value={survey.targetRole} onChange={e => setSurvey({...survey, targetRole: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#efe9d8] font-normal focus:border-[#f2b705] outline-none transition-colors" />
              </label>
              <label className="flex flex-col gap-2 text-sm text-[#efe9d8] font-bold">
                Target Company
                <input type="text" value={survey.targetCompany} onChange={e => setSurvey({...survey, targetCompany: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#efe9d8] font-normal focus:border-[#f2b705] outline-none transition-colors" />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-[#efe9d8] font-bold">
              How long have you been coding?
              <select value={survey.experience} onChange={e => setSurvey({...survey, experience: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#efe9d8] font-normal focus:border-[#f2b705] outline-none transition-colors">
                <option>0-6 months</option>
                <option>1-2 years</option>
                <option>3+ years</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-[#efe9d8] font-bold">
              How well do you remember Data Structures & Algorithms?
              <select value={survey.dsa} onChange={e => setSurvey({...survey, dsa: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#efe9d8] font-normal focus:border-[#f2b705] outline-none transition-colors">
                <option>Barely remember</option>
                <option>Somewhat familiar</option>
                <option>Solid, I can solve LeetCode mediums</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-[#efe9d8] font-bold">
              Have you built complex or full-stack applications?
              <select value={survey.projects} onChange={e => setSurvey({...survey, projects: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#efe9d8] font-normal focus:border-[#f2b705] outline-none transition-colors">
                <option>No</option>
                <option>Basic projects only</option>
                <option>Yes, production-grade systems</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-[#efe9d8] font-bold">
              How comfortable are you with System Design?
              <select value={survey.systemDesign} onChange={e => setSurvey({...survey, systemDesign: e.target.value})} className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#efe9d8] font-normal focus:border-[#f2b705] outline-none transition-colors">
                <option>What's that?</option>
                <option>Basic concepts (DBs, caching)</option>
                <option>I can design Netflix</option>
              </select>
            </label>

            <button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#e8622c] text-[#211d1b] font-bold hover:bg-[#f2b705] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Generating AI Roadmap...</> : "Generate My Custom Plan"}
            </button>
          </div>
        </section>
      </main>
    );
  }

  // Generate view variables from analysisResult
  const primaryDeficit = analysisResult.biggestSkillGap || analysisResult.skills?.[0] || { name: 'Algorithms', gap: -10 };
  const sortedCats = [...(analysisResult.skills || [])].sort((a: any, b: any) => a.gap - b.gap);
  
  const averageGap = Math.round(
    sortedCats.reduce((sum, c) => sum + Math.abs(Math.min(0, c.gap)), 0) / Math.max(1, sortedCats.length)
  );

  const visibleCats = showAllGaps ? sortedCats : sortedCats.slice(0, 3);
  const hasMore = sortedCats.length > 3;

  const selectedDayData = selectedDay !== null ? analysisResult.roadmap?.find((d: any) => d.day === selectedDay) : null;

  return (
    <main className="crucible-screen gap-analyzer-screen">
      <section className="gap-shell">

        {/* ── HEADER ── */}
        <header className="gap-header">
          <div>
            <div className="crucible-kicker">
              <Flame size={14} />
              Benchmark Matrix
            </div>
            <h1 className="gap-h1">Custom Action Plan</h1>
            <p className="gap-subtitle">Your personalized roadmap to conquer {analysisResult.targetRole} at {analysisResult.company}.</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors" onClick={() => setAnalysisResult(null)}>
            Retake Survey
          </button>
        </header>

        {/* ── SUMMARY ROW ── */}
        <div className="gap-summary-row">
          <div className="gap-summary-card featured">
            <Target size={18} className="gap-summary-icon" />
            <span className="gap-summary-label">Role Fit</span>
            <strong className="gap-summary-value">{analysisResult.candidateFitScore || analysisResult.roleFit || 0}%</strong>
            <span className="gap-summary-sub">{analysisResult.company} readiness</span>
          </div>
          <div className="gap-summary-card">
            <ShieldAlert size={18} className="gap-summary-icon" />
            <span className="gap-summary-label">Primary Gap</span>
            <strong className="gap-summary-value gap-summary-value--sm">{primaryDeficit?.name}</strong>
            <span className="gap-summary-sub">{Math.abs(primaryDeficit?.gap || 0)} pts below target</span>
          </div>
          <div className="gap-summary-card">
            <BarChart3 size={18} className="gap-summary-icon" />
            <span className="gap-summary-label">Average Gap</span>
            <strong className="gap-summary-value">{averageGap} pts</strong>
            <span className="gap-summary-sub">Avg closure needed</span>
          </div>
        </div>

        {/* ── SKILL GAP MAP (Using Cards & Donut Charts) ── */}
        <section className="gap-section-free">
          <div className="gap-section-head">
            <span>Skill Gap Map</span>
            <span className="gap-section-role">{analysisResult.company} · {analysisResult.targetRole}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCats.map((cat: any) => {
              const tone = getGapTone(cat.gap);
              return (
                <div key={cat.name} className="flex flex-col items-center text-center p-6 bg-[#161311] border border-white/5 rounded-2xl shadow-xl transition-transform hover:-translate-y-1">
                  <div className="mb-6 relative">
                    <DonutChart value={cat.candidate} target={cat.required} color={tone.bar} />
                  </div>
                  <h3 className="text-sm font-bold text-[#efe9d8] mb-2 leading-tight min-h-[40px] flex items-center justify-center">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#efe9d8]/50 line-clamp-2 mb-4 leading-relaxed min-h-[36px]">
                    {cat.explanation || cat.critique}
                  </p>
                  <div className="mt-auto w-full flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono uppercase font-bold" style={{ color: tone.text }}>{tone.label}</span>
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded" style={{ background: tone.badge, color: tone.text }}>
                      GAP {cat.gap > 0 ? `+${cat.gap}` : cat.gap}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <button className="w-full max-w-sm mx-auto mt-8 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 text-[#efe9d8]/80 text-sm font-bold hover:bg-white/10 hover:text-white transition-colors border border-white/10" onClick={() => setShowAllGaps((v) => !v)}>
              {showAllGaps ? (
                <><ChevronUp size={16} /> Show Less</>
              ) : (
                <><ChevronDown size={16} /> View All {sortedCats.length} Skill Gaps</>
              )}
            </button>
          )}
        </section>

        {/* ── PRIORITY CTA ── */}
        <div className="gap-priority-cta mt-12">
          <div className="gap-priority-label">
            <ArrowUpRight size={16} />
            Start Highest-Priority Fix
          </div>
          <div className="gap-priority-skill">{primaryDeficit?.name}</div>
          <button
            className="gap-priority-btn"
            onClick={() => showToast(`Sprint queued: ${primaryDeficit?.name}`)}
          >
            Begin Fix Now <ArrowUpRight size={15} />
          </button>
        </div>

        {/* ── SPRINT TIMELINE ── */}
        <section className="gap-section-free mt-12">
          <div className="gap-section-head">
            <span>{analysisResult.roadmap?.length || 6}-Week Placement Plan</span>
            <span className="gap-section-role"><CalendarDays size={13} /> {analysisResult.company}</span>
          </div>

          <div className="sprint-timeline">
            {analysisResult.roadmap?.map((item: any, idx: number) => (
              <React.Fragment key={item.day}>
                <button
                  className="sprint-day-node"
                  onClick={() => setSelectedDay(item.day)}
                  title={item.focus}
                >
                  <span className="sprint-day-badge">Week {item.day}</span>
                  <span className="sprint-day-focus">{item.focus}</span>
                  <span className="sprint-day-time">{item.timeCommitment}</span>
                </button>
                {idx < analysisResult.roadmap.length - 1 && (
                  <div className="sprint-connector" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="sprint-hint">Click any week to see the full tasks and deliverables.</p>
        </section>

      </section>

      {/* ── DAY MODAL ── */}
      {selectedDay !== null && selectedDayData && (
        <DayModal
          item={selectedDayData}
          onClose={() => setSelectedDay(null)}
          onStart={() => {
            showToast(`Sprint queued: Week ${selectedDayData.day} — ${selectedDayData.focus}`);
            setSelectedDay(null);
          }}
        />
      )}
    </main>
  );
};
