import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Code, BrainCircuit, Rocket, ChevronRight, X } from 'lucide-react';

const COMMON_LANGUAGES = ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'TypeScript', 'Ruby', 'C#'];
const COMMON_FRAMEWORKS = ['React', 'Node.js', 'Spring Boot', 'Django', 'Next.js', 'Express', 'Angular'];
const COMMON_WEAKNESSES = ['Dynamic Programming', 'System Design', 'SQL', 'Graphs', 'Trees', 'Aptitude', 'Behavioral Interviews'];

export const TrailheadOnboarding: React.FC = () => {
  const { profile, setProfile } = useApp();
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState(profile.targetRoles?.[0] || '');
  const [strongLangs, setStrongLangs] = useState<string[]>([]);
  const [strongFrames, setStrongFrames] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);

  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };

  const handleComplete = () => {
    setProfile(prev => ({
      ...prev,
      targetRoles: targetRole ? [targetRole] : prev.targetRoles,
      strongLanguages: strongLangs,
      strongFrameworks: strongFrames,
      weaknesses: weaknesses,
      hasCompletedOnboarding: true,
    }));
  };

  if (profile.hasCompletedOnboarding) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1D1B]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#EFE9D8] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#DCD4C0]">
        
        {/* Left Intro Panel */}
        <div className="bg-[#1F3A34] p-8 md:w-2/5 text-[#EFE9D8] flex flex-col justify-between">
          <div>
            <div className="inline-flex p-3 rounded-2xl bg-white/10 mb-6">
              <Rocket className="w-8 h-8 text-[#C9962C]" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Calibrate Your Journey</h2>
            <p className="text-white/70 leading-relaxed font-sans">
              To build a hyper-personalized roadmap and give you the right challenges, we need to know where you stand today.
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className={`h-1.5 w-full bg-white/10 rounded-full overflow-hidden`}>
              <div 
                className="h-full bg-[#C9962C] transition-all duration-500 ease-out" 
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
            <p className="text-xs font-mono text-white/50 uppercase tracking-wider">Step {step} of 3</p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 md:w-3/5 bg-white flex flex-col h-[500px]">
          {step === 1 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-xl font-bold font-display text-[#1A1D1B] mb-2">Target Role</h3>
              <p className="text-sm text-[#1A1D1B]/60 mb-6">What role are you aiming for?</p>
              
              <div className="space-y-3">
                {['Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'Data Scientist', 'SDE'].map(role => (
                  <button
                    key={role}
                    onClick={() => setTargetRole(role)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      targetRole === role 
                        ? 'border-[#1F3A34] bg-[#1F3A34]/5 text-[#1F3A34] font-bold' 
                        : 'border-[#DCD4C0] hover:border-[#1F3A34]/30 text-[#1A1D1B]/70 hover:bg-gray-50'
                    }`}
                  >
                    <Target className={`w-5 h-5 ${targetRole === role ? 'text-[#1F3A34]' : 'text-gray-400'}`} />
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-xl font-bold font-display text-[#1A1D1B] mb-2">Your Strengths</h3>
              <p className="text-sm text-[#1A1D1B]/60 mb-6">Select the technologies you feel confident in.</p>
              
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold text-[#1A1D1B]/50 uppercase mb-3">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {COMMON_LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleSelection(lang, strongLangs, setStrongLangs)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                        strongLangs.includes(lang)
                          ? 'bg-[#1F3A34] text-white border-[#1F3A34] shadow-md shadow-[#1F3A34]/20'
                          : 'bg-white border-[#DCD4C0] text-[#1A1D1B]/70 hover:border-[#1F3A34]/40'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-bold text-[#1A1D1B]/50 uppercase mb-3">Frameworks</h4>
                <div className="flex flex-wrap gap-2">
                  {COMMON_FRAMEWORKS.map(fw => (
                    <button
                      key={fw}
                      onClick={() => toggleSelection(fw, strongFrames, setStrongFrames)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                        strongFrames.includes(fw)
                          ? 'bg-[#1F3A34] text-white border-[#1F3A34] shadow-md shadow-[#1F3A34]/20'
                          : 'bg-white border-[#DCD4C0] text-[#1A1D1B]/70 hover:border-[#1F3A34]/40'
                      }`}
                    >
                      {fw}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-xl font-bold font-display text-[#1A1D1B] mb-2">Areas to Improve</h3>
              <p className="text-sm text-[#1A1D1B]/60 mb-6">Select your weak points. We will tailor your coding problems and mock interviews to fix these.</p>
              
              <div className="flex flex-wrap gap-3">
                {COMMON_WEAKNESSES.map(weakness => (
                  <button
                    key={weakness}
                    onClick={() => toggleSelection(weakness, weaknesses, setWeaknesses)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 flex items-center gap-2 ${
                      weaknesses.includes(weakness)
                        ? 'border-[#C9962C] bg-[#C9962C]/10 text-[#1A1D1B] shadow-sm'
                        : 'bg-white border-[#DCD4C0] text-[#1A1D1B]/70 hover:border-[#C9962C]/40'
                    }`}
                  >
                    <BrainCircuit className={`w-4 h-4 ${weaknesses.includes(weakness) ? 'text-[#C9962C]' : 'text-gray-400'}`} />
                    {weakness}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-sm font-bold text-[#1A1D1B]/60 hover:text-[#1A1D1B] transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !targetRole}
                className="px-6 py-2.5 bg-[#1F3A34] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#162B26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleComplete}
                disabled={weaknesses.length === 0}
                className="px-6 py-2.5 bg-[#C9962C] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#b08225] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Generate My Path <Rocket className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
