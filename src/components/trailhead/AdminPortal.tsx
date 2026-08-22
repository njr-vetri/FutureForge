import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Target,
  ArrowRight,
  Code2,
  BrainCircuit,
  MessageSquareCode,
  FileText,
  GitBranch,
  Flame,
  CheckCircle2,
  Circle,
  ArrowUpRight,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { navigate, profile, setIsSkillGraphOpen, setTrack } = useApp();
  const [readinessScore, setReadinessScore] = useState(0);

  // Count up animation for readiness score
  useEffect(() => {
    const target = profile.readinessScore || 79;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setReadinessScore(current);
      if (current >= target) {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [profile.readinessScore]);

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 space-y-8 selection:bg-[#C9962C]/30 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DCD4C0] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#1F3A34] text-[#C9962C] font-bold tracking-widest uppercase">
              <Target className="w-3 h-3" />
              My Placement Readiness
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-[#1A1D1B] tracking-tight">
            See where you stand,
            <span className="block text-[#1F3A34]">what needs improvement, and what to do next.</span>
          </h1>
        </div>

        {/* Top Readiness Score Card */}
        <div className="shrink-0 flex items-center gap-6 bg-white p-4 rounded-2xl border border-[#DCD4C0] shadow-sm">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-[#EFE9D8]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-[#1F3A34] transition-all duration-1000 ease-out" strokeDasharray={`${readinessScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xl text-[#1F3A34]">
              {readinessScore}%
            </div>
          </div>
          <div>
            <div className="font-bold text-sm mb-1 uppercase tracking-wider font-mono text-[#1A1D1B]/60">Your Overall Score</div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex mb-1">
              <TrendingUp className="w-3 h-3" />
              +8% this month
            </div>
            <p className="text-[11px] text-[#1A1D1B]/60 leading-tight max-w-[150px]">
              You're making progress. Focus on your remaining skill gaps to become placement-ready.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Performance Overview & Skill Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Breakdown */}
            <div className="bg-[#FAF8F2] rounded-2xl p-6 border border-[#DCD4C0] shadow-sm">
              <h2 className="text-lg font-display font-bold mb-5 flex items-center gap-2">
                <BarChart3Icon className="w-5 h-5 text-[#1F3A34]" /> Performance Overview
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Coding', score: 82, icon: Code2, color: 'text-emerald-700', bg: 'bg-emerald-700' },
                  { label: 'Aptitude', score: 74, icon: BrainCircuit, color: 'text-amber-600', bg: 'bg-amber-500' },
                  { label: 'Tech Knowledge', score: 78, icon: GitBranch, color: 'text-emerald-600', bg: 'bg-emerald-600' },
                  { label: 'Interview', score: 68, icon: MessageSquareCode, color: 'text-rose-600', bg: 'bg-rose-500' },
                  { label: 'Resume', score: 85, icon: FileText, color: 'text-emerald-800', bg: 'bg-emerald-800' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-sm font-medium text-[#1A1D1B]">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      {stat.label}
                    </div>
                    <div className="flex items-center gap-3 w-1/2">
                      <div className="flex-1 h-1.5 bg-[#EFE9D8] rounded-full overflow-hidden">
                        <div className={`h-full ${stat.bg} rounded-full`} style={{ width: `${stat.score}%` }} />
                      </div>
                      <span className="text-xs font-mono font-bold w-8 text-right">{stat.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Profile Link */}
            <div className="bg-[#1F3A34] text-[#EFE9D8] rounded-2xl p-6 border border-[#162B26] shadow-sm flex flex-col justify-between relative overflow-hidden group cursor-pointer" onClick={() => setIsSkillGraphOpen(true)}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Target className="w-32 h-32 text-[#C9962C]" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-mono font-bold text-[#C9962C] uppercase tracking-widest mb-1">Interactive Matrix</div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Your Skill Profile</h2>
                <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-[200px]">
                  Explore your strengths in DSA, Web Dev, DBMS, and Communication via the radar chart.
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <button className="flex items-center gap-2 text-xs font-mono font-bold bg-[#C9962C] text-[#1F3A34] px-4 py-2 rounded-lg hover:bg-white transition-colors shadow-sm">
                  View Full Skill Graph
                </button>
                <ArrowRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </div>
            </div>
          </div>

          {/* Skills That Need Attention */}
          <div>
            <h2 className="text-lg font-display font-bold mb-4">Skills That Need Attention</h2>
            <div className="space-y-3">
              {[
                { title: 'DSA - Medium Problems', current: 62, target: 80, gap: 18, action: 'Practice Now', route: '/coding' },
                { title: 'System Design - Rate Limiting', current: 45, target: 70, gap: 25, action: 'Watch Video', route: '/video-hub' },
                { title: 'Behavioral Interviews (STAR)', current: 68, target: 85, gap: 17, action: 'Start Mock Interview', route: '/interview' },
              ].map((skill, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-[#DCD4C0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1A1D1B] mb-2">{skill.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                      <div className="flex items-center gap-1.5"><span className="text-[#1A1D1B]/50">Current:</span> <span className="font-bold">{skill.current}%</span></div>
                      <div className="flex items-center gap-1.5"><span className="text-[#1A1D1B]/50">Target:</span> <span className="font-bold">{skill.target}%</span></div>
                      <div className="flex items-center gap-1.5"><span className="text-[#1A1D1B]/50">Gap:</span> <span className="font-bold text-rose-600 bg-rose-50 px-1.5 rounded">-{skill.gap}%</span></div>
                    </div>
                  </div>
                  <button onClick={() => navigate(skill.route)} className="shrink-0 px-4 py-2 rounded-lg border border-[#1F3A34] text-[#1F3A34] hover:bg-[#1F3A34] hover:text-[#EFE9D8] text-xs font-mono font-bold transition-colors">
                    {skill.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Over Time Chart (CSS Mock) */}
          <div className="bg-[#FAF8F2] rounded-2xl p-6 border border-[#DCD4C0] shadow-sm">
            <h2 className="text-lg font-display font-bold mb-6">Your Progress Over Time</h2>
            <div className="relative h-48 w-full flex items-end justify-between px-2 pb-6 pt-10">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 opacity-20">
                <div className="border-t border-[#1A1D1B] border-dashed" />
                <div className="border-t border-[#1A1D1B] border-dashed" />
                <div className="border-t border-[#1A1D1B] border-dashed" />
                <div className="border-t border-[#1A1D1B] border-dashed" />
              </div>
              
              {/* Line segments using pseudo elements/borders for mock */}
              <div className="absolute inset-0 px-4 flex items-end justify-between pb-[38px] z-0">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polyline points="5,70 28,62 51,55 74,48 97,35" fill="none" stroke="#1F3A34" strokeWidth="2.5" className="animate-[dash_2s_ease-out_forwards]" strokeDasharray="200" strokeDashoffset="200" />
                  <style>{`@keyframes dash { to { stroke-dashoffset: 0; } }`}</style>
                </svg>
              </div>

              {[
                { month: 'Jan', val: 62 },
                { month: 'Feb', val: 67 },
                { month: 'Mar', val: 71 },
                { month: 'Apr', val: 75 },
                { month: 'May', val: 79 },
              ].map((dp, i) => (
                <div key={i} className="relative flex flex-col items-center group z-10">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A1D1B] text-white text-xs font-mono px-2 py-1 rounded shadow-lg pointer-events-none">
                    {dp.val}%
                  </div>
                  <div className={`w-3 h-3 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform ${i === 4 ? 'bg-[#C9962C] w-4 h-4' : 'bg-[#1F3A34]'}`} style={{ marginBottom: `${(dp.val - 50) * 2}px` }} />
                  <span className="text-xs font-mono font-bold text-[#1A1D1B]/60 absolute -bottom-6">{dp.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-5 border border-[#DCD4C0] shadow-sm">
            <div className="text-[10px] font-mono text-[#1A1D1B]/50 font-bold uppercase tracking-widest mb-3">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => navigate('/coding')} className="p-3 bg-[#FAF8F2] hover:bg-[#EFE9D8] rounded-xl border border-[#DCD4C0] flex flex-col items-center justify-center gap-2 text-xs font-semibold text-[#1A1D1B] transition-colors">
                <Code2 className="w-5 h-5 text-[#1F3A34]" /> Practice Coding
              </button>
              <button onClick={() => navigate('/aptitude')} className="p-3 bg-[#FAF8F2] hover:bg-[#EFE9D8] rounded-xl border border-[#DCD4C0] flex flex-col items-center justify-center gap-2 text-xs font-semibold text-[#1A1D1B] transition-colors">
                <BrainCircuit className="w-5 h-5 text-[#1F3A34]" /> Take Aptitude
              </button>
              <button onClick={() => navigate('/interview')} className="p-3 bg-[#FAF8F2] hover:bg-[#EFE9D8] rounded-xl border border-[#DCD4C0] flex flex-col items-center justify-center gap-2 text-xs font-semibold text-[#1A1D1B] transition-colors">
                <MessageSquareCode className="w-5 h-5 text-[#1F3A34]" /> Practice Interview
              </button>
              <button onClick={() => navigate('/resume')} className="p-3 bg-[#FAF8F2] hover:bg-[#EFE9D8] rounded-xl border border-[#DCD4C0] flex flex-col items-center justify-center gap-2 text-xs font-semibold text-[#1A1D1B] transition-colors">
                <FileText className="w-5 h-5 text-[#1F3A34]" /> Improve Resume
              </button>
            </div>
          </div>

          {/* Career Roadmap Preview */}
          <div className="bg-[#FAF8F2] rounded-2xl p-5 border border-[#DCD4C0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-[#1A1D1B]">Career Roadmap</h3>
              <button onClick={() => navigate('/roadmap')} className="text-xs font-mono font-bold text-[#1F3A34] hover:underline">Continue</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-600">Foundations</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-600">Coding Basics</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowRight className="w-5 h-5 text-[#1F3A34]" />
                <span className="text-sm font-bold text-[#1F3A34] bg-[#1F3A34]/5 px-2 py-0.5 rounded">DSA & Algorithms</span>
              </div>
              <div className="flex items-center gap-3">
                <Circle className="w-5 h-5 text-[#1A1D1B]/20" />
                <span className="text-sm font-medium text-[#1A1D1B]/40">Technical Interview</span>
              </div>
              <div className="flex items-center gap-3">
                <Circle className="w-5 h-5 text-[#1A1D1B]/20" />
                <span className="text-sm font-medium text-[#1A1D1B]/40">Placement Ready</span>
              </div>
            </div>
          </div>

          {/* What You Should Do Next */}
          <div className="bg-white rounded-2xl p-5 border border-[#1F3A34] shadow-sm border-l-4 border-l-[#1F3A34]">
            <h3 className="font-display font-bold text-[#1A1D1B] mb-3">What You Should Do Next</h3>
            <ul className="space-y-3 text-sm font-medium text-[#1A1D1B]/80 list-decimal list-inside marker:text-[#1F3A34] marker:font-mono marker:font-bold">
              <li>Complete 3 medium DSA problems</li>
              <li>Take a DBMS assessment</li>
              <li>Complete the next Trailhead waypoint</li>
            </ul>
            <button onClick={() => navigate('/coding')} className="w-full mt-4 py-2 bg-[#1F3A34] text-white text-xs font-mono font-bold rounded-lg hover:bg-[#162B26] transition-colors">
              Continue Learning
            </button>
          </div>

          {/* Crucible CTA */}
          <div className="bg-[#211D1B] text-[#F7F8F5] rounded-2xl p-5 border border-[#B8872F]/30 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Flame className="w-24 h-24 text-[#E8622C]" />
            </div>
            <div className="relative z-10">
              <h3 className="font-display font-bold text-lg mb-2 text-white">Ready for a harder challenge?</h3>
              <p className="text-xs text-white/60 mb-4 leading-relaxed">
                Enter the Crucible for a live, pressure-tested technical evaluation that combines reasoning and communication.
              </p>
              <button 
                onClick={() => {
                  setTrack('crucible');
                  navigate('/crucible/workflow');
                }}
                className="flex items-center gap-2 text-xs font-mono font-bold bg-[#E8622C] text-[#211D1B] px-4 py-2 rounded-lg hover:bg-white transition-colors shadow-sm"
              >
                <Flame className="w-4 h-4" /> Explore Crucible
              </button>
            </div>
          </div>

          {/* Opportunities That Match You */}
          <div className="bg-white rounded-2xl p-5 border border-[#DCD4C0] shadow-sm">
            <h3 className="font-display font-bold text-[#1A1D1B] mb-4">Opportunities That Match You</h3>
            <div className="space-y-3">
              <div className="p-3 border border-[#DCD4C0] rounded-xl hover:border-[#1F3A34] transition-colors cursor-pointer group" onClick={() => navigate('/jobs')}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1D1B] group-hover:text-[#1F3A34] flex items-center gap-1">
                      Software Engineer <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <span className="text-[11px] font-mono text-[#1A1D1B]/60">Google</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">78% Match</span>
                </div>
                <div className="text-[10px] text-[#1A1D1B]/50 mt-2 line-clamp-1">
                  Missing: Distributed Systems, Advanced Caching
                </div>
              </div>

              <div className="p-3 border border-[#DCD4C0] rounded-xl hover:border-[#1F3A34] transition-colors cursor-pointer group" onClick={() => navigate('/jobs')}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1D1B] group-hover:text-[#1F3A34] flex items-center gap-1">
                      Backend Developer <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <span className="text-[11px] font-mono text-[#1A1D1B]/60">Stripe</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">72% Match</span>
                </div>
                <div className="text-[10px] text-[#1A1D1B]/50 mt-2 line-clamp-1">
                  Missing: Ruby, API Security
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/jobs')} className="w-full text-center mt-3 text-xs font-mono font-bold text-[#1A1D1B]/50 hover:text-[#1A1D1B] transition-colors">
              View all matches on Job Board
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper Icon for the overview heading
const BarChart3Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);
