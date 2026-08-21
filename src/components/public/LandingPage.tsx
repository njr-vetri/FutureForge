import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass, Flame, Code2, BrainCircuit, FileText, Target, Milestone, MessageSquareCode,
  ArrowRight, ShieldCheck, Zap, BarChart3, ChevronRight, User
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStart = () => navigate('/login');

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#14231E] font-sans selection:bg-[#B8872F]/30">
      {/* Navbar Minimal */}
      <header className="absolute top-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14231E] text-[#B8872F] flex items-center justify-center font-display font-bold text-xl shadow-sm border border-[#DDE4DE]">
            C
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-[#14231E]">
            CareerOS
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold">
          <a href="#services" className="hover:text-[#1F5E4D] transition-colors">Capabilities</a>
          <a href="#tracks" className="hover:text-[#1F5E4D] transition-colors">Tracks</a>
          <a href="#how-it-works" className="hover:text-[#1F5E4D] transition-colors">How it Works</a>
        </nav>
        <button 
          onClick={handleStart}
          className="px-5 py-2 rounded-xl bg-[#1F5E4D] text-white font-mono font-bold text-xs hover:bg-[#14231E] transition-all shadow-sm"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 overflow-hidden flex flex-col items-center text-center">
        <div className={`max-w-4xl mx-auto space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-[#B8872F]/10 text-[#B8872F] border border-[#B8872F]/30 mb-4 font-semibold uppercase tracking-wider">
            <SparklesIcon className="w-4 h-4" /> Next-Gen Placement Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-[#14231E] leading-tight">
            Forge Your Skills. <br/>
            <span className="text-[#1F5E4D]">Engineer Your Future.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#66736D] max-w-2xl mx-auto leading-relaxed">
            CareerOS is an elite placement preparation engine designed to bridge the gap between academic learning and industry readiness. Train, test, and prove your mettle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button 
              onClick={handleStart}
              className="px-8 py-3.5 rounded-xl bg-[#14231E] text-white font-mono font-bold hover:bg-[#1F5E4D] transition-all shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Start Your Journey <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#services"
              className="px-8 py-3.5 rounded-xl bg-white text-[#14231E] border border-[#DDE4DE] font-mono font-bold hover:border-[#1F5E4D] transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Explore Platform
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 md:px-12 bg-white border-y border-[#DDE4DE]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Production-Grade Capabilities</h2>
            <p className="text-[#66736D]">Comprehensive tools designed to simulate real-world hiring environments and harden your technical profile.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-[#F7F8F5] p-8 rounded-2xl border border-[#DDE4DE] flex flex-col justify-between group hover:border-[#1F5E4D] transition-colors">
              <div>
                <Code2 className="w-10 h-10 text-[#1F5E4D] mb-6" />
                <h3 className="text-2xl font-display font-bold mb-2">Live Coding Arena</h3>
                <p className="text-[#66736D] max-w-md">Practice complex DSA problems with integrated test runners, language flexibility, and execution environments.</p>
              </div>
            </div>
            
            <div className="md:col-span-4 bg-[#14231E] text-white p-8 rounded-2xl border border-[#14231E] flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><BrainCircuit className="w-32 h-32" /></div>
              <div className="relative z-10">
                <BrainCircuit className="w-10 h-10 text-[#B8872F] mb-6" />
                <h3 className="text-xl font-display font-bold mb-2">Aptitude Matrix</h3>
                <p className="text-[#DDE4DE]/70 text-sm">Elimination-style timed quantitative and reasoning assessments.</p>
              </div>
            </div>

            <div className="md:col-span-4 bg-white p-8 rounded-2xl border border-[#DDE4DE] group hover:border-[#B8872F] transition-colors">
              <MessageSquareCode className="w-8 h-8 text-[#B8872F] mb-4" />
              <h3 className="text-lg font-bold mb-2">AI Mock Interviews</h3>
              <p className="text-[#66736D] text-sm">Simulated spoken defense with real-time prompt generation and grading.</p>
            </div>
            
            <div className="md:col-span-4 bg-white p-8 rounded-2xl border border-[#DDE4DE] group hover:border-[#1F5E4D] transition-colors">
              <FileText className="w-8 h-8 text-[#1F5E4D] mb-4" />
              <h3 className="text-lg font-bold mb-2">Resume ATS Audits</h3>
              <p className="text-[#66736D] text-sm">Automated resume scanning and gap analysis for target roles.</p>
            </div>
            
            <div className="md:col-span-4 bg-[#F7F8F5] p-8 rounded-2xl border border-[#DDE4DE] group hover:border-[#B8872F] transition-colors">
              <BarChart3 className="w-8 h-8 text-[#B8872F] mb-4" />
              <h3 className="text-lg font-bold mb-2">Placement Readiness</h3>
              <p className="text-[#66736D] text-sm">Aggregated scoring metric representing your true interview probability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-[#14231E] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-16">The Journey to Readiness</h2>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 font-mono text-sm sm:text-base font-bold">
            <div className="flex flex-col items-center gap-3 text-[#B8872F]">
              <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center">1</div>
              <span>Discover</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40 hidden sm:block" />
            <div className="flex flex-col items-center gap-3 text-[#DDE4DE]">
              <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center">2</div>
              <span>Learn</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40 hidden sm:block" />
            <div className="flex flex-col items-center gap-3 text-[#1F5E4D]">
              <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center">3</div>
              <span>Practice</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40 hidden sm:block" />
            <div className="flex flex-col items-center gap-3 text-[#B8872F]">
              <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center">4</div>
              <span>Test</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40 hidden sm:block" />
            <div className="flex flex-col items-center gap-3 text-[#DDE4DE]">
              <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center">5</div>
              <span>Improve</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-40 hidden md:block" />
            <div className="flex flex-col items-center gap-3 text-white">
              <div className="w-12 h-12 rounded-full border border-current bg-white text-[#14231E] flex items-center justify-center">6</div>
              <span>Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section id="tracks" className="py-24 px-6 md:px-12 bg-[#F7F8F5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Choose Your Path</h2>
            <p className="text-[#66736D]">Two distinct tracks designed for different stages of preparation.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-[#DDE4DE] shadow-sm hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#1F5E4D]/10 text-[#1F5E4D]"><Compass className="w-6 h-6" /></div>
                <h3 className="text-2xl font-display font-bold">Trailhead</h3>
              </div>
              <p className="text-[#66736D] mb-6">Beginner / Foundation path. Perfect for students building their fundamentals. Follow a guided journey covering coding, aptitude, and basic interview prep.</p>
              <button onClick={handleStart} className="text-[#1F5E4D] font-bold font-mono text-sm flex items-center gap-2 hover:gap-3 transition-all">
                Explore Trailhead <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#14231E] text-white p-8 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform border border-[#14231E]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#B8872F]/20 text-[#B8872F]"><Flame className="w-6 h-6" /></div>
                <h3 className="text-2xl font-display font-bold">Crucible</h3>
              </div>
              <p className="text-[#DDE4DE] mb-6">Intermediate / Advanced path. For students with strong foundations ready for high-intensity pressure, real-world evaluations, and target company benchmarks.</p>
              <button onClick={handleStart} className="text-[#B8872F] font-bold font-mono text-sm flex items-center gap-2 hover:gap-3 transition-all">
                Enter Crucible <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#14231E] text-white border-t border-white/10 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-display font-bold text-sm">
              C
            </div>
            <span className="font-display font-bold tracking-tight">CareerOS Placement Engine</span>
          </div>
          <div className="text-xs font-mono text-white/50">
            Â© 2026 FutureForge Ecosystem. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper component
const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);
