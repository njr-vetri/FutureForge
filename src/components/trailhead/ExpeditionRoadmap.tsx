import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Milestone,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  Calendar,
  Compass,
  Circle,
} from 'lucide-react';

interface Drill {
  id: string;
  title: string;
  completed: boolean;
  why?: string;
}

interface Sprint {
  week: number;
  title: string;
  status: 'completed' | 'in-progress' | 'locked';
  score: number;
  drills: Drill[];
}

export const ExpeditionRoadmap: React.FC = () => {
  const { profile, navigate } = useApp();

  const [sprints, setSprints] = useState<Sprint[]>([]);

  useEffect(() => {
    if (!profile.skills) return;

    // Sort skills by score ascending (weakest first)
    const sortedSkills = [...profile.skills].sort((a, b) => a.score - b.score);

    const generatedSprints: Sprint[] = [
      {
        week: 1,
        title: sortedSkills[0]?.name || 'Foundations',
        status: 'completed',
        score: sortedSkills[0]?.score || 95,
        drills: [
          { id: 'w1d1', title: 'Conceptual Fundamentals', completed: true, why: `Because your ${sortedSkills[0]?.name || 'Foundations'} accuracy is ${sortedSkills[0]?.score || 95}%` },
          { id: 'w1d2', title: 'Pattern Recognition', completed: true },
          { id: 'w1d3', title: 'Speed Drills', completed: true },
        ],
      },
      {
        week: 2,
        title: sortedSkills[1]?.name || 'Graph Traversal',
        status: 'completed',
        score: sortedSkills[1]?.score || 88,
        drills: [
          { id: 'w2d1', title: 'Advanced Traversal', completed: true, why: `Because your ${sortedSkills[1]?.name || 'Graph'} accuracy is ${sortedSkills[1]?.score || 88}%` },
          { id: 'w2d2', title: 'Edge Cases & Optimization', completed: true },
          { id: 'w2d3', title: 'Mock Technical Interview', completed: false },
        ],
      },
      {
        week: 3,
        title: sortedSkills[2]?.name || 'Aptitude & Screening',
        status: 'completed',
        score: sortedSkills[2]?.score || 92,
        drills: [
          { id: 'w3d1', title: 'Quantitative Speed Run', completed: false, why: `Because your ${sortedSkills[2]?.name || 'Aptitude'} accuracy is ${sortedSkills[2]?.score || 92}%` },
          { id: 'w3d2', title: 'Verbal Precision', completed: false },
          { id: 'w3d3', title: 'Logical Deduction', completed: false },
        ],
      },
      {
        week: 4,
        title: sortedSkills[3]?.name || 'Systems & Concurrency',
        status: 'completed',
        score: sortedSkills[3]?.score || 80,
        drills: [
          { id: 'w4d1', title: 'Architecture Patterns', completed: false, why: `Because your ${sortedSkills[3]?.name || 'Systems'} accuracy is ${sortedSkills[3]?.score || 80}%` },
          { id: 'w4d2', title: 'Concurrency & Locking', completed: false },
          { id: 'w4d3', title: 'ATS Resume Audit', completed: false },
        ],
      },
      {
        week: 5,
        title: 'Crucible Gate: 3-Phase Live Trial',
        status: 'in-progress',
        score: 74,
        drills: [
          { id: 'w5d1', title: 'Continuous Scroll-Reveal Workflow', completed: false },
          { id: 'w5d2', title: 'Roast My Repo', completed: false },
          { id: 'w5d3', title: '60s Spoken Mic Defense', completed: false },
        ],
      },
      {
        week: 6,
        title: 'Placement Day Summit & Final Board',
        status: 'locked',
        score: 0,
        drills: [
          { id: 'w6d1', title: '2x FAANG Technical Rounds', completed: false },
          { id: 'w6d2', title: 'Executive Offer Letter Negotiation', completed: false },
        ],
      },
    ];

    setSprints(generatedSprints);
  }, [profile.skills]);

  const toggleDrill = (sprintWeek: number, drillId: string) => {
    setSprints(prev => 
      prev.map(sprint => {
        if (sprint.week === sprintWeek) {
          return {
            ...sprint,
            drills: sprint.drills.map(d => 
              d.id === drillId ? { ...d, completed: !d.completed } : d
            )
          };
        }
        return sprint;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 space-y-6 selection:bg-[#C9962C]/30 font-sans">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD4C0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1F3A34] text-[#C9962C] font-semibold">
              <Milestone className="w-3.5 h-3.5" />
              EXPEDITION ROADMAP
            </span>
            <span className="text-xs font-mono text-[#1A1D1B]/60 uppercase tracking-widest">
              PERSONALIZED PLACEMENT ASCENT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1D1B]">
            Your Skill-Calibrated Milestones
          </h1>
        </div>
      </div>

      {/* Sprints Timeline List */}
      <div className="max-w-5xl mx-auto space-y-4">
        {sprints.map((sprint) => {
          const isComp = sprint.status === 'completed';
          const isInProg = sprint.status === 'in-progress';
          
          const completedCount = sprint.drills.filter(d => d.completed).length;
          const totalCount = sprint.drills.length;

          return (
            <div
              key={sprint.week}
              className={`p-6 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-6 shadow-sm ${
                isComp
                  ? 'bg-[#FAF8F2] border-[#DCD4C0]'
                  : isInProg
                  ? 'bg-[#1F3A34] text-[#EFE9D8] border-[#C9962C]'
                  : 'bg-white/40 border-[#DCD4C0]/60 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`w-10 h-10 rounded-xl font-mono font-bold flex items-center justify-center text-sm shrink-0 ${
                    isComp
                      ? 'bg-[#C9962C] text-[#1A1D1B]'
                      : isInProg
                      ? 'bg-[#E8622C] text-[#211D1B]'
                      : 'bg-black/10 text-[#1A1D1B]/40'
                  }`}
                >
                  {sprint.week}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-mono font-bold uppercase ${
                        isInProg ? 'text-[#C9962C]' : 'text-[#1F3A34]'
                      }`}
                    >
                      WEEK 0{sprint.week} Â· {sprint.status.toUpperCase()}
                    </span>
                    {isComp && (
                      <span className="text-xs font-mono text-emerald-700 font-semibold">
                        (Score: {sprint.score}%)
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-display font-bold mb-4">{sprint.title}</h3>
                  
                  <div className="space-y-3">
                    {sprint.drills.map((d) => (
                      <div 
                        key={d.id}
                        onClick={() => toggleDrill(sprint.week, d.id)}
                        className={`flex flex-col gap-1 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          isInProg
                            ? 'bg-[#162B26] border-[#2A4D45] hover:border-[#C9962C]/50'
                            : 'bg-white border-[#DCD4C0] hover:border-[#1F3A34]/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {d.completed ? (
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isInProg ? 'text-[#C9962C]' : 'text-emerald-600'}`} />
                          ) : (
                            <Circle className={`w-4 h-4 shrink-0 ${isInProg ? 'text-[#EFE9D8]/40' : 'text-[#1A1D1B]/30'}`} />
                          )}
                          <span className={`text-sm font-medium ${d.completed ? 'line-through opacity-60' : ''}`}>
                            {d.title}
                          </span>
                        </div>
                        {d.why && (
                          <div className={`text-[10px] font-mono pl-6 ${isInProg ? 'text-[#C9962C]/80' : 'text-[#1F3A34]/70'}`}>
                            {d.why}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className={`mt-4 text-xs font-mono font-semibold ${isInProg ? 'text-[#EFE9D8]/60' : 'text-[#1A1D1B]/50'}`}>
                    {completedCount}/{totalCount} tasks complete
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 sm:pt-2">
                {isInProg ? (
                  <button
                    onClick={() => navigate('/crucible/workflow')}
                    className="px-5 py-2.5 rounded-xl bg-[#E8622C] text-[#211D1B] font-bold font-mono text-xs hover:bg-[#F2B705] transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>Enter Crucible Gate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : isComp ? (
                  <button
                    onClick={() => navigate('/coding')}
                    className="px-4 py-2 rounded-xl border border-[#DCD4C0] text-xs font-mono font-semibold hover:bg-white text-[#1F3A34] bg-[#EFE9D8]/50 shadow-sm transition-colors"
                  >
                    Review Drills
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-mono text-[#1A1D1B]/50 bg-white/50 px-3 py-1.5 rounded-lg border border-[#DCD4C0]/50">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
