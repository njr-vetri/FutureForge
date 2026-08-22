import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X, Target, Shield } from "lucide-react";

interface DonutChartProps { value: number; size?: number; strokeWidth?: number; color: string; bgColor?: string; label?: string; }
interface SkillBarProps { name: string; score: number; target: number; color: string; bgColor: string; }

const DonutChart: React.FC<DonutChartProps> = ({ value, size = 80, strokeWidth = 9, color, bgColor = "rgba(255,255,255,0.08)", label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
          style={{ fill: color, fontSize: size*0.2, fontWeight: 700, fontFamily: "monospace",
            transform: `rotate(90deg)`, transformOrigin: `${size/2}px ${size/2}px` }}>
          {value}%
        </text>
      </svg>
      {label && <span style={{ fontSize: 10 }} className="font-mono font-semibold text-center leading-tight opacity-80">{label}</span>}
    </div>
  );
};

const SkillBar: React.FC<SkillBarProps> = ({ name, score, target, color, bgColor }) => {
  const exceeds = score >= target;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{name}</span>
        <div className="flex items-center gap-2 font-mono">
          <span style={{ color }} className="font-bold">{score}%</span>
          <span className="opacity-40 text-[10px]">min {target}%</span>
        </div>
      </div>
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: bgColor }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: exceeds ? color : "#E8622C" }} />
        <div className="absolute top-0 bottom-0 w-0.5 opacity-60"
          style={{ left: `${target}%`, background: "#fff" }} />
      </div>
    </div>
  );
};

export const SkillGraphModal = () => {
  const { isSkillGraphOpen, setIsSkillGraphOpen, profile, track } = useApp();
  const [activeTab, setActiveTab] = useState("chart");
  if (!isSkillGraphOpen) return null;
  const isCrucible = track === "crucible";
  const categories = ["Algorithms", "System Design", "Aptitude", "Communication", "Projects"];
  const chartColors = ["#1F9E7A", "#C9962C", "#2E6E8E", "#E8622C", "#7C3AED"];
  const categoryScores = categories.map((cat, i) => {
    const skillsInCat = profile.skills.filter((s) => s.category === cat);
    const avg = Math.round(skillsInCat.reduce((acc, s) => acc + s.score, 0) / (skillsInCat.length || 1));
    return { label: cat, value: avg, color: chartColors[i] };
  });
  const profileFields = [
    profile.name,
    profile.phone,
    profile.location,
    profile.college,
    profile.degree,
    profile.branch,
    profile.batch,
    profile.bio,
    profile.targetRoles?.[0],
    profile.github,
    profile.linkedin,
    profile.portfolio,
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const strongestCategory = [...categoryScores].sort((a, b) => b.value - a.value)[0];
  const declaredStrengths = [
    ...(profile.strongLanguages || []),
    ...(profile.strongFrameworks || []),
  ];
  const graphHasProfileSignal = profile.skills.some((skill) =>
    ["Profile Completeness", "Portfolio Evidence", "Framework Confidence", "Language Foundation", "Academic Baseline"].includes(skill.name)
  );
  const total = categoryScores.reduce((a, c) => a + c.value, 0);
  let cumulativeAngle = 0;
  const slices = categoryScores.map((cat) => {
    const pct = cat.value / (total || 1);
    const startAngle = cumulativeAngle;
    cumulativeAngle += pct * 360;
    return { ...cat, pct, startAngle, endAngle: cumulativeAngle };
  });
  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const describeArc = (cx, cy, r, startAngle, endAngle) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
  };
  const surface = isCrucible ? "bg-[#211D1B] text-[#EFE9D8] border-[#4A5A63]" : "bg-[#FAF8F2] text-[#1A1D1B] border-[#DCD4C0]";
  const cardBg = isCrucible ? "bg-[#161311] border-[#4A5A63]/50" : "bg-white border-[#DCD4C0]";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsSkillGraphOpen(false)}>
      <div id="skill-graph-modal-content" onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl rounded-2xl p-6 sm:p-8 shadow-xl border ${surface} max-h-[92vh] overflow-y-auto`}>
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-current/15">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isCrucible ? "bg-[#E8622C]/20 text-[#E8622C]" : "bg-[#1F3A34] text-[#C9962C]"}`}>
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono opacity-70">CANDIDATE INTELLIGENCE</div>
              <h2 className="text-2xl font-display font-bold">Verified Skill Matrix & Readiness</h2>
            </div>
          </div>
          <button id="close-skill-graph-modal" onClick={() => setIsSkillGraphOpen(false)}
            className="p-1.5 rounded-lg hover:bg-black/10 transition-colors focus:outline-none" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`grid grid-cols-3 gap-4 p-4 rounded-xl mb-6 border ${cardBg}`}>
          <div>
            <span className="text-[11px] font-mono opacity-70 uppercase">Profile-Based Readiness</span>
            <div className={`text-3xl font-mono font-bold mt-0.5 ${isCrucible ? "text-[#E8622C]" : "text-[#1F3A34]"}`}>{profile.readinessScore}%</div>
            <span className="text-xs font-medium text-emerald-600">
              {graphHasProfileSignal ? "Updated from profile details" : "Complete profile to calibrate"}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono opacity-70 uppercase">Profile Fields</span>
            <div className="text-2xl font-mono font-bold mt-0.5">{completedFields}/{profileFields.length}</div>
            <span className="text-xs font-mono opacity-60">
              {profile.targetRoles?.[0] || "Target role not set"}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-mono opacity-70 uppercase">Declared Signal</span>
            <div className="text-base font-semibold truncate mt-1">
              {declaredStrengths[0] || strongestCategory?.label || "Pending"}
            </div>
            <span className="text-xs font-mono opacity-60">
              {declaredStrengths.length ? `${declaredStrengths.length} strength${declaredStrengths.length === 1 ? "" : "s"} entered` : "Add languages/frameworks"}
            </span>
          </div>
        </div>
        <div className={`flex gap-1 p-1 rounded-xl mb-6 ${isCrucible ? "bg-[#161311]" : "bg-[#EFE9D8]"}`}>
          {["chart", "detail"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${activeTab === tab
                ? isCrucible ? "bg-[#E8622C] text-[#211D1B]" : "bg-[#1F3A34] text-[#EFE9D8]"
                : "opacity-60 hover:opacity-80"}`}>
              {tab === "chart" ? "Skill Pie Chart" : "Detailed Breakdown"}
            </button>
          ))}
        </div>
        {activeTab === "chart" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="shrink-0 flex flex-col items-center gap-3">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {slices.map((slice, i) => (
                    <path key={i} d={describeArc(100, 100, 85, slice.startAngle, slice.endAngle)}
                      fill={slice.color} stroke={isCrucible ? "#211D1B" : "#FAF8F2"} strokeWidth="2" opacity="0.9" />
                  ))}
                  <circle cx="100" cy="100" r="45" fill={isCrucible ? "#211D1B" : "#FAF8F2"} />
                  <text x="100" y="95" textAnchor="middle" dominantBaseline="middle"
                    style={{ fill: isCrucible ? "#EFE9D8" : "#1A1D1B", fontSize: 22, fontWeight: 700, fontFamily: "monospace" }}>
                    {profile.readinessScore}%
                  </text>
                  <text x="100" y="115" textAnchor="middle" dominantBaseline="middle"
                    style={{ fill: isCrucible ? "#EFE9D8" : "#1A1D1B", fontSize: 9, fontFamily: "monospace", opacity: 0.6 }}>
                    READINESS
                  </text>
                </svg>
                <span className="text-xs font-mono opacity-60">Overall skill distribution</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
                {categoryScores.map((cat) => (
                  <div key={cat.label} className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${cardBg}`}>
                    <DonutChart value={cat.value} size={72} strokeWidth={8} color={cat.color} />
                    <div className="text-[10px] font-mono font-bold opacity-80 uppercase tracking-wide text-center">{cat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${cardBg}`}>
              <div className="text-[10px] font-mono font-bold uppercase opacity-60 mb-3 tracking-wider">SKILL CATEGORY LEGEND</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {slices.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="text-xs font-mono">{s.label}</span>
                    <span className="text-xs font-mono font-bold ml-auto" style={{ color: s.color }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === "detail" && (
          <div className="space-y-6">
            {categories.map((cat, ci) => {
              const skillsInCat = profile.skills.filter((s) => s.category === cat);
              const avgScore = Math.round(skillsInCat.reduce((acc, s) => acc + s.score, 0) / (skillsInCat.length || 1));
              return (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: chartColors[ci] }} />
                    <span className="text-sm font-semibold font-display">{cat}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded"
                      style={{ background: chartColors[ci] + "22", color: chartColors[ci] }}>Avg: {avgScore}%</span>
                  </div>
                  <div className={`p-4 rounded-xl border space-y-3 ${cardBg}`}>
                    {skillsInCat.length ? (
                      skillsInCat.map((s) => (
                        <SkillBar key={s.name} name={s.name} score={s.score} target={s.target}
                          color={chartColors[ci]} bgColor={isCrucible ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"} />
                      ))
                    ) : (
                      <div className="text-xs font-mono opacity-60">
                        No profile signal entered for this category yet.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-8 pt-4 border-t border-current/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 opacity-70 font-mono">
            <Shield className="w-4 h-4" />
            <span>Profile-derived estimate. Verified scores appear after real assessments.</span>
          </div>
          <button id="modal-confirm-continue" onClick={() => setIsSkillGraphOpen(false)}
            className={`px-5 py-2 rounded-lg font-medium text-xs transition-colors ${
              isCrucible ? "bg-[#E8622C] text-[#211D1B] hover:bg-[#F2B705]" : "bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26]"}`}>
            Back to Assessment
          </button>
        </div>
      </div>
    </div>
  );
};
