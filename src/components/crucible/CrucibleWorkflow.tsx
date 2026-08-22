import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  CheckCircle2,
  Lock,
  Play,
  Mic,
  Square,
  Sparkles,
  ArrowDown,
  Terminal,
  ShieldCheck,
  AlertCircle,
  Clock,
  RotateCcw,
  Check,
} from 'lucide-react';

export const CrucibleWorkflow: React.FC = () => {
  const { activeEmberPanel, setActiveEmberPanel, showToast, profile, setProfile } = useApp();

  // Phase states (One continuous screen with 3 stacked phases unlocking sequentially)
  const [phaseAUnlocked, setPhaseAUnlocked] = useState<boolean>(true);
  const [phaseASolved, setPhaseASolved] = useState<boolean>(false);
  const [phaseBUnlocked, setPhaseBUnlocked] = useState<boolean>(false);
  const [phaseBSolved, setPhaseBSolved] = useState<boolean>(false);
  const [phaseCUnlocked, setPhaseCUnlocked] = useState<boolean>(false);
  const [phaseCSolved, setPhaseCSolved] = useState<boolean>(false);

  // Phase A State
  const [selectedComplexity, setSelectedComplexity] = useState<string>('O(N) Time, O(1) Aux Space');
  const [candidateNotes, setCandidateNotes] = useState<string>('');
  const [isEvaluatingPhaseA, setIsEvaluatingPhaseA] = useState<boolean>(false);

  // Phase B IDE State
  const [language, setLanguage] = useState<'python' | 'cpp' | 'typescript'>('python');
  const [code, setCode] = useState<string>(`def solve_concurrency_race(stream: list[int], max_lag_ms: int) -> int:
    # Write your optimized solution here
    pass`);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [testSuitePassed, setTestSuitePassed] = useState<boolean>(false);

  // Phase C Audio Defense State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>('');
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState<boolean>(false);
  const [defenseVerdict, setDefenseVerdict] = useState<{
    score: number;
    verdict: string;
    critique: string;
  } | null>(null);

  // Refs for scrolling to newly unlocked phases
  const phaseBRef = useRef<HTMLDivElement>(null);
  const phaseCRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Dynamic waveform heights
  const [waveformBars, setWaveformBars] = useState<number[]>(new Array(24).fill(12));

  // Audio recording simulation timer
  useEffect(() => {
    if (isRecording) {
      setActiveEmberPanel('mic');
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 59) {
            handleStopRecording();
            return 60;
          }
          return prev + 1;
        });

        // Jitter waveform bars
        setWaveformBars(
          Array.from({ length: 24 }, () => Math.floor(Math.random() * 38) + 8)
        );
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setWaveformBars(new Array(24).fill(10));
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Phase A Submission Handler
  const handleSolvePhaseA = async () => {
    setIsEvaluatingPhaseA(true);
    setActiveEmberPanel('problem');
    try {
      const res = await fetch(`/api/crucible/workflow/${profile.id}/logic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id || '11111111-1111-1111-1111-111111111111',
          notes: candidateNotes,
          complexity: selectedComplexity,
          problemTitle: 'Concurrency Race Window',
        })
      });
      const data = await res.json();
      setIsEvaluatingPhaseA(false);
      
      if (data.passed) {
        setPhaseASolved(true);
        setPhaseBUnlocked(true);
        setActiveEmberPanel('editor');
        showToast('Phase A Verified: ' + (data.critique || 'Logic approved. Phase B unlocked.'));
        setTimeout(() => {
          phaseBRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        showToast('Phase A Revision Required: ' + (data.critique || 'Please refine your logic.'));
        setActiveEmberPanel('none');
      }
    } catch (e) {
      setIsEvaluatingPhaseA(false);
      showToast('Error evaluating logic. Please try again.');
    }
  };

  // Phase B Test Execution Handler
  const handleRunCode = async () => {
    setIsRunningTests(true);
    setActiveEmberPanel('editor');
    setTestOutput(null);

    try {
      const res = await fetch(`/api/crucible/workflow/${profile.id}/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id || '11111111-1111-1111-1111-111111111111',
          language,
          code,
          input: 'stream',
        })
      });
      const data = await res.json();
      setIsRunningTests(false);
      
      const out = [
        '[CRUCIBLE TEST RUNNER]',
        data.stdout ? `STDOUT:\n${data.stdout}` : '',
        data.stderr ? `STDERR:\n${data.stderr}` : '',
        `Verdict: ${data.verdict}`
      ].filter(Boolean).join('\n\n');
      
      setTestOutput(out);

      if (data.verdict === 'PASS') {
        setTestSuitePassed(true);
        setPhaseBSolved(true);
        setPhaseCUnlocked(true);
        setActiveEmberPanel('mic');
        showToast('All Test Suites Passed! Phase C Unlocked below.');
        setTimeout(() => {
          phaseCRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      } else {
        showToast('Test execution failed. Check output console.');
      }
    } catch (e) {
      setIsRunningTests(false);
      showToast('Error running code. Please try again.');
    }
  };

  // Phase C Recording Handlers
  const handleStartRecording = () => {
    setRecordingSeconds(0);
    setIsRecording(true);
    setTranscript('');
    setDefenseVerdict(null);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsAnalyzingAudio(true);
    setActiveEmberPanel('chat');

    try {
      const res = await fetch(`/api/crucible/workflow/${profile.id}/defense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id || '11111111-1111-1111-1111-111111111111',
          transcript,
          code,
          prompt: 'Your tests passed, but explain to me in 60 seconds how your eviction strategy guarantees the Node.js or Go runtime will not stall under 50,000 spikes per second. Defend your trade-offs.',
        })
      });
      const data = await res.json();
      setIsAnalyzingAudio(false);
      
      if (data.completed || data.score >= 70) {
        setPhaseCSolved(true);
        setActiveEmberPanel('none');
        setDefenseVerdict({
          score: data.score,
          verdict: data.score >= 90 ? 'Pass with Distinction - High-Pressure Certified' : 'Pass',
          critique: data.critique,
        });
        setProfile((prev) => ({
          ...prev,
          readinessScore: Math.min(100, prev.readinessScore + 5),
        }));
        showToast('Crucible 3-Phase Defense Successfully Passed! Score updated.');
      } else {
        setDefenseVerdict({
          score: data.score,
          verdict: 'Needs Practice',
          critique: data.critique,
        });
        showToast('Defense critique received. Try again.');
      }
      setTimeout(() => {
        verdictRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (e) {
      setIsAnalyzingAudio(false);
      showToast('Error analyzing defense. Please try again.');
    }
  };

  return (
    <div className="crucible-theme min-h-screen bg-[#211D1B] text-[#EFE9D8] p-4 sm:p-6 lg:p-10 space-y-10 selection:bg-[#E8622C]/30">
      {/* Top Crucible Banner */}
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4A5A63]/60 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#E8622C]/20 text-[#E8622C] border border-[#E8622C]/30 font-semibold tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                UNIFIED CRUCIBLE PIPELINE
              </span>
              <span className="text-xs font-mono text-[#EFE9D8]/60">
                SCROLL-REVEAL - 3 PHASES
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[#EFE9D8]">
              Continuous Technical Trial
            </h1>
          </div>

          {/* Phase Progress Indicator */}
          <div className="flex items-center gap-2 bg-[#161311] px-4 py-2 rounded-xl border border-[#4A5A63]/60">
            <div
              className={`flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded ${
                phaseASolved
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                  : 'text-[#E8622C] font-semibold'
              }`}
            >
              <span>Phase A</span>
              {phaseASolved && <Check className="w-3 h-3" />}
            </div>
            <span className="text-[#4A5A63]">→</span>
            <div
              className={`flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded ${
                phaseBSolved
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                  : phaseBUnlocked
                  ? 'text-[#E8622C] font-semibold'
                  : 'text-[#4A5A63]'
              }`}
            >
              <span>Phase B</span>
              {phaseBSolved && <Check className="w-3 h-3" />}
            </div>
            <span className="text-[#4A5A63]">→</span>
            <div
              className={`flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded ${
                phaseCSolved
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                  : phaseCUnlocked
                  ? 'text-[#E8622C] font-semibold'
                  : 'text-[#4A5A63]'
              }`}
            >
              <span>Phase C</span>
              {phaseCSolved && <Check className="w-3 h-3" />}
            </div>
          </div>
        </div>

        <p className="text-sm text-[#EFE9D8]/80 max-w-3xl leading-relaxed">
          No fragmented screens or siloed tabs. In the Crucible, your algorithmic deduction, production code implementation, and 60-second verbal defense are tested sequentially in one continuous flow.
        </p>
      </div>

      {/* PHASE A: AI-GENERATED LOGIC PROBLEM */}
      <section
        id="crucible-phase-a-panel"
        className={`max-w-5xl mx-auto rounded-2xl bg-[#161311] border transition-all duration-300 p-6 sm:p-8 ${
          activeEmberPanel === 'problem'
            ? 'live-ember-glow'
            : 'border-[#4A5A63]/70'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#4A5A63]/50 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#E8622C] text-[#211D1B] font-mono font-bold flex items-center justify-center text-sm shadow-sm">
              A
            </span>
            <div>
              <span className="text-xs font-mono text-[#E8622C] font-semibold uppercase tracking-wider">
                PHASE A - LOGIC & COMPLEXITY FORMULATION
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#EFE9D8]">
                Distributed Streaming Lag & Monotonic Eviction
              </h2>
            </div>
          </div>

          {phaseASolved ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-600/40">
              <CheckCircle2 className="w-4 h-4" />
              VERIFIED
            </span>
          ) : (
            <span className="text-xs font-mono text-[#F2B705] bg-[#F2B705]/10 px-2.5 py-1 rounded border border-[#F2B705]/30">
              Active Challenge
            </span>
          )}
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-[#EFE9D8]/90">
          <div className="p-4 rounded-xl bg-[#211D1B] border border-[#4A5A63]/60 space-y-2">
            <div className="text-xs font-mono text-[#E8622C] uppercase font-semibold">
              SCENARIO SPECIFICATION
            </div>
            <p>
              A financial transaction broker receives an append-only stream of monotonically increasing millisecond timestamps representing trade events. Given a maximum tolerance lag window of <code className="font-mono text-[#F2B705]">max_lag_ms</code>, you must return the maximum count of concurrent in-flight transactions actively pending within any rolling window of that duration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-[#211D1B] border border-[#4A5A63]/40">
              <span className="text-[#E8622C] font-semibold block mb-1">CONSTRAINTS</span>
              <ul className="space-y-1 text-[#EFE9D8]/70">
                <li>- 1 &le; stream.length &le; 10^6</li>
                <li>- Timestamps strictly sorted: stream[i] &le; stream[i+1]</li>
                <li>- Zero-allocation runtime strictly mandated</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-[#211D1B] border border-[#4A5A63]/40">
              <span className="text-[#F2B705] font-semibold block mb-1">ARCHITECTURAL TARGET</span>
              <ul className="space-y-1 text-[#EFE9D8]/70">
                <li>- Time: Amortized O(N) linear scan</li>
                <li>- Space: O(K) where K is peak concurrent lag</li>
                <li>- No event loop blocking garbage-collection sweeps</li>
              </ul>
            </div>
          </div>

          {/* Phase A Candidate Reasoning Input */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-mono text-[#EFE9D8]/80 font-medium">
              STATE YOUR ALGORITHMIC APPROACH & COMPLEXITY BOUND:
            </label>
            <textarea
              id="phase-a-approach-input"
              disabled={phaseASolved}
              value={candidateNotes}
              onChange={(e) => setCandidateNotes(e.target.value)}
              placeholder="e.g. Utilize a double-ended monotonic deque storing left-edge indices to achieve amortized O(1) eviction without rebuilding heaps..."
              rows={3}
              className="w-full rounded-xl bg-[#211D1B] border border-[#4A5A63] p-3 text-xs font-mono text-[#EFE9D8] focus:border-[#E8622C] focus:ring-1 focus:ring-[#E8622C] focus:outline-none placeholder:text-white/20 disabled:opacity-70"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#EFE9D8]/60">Select target complexity:</span>
              <select
                disabled={phaseASolved}
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="bg-[#211D1B] border border-[#4A5A63] rounded-lg px-2.5 py-1 text-xs font-mono text-[#E8622C] focus:outline-none"
              >
                <option>O(N) Time, O(1) Aux Space</option>
                <option>O(N log N) Time, O(N) Space</option>
                <option>O(N) Amortized Deque Eviction</option>
              </select>
            </div>

            {!phaseASolved ? (
              <button
                id="submit-phase-a-solution"
                onClick={handleSolvePhaseA}
                disabled={isEvaluatingPhaseA || candidateNotes.trim().length === 0}
                className="px-5 py-2.5 rounded-xl bg-[#E8622C] text-[#211D1B] font-bold text-xs font-mono hover:bg-[#F2B705] disabled:opacity-40 transition-all shadow-sm flex items-center gap-2 focus:outline-none"
              >
                {isEvaluatingPhaseA ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Logic...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Logic & Unlock IDE</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Logic Confirmed. Phase B IDE Unlocked Below.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PHASE B: UNIFIED LIVE IDE PANEL */}
      <section
        ref={phaseBRef}
        id="crucible-phase-b-panel"
        className={`max-w-5xl mx-auto rounded-2xl bg-[#161311] border transition-all duration-300 p-6 sm:p-8 ${
          !phaseBUnlocked
            ? 'opacity-40 border-[#4A5A63]/30 pointer-events-none'
            : activeEmberPanel === 'editor'
            ? 'live-ember-glow'
            : 'border-[#4A5A63]/70'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#4A5A63]/50 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-lg font-mono font-bold flex items-center justify-center text-sm shadow-sm ${
                phaseBUnlocked ? 'bg-[#E8622C] text-[#211D1B]' : 'bg-[#4A5A63] text-white/50'
              }`}
            >
              B
            </span>
            <div>
              <span className="text-xs font-mono text-[#E8622C] font-semibold uppercase tracking-wider">
                PHASE B - PRODUCTION CODE IMPLEMENTATION
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#EFE9D8]">
                Integrated Crucible Test-Runner IDE
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!phaseBUnlocked ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#4A5A63] bg-[#211D1B] px-3 py-1 rounded-full border border-[#4A5A63]/40">
                <Lock className="w-3.5 h-3.5" />
                LOCKED (Complete Phase A)
              </span>
            ) : phaseBSolved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                <CheckCircle2 className="w-4 h-4" />
                TESTS PASSED (3/3)
              </span>
            ) : (
              <span className="text-xs font-mono text-[#F2B705] bg-[#F2B705]/10 px-2.5 py-1 rounded border border-[#F2B705]/30">
                Editor Ready
              </span>
            )}
          </div>
        </div>

        {/* Code Editor Body */}
        <div className="space-y-4">
          {/* Editor Chrome Bar */}
          <div className="flex items-center justify-between bg-[#211D1B] px-4 py-2.5 rounded-t-xl border border-b-0 border-[#4A5A63]/60 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[#EFE9D8]/70">solution.py</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#EFE9D8]/40">LANGUAGE:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-[#161311] text-[#E8622C] border border-[#4A5A63] rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
              >
                <option value="python">Python 3.12</option>
                <option value="cpp">C++ 20</option>
                <option value="typescript">TypeScript 5.8</option>
              </select>
            </div>
          </div>

          {/* Interactive Code Editor Area */}
          <div className="relative">
            <textarea
              id="crucible-code-editor"
              disabled={!phaseBUnlocked}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setActiveEmberPanel('editor');
              }}
              rows={11}
              className="w-full bg-[#161311] border border-[#4A5A63] rounded-b-xl p-4 font-mono text-xs text-[#EFE9D8] leading-relaxed focus:border-[#E8622C] focus:outline-none selection:bg-[#E8622C]/40 resize-y"
              spellCheck={false}
            />
          </div>

          {/* Execution Terminal / Results */}
          {testOutput && (
            <div className="p-4 rounded-xl bg-[#0e0c0b] border border-[#4A5A63]/70 font-mono text-xs leading-relaxed text-emerald-400 whitespace-pre-wrap animate-in fade-in">
              <div className="flex items-center justify-between text-[#EFE9D8]/50 text-[11px] pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CRUCIBLE TEST RUNNER OUTPUT</span>
                </div>
                <span>STATUS: 200 OK</span>
              </div>
              {testOutput}
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setCode(`def solve_concurrency_race(stream: list[int], max_lag_ms: int) -> int:\n    from collections import deque\n    pending = deque()\n    max_active_lag = 0\n    for timestamp in stream:\n        while pending and timestamp - pending[0] > max_lag_ms:\n            pending.popleft()\n        pending.append(timestamp)\n        max_active_lag = max(max_active_lag, len(pending))\n    return max_active_lag`);
              }}
              className="text-xs font-mono text-[#EFE9D8]/60 hover:text-[#EFE9D8] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Starter</span>
            </button>

            <button
              id="crucible-run-code-button"
              disabled={!phaseBUnlocked || isRunningTests}
              onClick={handleRunCode}
              className="px-6 py-2.5 rounded-xl bg-[#E8622C] text-[#211D1B] font-bold text-xs font-mono hover:bg-[#F2B705] disabled:opacity-40 transition-all shadow-sm flex items-center gap-2 focus:outline-none"
            >
              {isRunningTests ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Running Test Cases...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* PHASE C: 60-SECOND SPOKEN DEFENSE */}
      <section
        ref={phaseCRef}
        id="crucible-phase-c-panel"
        className={`max-w-5xl mx-auto rounded-2xl bg-[#161311] border transition-all duration-300 p-6 sm:p-8 ${
          !phaseCUnlocked
            ? 'opacity-40 border-[#4A5A63]/30 pointer-events-none'
            : isRecording || activeEmberPanel === 'mic'
            ? 'live-ember-glow'
            : 'border-[#4A5A63]/70'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#4A5A63]/50 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-lg font-mono font-bold flex items-center justify-center text-sm shadow-sm ${
                phaseCUnlocked ? 'bg-[#E8622C] text-[#211D1B]' : 'bg-[#4A5A63] text-white/50'
              }`}
            >
              C
            </span>
            <div>
              <span className="text-xs font-mono text-[#E8622C] font-semibold uppercase tracking-wider">
                PHASE C - 60-SECOND VERBAL TECHNICAL DEFENSE
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#EFE9D8]">
                Cross-Examination & Spoken Articulation
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!phaseCUnlocked ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-[#4A5A63] bg-[#211D1B] px-3 py-1 rounded-full border border-[#4A5A63]/40">
                <Lock className="w-3.5 h-3.5" />
                LOCKED (Pass Phase B Tests)
              </span>
            ) : phaseCSolved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                <CheckCircle2 className="w-4 h-4" />
                DEFENSE CLEARED (89/100)
              </span>
            ) : (
              <span className="text-xs font-mono text-[#F2B705] bg-[#F2B705]/10 px-2.5 py-1 rounded border border-[#F2B705]/30">
                Mic Stage Ready
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Prompt Question from Hiring Manager */}
          <div className="p-4 rounded-xl bg-[#211D1B] border border-[#4A5A63]/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#E8622C] font-semibold">
              <span>HIRING MANAGER PROBE:</span>
            </div>
            <p className="text-sm font-display italic text-[#EFE9D8]">
              &ldquo;Your tests passed, but explain to me in 60 seconds how your eviction strategy guarantees the Node.js or Go runtime will not stall under 50,000 spikes per second. Defend your trade-offs.&rdquo;
            </p>
          </div>

          {/* Interactive Mic & Waveform Stage */}
          <div className="p-6 rounded-2xl bg-[#0e0c0b] border border-[#4A5A63]/70 flex flex-col items-center justify-center text-center space-y-5">
            {isRecording ? (
              <div className="w-full text-left">
                <label className="text-[11px] font-mono text-[#E8622C] font-bold uppercase mb-2 block">
                  Vocal Transcript Override (STT Simulation)
                </label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-[#161311] border border-[#4A5A63]/60 rounded-xl text-sm font-mono text-[#EFE9D8] focus:outline-none focus:border-[#E8622C] resize-none"
                  placeholder="Speak (or type) your defense here..."
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-md px-4">
                {waveformBars.map((height, idx) => (
                  <span
                    key={idx}
                    style={{ height: `${height}px` }}
                    className={`w-2 rounded-full transition-all duration-150 ${
                      phaseCSolved ? 'bg-emerald-400/70' : 'bg-[#4A5A63]/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Timer & Status */}
            <div className="flex items-center gap-3 font-mono">
              <Clock className="w-4 h-4 text-[#E8622C]" />
              <span className="text-xl font-bold tracking-widest text-[#EFE9D8]">
                {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:
                {String(recordingSeconds % 60).padStart(2, '0')}
              </span>
              <span className="text-xs text-[#EFE9D8]/50">/ 01:00</span>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center gap-4">
              {!isRecording ? (
                <button
                  id="crucible-start-recording-btn"
                  disabled={!phaseCUnlocked || isAnalyzingAudio}
                  onClick={handleStartRecording}
                  className="px-6 py-3 rounded-full bg-[#E8622C] text-[#211D1B] font-bold text-xs font-mono hover:bg-[#F2B705] disabled:opacity-40 transition-all shadow-sm flex items-center gap-2 focus:outline-none"
                >
                  <Mic className="w-4 h-4" />
                  <span>{phaseCSolved ? 'Record New Defense' : 'Begin Spoken Defense'}</span>
                </button>
              ) : (
                <button
                  id="crucible-stop-recording-btn"
                  onClick={handleStopRecording}
                  className="px-6 py-3 rounded-full bg-rose-600 text-white font-bold text-xs font-mono hover:bg-rose-500 transition-all shadow-sm flex items-center gap-2 animate-pulse focus:outline-none"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Finish & Submit Defense</span>
                </button>
              )}
            </div>

            {isAnalyzingAudio && (
              <div className="text-xs font-mono text-[#F2B705] flex items-center gap-2 animate-pulse">
                <span className="w-3 h-3 rounded-full bg-[#F2B705] animate-ping" />
                <span>AI Hiring Manager is analyzing speech coherence & architectural defense...</span>
              </div>
            )}
          </div>

          {/* Transcript & Evaluation Card */}
          {transcript && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-[#211D1B] border border-[#4A5A63]/50">
                <div className="text-[11px] font-mono text-[#EFE9D8]/50 uppercase mb-1">
                  SPEECH TRANSCRIPTION
                </div>
                <p className="text-xs font-mono text-[#EFE9D8]/90 italic leading-relaxed">
                  &ldquo;{transcript}&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FINAL VERDICT CARD */}
      {defenseVerdict && (
        <section
          ref={verdictRef}
          id="crucible-final-verdict-card"
          className="max-w-5xl mx-auto rounded-2xl bg-[#161311] border-2 border-[#F2B705] p-6 sm:p-8 shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4A5A63]/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2B705] text-[#211D1B] flex items-center justify-center font-bold font-mono">
                OK
              </div>
              <div>
                <span className="text-xs font-mono text-[#F2B705] uppercase tracking-wider font-semibold">
                  CRUCIBLE CERTIFIED EVALUATION
                </span>
                <h3 className="text-2xl font-display font-bold text-[#EFE9D8]">
                  {defenseVerdict.verdict}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono text-[#EFE9D8]/60">DEFENSE SCORE</div>
              <div className="text-3xl font-bold font-mono text-[#F2B705]">
                {defenseVerdict.score}/100
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#EFE9D8]/80 leading-relaxed">
            {defenseVerdict.critique}
          </p>

          <div className="pt-4 border-t border-[#4A5A63]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <span className="text-[#EFE9D8]/60">
              Verified Candidate Signature - Ready for Tier-1 Campus Placement Drives
            </span>
            <span className="text-[#E8622C] font-semibold">
              Placement Readiness +3% Applied
            </span>
          </div>
        </section>
      )}
    </div>
  );
};

