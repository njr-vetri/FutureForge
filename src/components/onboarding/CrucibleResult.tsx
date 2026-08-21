import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, ArrowRight, CheckCircle2, Code2, BrainCircuit, Target, Laptop } from 'lucide-react';

export const CrucibleResult: React.FC = () => {
  const { setTrack, setHasCompletedAssessment } = useApp();
  const [data, setData] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const saved = localStorage.getItem('crucible_assessment_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleEnterCrucible = () => {
    setHasCompletedAssessment(true);
    setTrack('crucible');
  };

  const getLabel = (id: string, defaultVal: string) => {
    if (!data[id] || data[id].length === 0) return defaultVal;
    return data[id].join(', ');
  };

  return (
    <div className="min-h-screen bg-[#14231E] text-white flex flex-col items-center justify-center p-6 selection:bg-[#B8872F]/30">
      <div className="w-full max-w-2xl relative animate-in zoom-in-95 duration-500">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#B8872F]/20 text-[#B8872F] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(184,135,47,0.3)]">
            <Flame className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Your Profile is Ready</h1>
          <p className="text-[#DDE4DE]/70 text-lg max-w-lg mx-auto">
            We'll use this information to calibrate your initial Crucible challenges. Your profile will evolve dynamically as you complete live assessments.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-10 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[#B8872F] mb-6 border-b border-white/10 pb-4">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="font-mono font-bold tracking-wider uppercase text-sm">Calibration Summary</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/5 rounded-lg text-[#DDE4DE]"><Code2 className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-[#DDE4DE]/50 font-mono mb-1 uppercase tracking-wider">Languages</div>
                <div className="font-semibold">{getLabel('languages', 'None Selected')}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/5 rounded-lg text-[#DDE4DE]"><BrainCircuit className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-[#DDE4DE]/50 font-mono mb-1 uppercase tracking-wider">Algorithms & CS</div>
                <div className="font-semibold text-sm leading-relaxed">
                  DSA: {getLabel('dsa', 'Unknown')} <br/>
                  Fundamentals: {getLabel('cs_fundamentals', 'None')}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/5 rounded-lg text-[#DDE4DE]"><Laptop className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-[#DDE4DE]/50 font-mono mb-1 uppercase tracking-wider">Development</div>
                <div className="font-semibold">{getLabel('development', 'None Selected')}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/5 rounded-lg text-[#DDE4DE]"><Target className="w-5 h-5" /></div>
              <div>
                <div className="text-xs text-[#DDE4DE]/50 font-mono mb-1 uppercase tracking-wider">Target Role</div>
                <div className="font-semibold">{getLabel('target_role', 'Not Specified')}</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleEnterCrucible}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#B8872F] text-[#14231E] font-bold font-mono text-lg hover:bg-white transition-all shadow-sm group"
        >
          Enter Crucible Workflow
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </div>
  );
};
