import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, ArrowRight, Flame, Check, Sparkles } from 'lucide-react';

const questions = [
  {
    id: 'languages',
    title: 'Programming Languages',
    subtitle: 'Which languages are you most comfortable with?',
    type: 'multi',
    options: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'Other']
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    subtitle: 'How comfortable are you with DSA?',
    type: 'single',
    options: ['Beginner', 'Basic', 'Comfortable', 'Strong', 'Advanced']
  },
  {
    id: 'development',
    title: 'Development Experience',
    subtitle: 'Which areas do you have experience with?',
    type: 'multi',
    options: ['Frontend', 'Backend', 'Full Stack', 'APIs', 'Databases', 'Git/GitHub', 'Cloud', 'None']
  },
  {
    id: 'cs_fundamentals',
    title: 'CS Fundamentals',
    subtitle: 'Select the subjects you are familiar with:',
    type: 'multi',
    options: ['OOP', 'DBMS', 'Operating Systems', 'Computer Networks', 'System Design']
  },
  {
    id: 'confidence',
    title: 'Coding Confidence',
    subtitle: 'What type of problems can you currently solve independently?',
    type: 'single',
    options: ['I am still learning', 'Basic problems', 'Easy and some medium', 'Medium confidently', 'Advanced problems']
  },
  {
    id: 'target_role',
    title: 'Target Role',
    subtitle: 'What role are you primarily preparing for?',
    type: 'single',
    options: ['Software Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data/AI', 'Other']
  }
];

export const CrucibleAssessment: React.FC = () => {
  const { navigate } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const handleSelect = (option: string) => {
    const q = questions[currentStep];
    if (q.type === 'single') {
      setAnswers({ ...answers, [q.id]: [option] });
    } else {
      const current = answers[q.id] || [];
      if (current.includes(option)) {
        setAnswers({ ...answers, [q.id]: current.filter(o => o !== option) });
      } else {
        setAnswers({ ...answers, [q.id]: [...current, option] });
      }
    }
  };

  const isSelected = (option: string) => {
    const q = questions[currentStep];
    return answers[q.id]?.includes(option) || false;
  };

  const canProceed = () => {
    const q = questions[currentStep];
    return answers[q.id] && answers[q.id].length > 0;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save results and go to result page
      localStorage.setItem('crucible_assessment_data', JSON.stringify(answers));
      navigate('/crucible-result');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/track-selection');
    }
  };

  const q = questions[currentStep];

  return (
    <div className="min-h-screen bg-[#14231E] text-white flex flex-col items-center justify-center p-6 selection:bg-[#B8872F]/30">
      <div className="w-full max-w-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-semibold text-[#DDE4DE]/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#B8872F]" />
            <span className="font-display font-bold tracking-widest uppercase text-sm text-[#B8872F]">Crucible Calibration</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-12 overflow-hidden">
          <div 
            className="h-full bg-[#B8872F] transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" key={currentStep}>
          <div className="mb-8">
            <span className="text-[#B8872F] font-mono text-sm mb-2 block">Step {currentStep + 1} of {questions.length}</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">{q.title}</h2>
            <p className="text-[#DDE4DE]/70 text-lg">{q.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {q.options.map(option => {
              const selected = isSelected(option);
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                    selected 
                      ? 'bg-[#B8872F]/10 border-[#B8872F] text-white' 
                      : 'bg-white/5 border-white/10 text-[#DDE4DE]/80 hover:bg-white/10'
                  }`}
                >
                  <span className="font-semibold">{option}</span>
                  {selected && <Check className="w-5 h-5 text-[#B8872F]" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono font-bold transition-all ${
                canProceed()
                  ? 'bg-[#B8872F] text-[#14231E] hover:bg-white'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {currentStep === questions.length - 1 ? 'Complete Assessment' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
