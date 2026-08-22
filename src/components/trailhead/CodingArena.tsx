import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CodingProblem } from '../../types';
import {
  Code2,
  Play,
  CheckCircle2,
  AlertCircle,
  Terminal,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Clock,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export const CodingArena: React.FC = () => {
  const { codingProblems, selectedProblemId, setSelectedProblemId, showToast, profile } = useApp();

  const filteredProblems = React.useMemo(() => {
    if (!profile.weaknesses || profile.weaknesses.length === 0) return codingProblems;
    // Map weakness strings to problem tags loosely
    const weakLower = profile.weaknesses.map(w => w.toLowerCase());
    return codingProblems.filter(p => 
      p.tags.some(tag => weakLower.includes(tag.toLowerCase()) || 
      weakLower.some(w => w.includes(tag.toLowerCase()) || tag.toLowerCase().includes(w)))
    );
  }, [codingProblems, profile.weaknesses]);

  const activeProblems = filteredProblems.length > 0 ? filteredProblems : codingProblems;

  const problem: CodingProblem =
    activeProblems.find((p) => p.id === selectedProblemId) || activeProblems[0];

  const [language, setLanguage] = useState<'python' | 'cpp' | 'java' | 'javascript' | 'sqlite3'>('python');
  const [code, setCode] = useState<string>("");
  const [customInput, setCustomInput] = useState<string>(problem.testCases[0]?.input || '');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'solution' | 'submissions'>('description');

  const handleSelectProblem = (p: CodingProblem) => {
    setSelectedProblemId(p.id);
    setCode("");
    setCustomInput(p.testCases[0]?.input || '');
    setTestOutput(null);
  };

  const handleLanguageChange = (lang: 'python' | 'cpp' | 'java' | 'javascript' | 'sqlite3') => {
    setLanguage(lang);
    setCode("");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setTestOutput(null);
    try {
      const response = await fetch('/api/coding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '11111111-1111-1111-1111-111111111111',
          problemId: problem.id,
          language,
          code,
          input: customInput,
        }),
      });
      const result = await response.json();
      setIsRunning(false);
      setTestOutput(
        `[LLM CODE RUNNER]\nVerdict: ${result.verdict}\nRuntime: ${result.runtimeMs}ms\nSandbox: ${result.sandbox || 'Mentron LLM Simulator'}\n\nNORMALIZED STDIN:\n${result.stdin || customInput || '(empty)'}\n\nSTDOUT:\n${result.stdout || '(empty)'}\n\nSTDERR:\n${result.stderr || '(empty)'}`
      );
      showToast(result.verdict === 'PASS' ? 'Code executed successfully on Piston.' : 'Code executed with errors. Check stderr.');
    } catch (error) {
      setIsRunning(false);
      setTestOutput(`[LLM CODE RUNNER]\nVerdict: EXTERNAL_UNAVAILABLE\n\n${error instanceof Error ? error.message : 'Unable to reach backend.'}`);
      showToast('Compiler service unavailable. Start the backend and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 space-y-6 selection:bg-[#C9962C]/30">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCD4C0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1F3A34] text-[#C9962C] font-semibold">
              <Code2 className="w-3.5 h-3.5" />
              CODING ARENA
            </span>
            <span className="text-xs font-mono text-[#1A1D1B]/60">
              CAMPUS PLACEMENT PROBLEM SUITE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1D1B]">
            {problem.title}
          </h1>
        </div>

        {/* Problem Selector Dropdown */}
        <div className="flex items-center gap-3 bg-[#FAF8F2] p-2 rounded-xl border border-[#DCD4C0]">
          <span className="text-xs font-mono text-[#1A1D1B]/60 pl-2">PROBLEM:</span>
          <select
            value={problem.id}
            onChange={(e) => {
              const found = activeProblems.find((p) => p.id === e.target.value);
              if (found) handleSelectProblem(found);
            }}
            className="bg-white border border-[#DCD4C0] rounded-lg px-3 py-1.5 text-xs font-mono text-[#1F3A34] font-semibold focus:outline-none focus:border-[#1F3A34]"
          >
            {activeProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Main Split Layout: Left Problem Specs | Right Code IDE */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Specs (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCD4C0] pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  activeTab === 'description'
                    ? 'bg-[#1F3A34] text-[#EFE9D8]'
                    : 'text-[#1A1D1B]/70 hover:text-[#1A1D1B]'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('solution')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                  activeTab === 'solution'
                    ? 'bg-[#1F3A34] text-[#EFE9D8]'
                    : 'text-[#1A1D1B]/70 hover:text-[#1A1D1B]'
                }`}
              >
                Solution Notes
              </button>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-100 text-emerald-800'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          {activeTab === 'description' ? (
            <div className="space-y-4 text-xs leading-relaxed text-[#1A1D1B]/90">
              <p className="text-sm">{problem.description}</p>

              {/* Examples */}
              <div className="space-y-3">
                <span className="font-mono text-[#1F3A34] font-bold text-xs uppercase block">
                  EXAMPLES
                </span>
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#EFE9D8] border border-[#DCD4C0] font-mono space-y-1">
                    <div>
                      <span className="text-[#1F3A34] font-bold">Input: </span>
                      <code>{ex.input}</code>
                    </div>
                    <div>
                      <span className="text-[#C9962C] font-bold">Output: </span>
                      <code>{ex.output}</code>
                    </div>
                    {ex.explanation && (
                      <p className="text-[11px] text-[#1A1D1B]/70 font-sans mt-1">
                        {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-1.5 pt-2">
                <span className="font-mono text-[#1F3A34] font-bold text-xs uppercase block">
                  CONSTRAINTS
                </span>
                <ul className="space-y-1 font-mono text-[11px] text-[#1A1D1B]/75">
                  {problem.constraints.map((c, idx) => (
                    <li key={idx}>- {c}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs leading-relaxed font-mono">
              <div className="p-4 rounded-xl bg-[#EFE9D8] border border-[#DCD4C0]">
                <span className="font-bold text-[#1F3A34] block mb-1">OPTIMAL APPROACH</span>
                <p className="text-xs text-[#1A1D1B]/80 font-sans">
                  {problem.solutionNotes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Runner (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#1F3A34] text-[#EFE9D8] border border-[#2A4D45] overflow-hidden shadow-sm">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#162B26] border-b border-[#2A4D45] text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9962C]" />
                <span className="font-semibold">solution.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : language === 'sqlite3' ? 'sql' : 'js'}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#EFE9D8]/50">LANGUAGE:</span>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as any)}
                  className="bg-[#1F3A34] text-[#C9962C] border border-[#2A4D45] rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
                >
                  <option value="python">Python 3.12</option>
                  <option value="cpp">C++ 20</option>
                  <option value="java">Java 21</option>
                  <option value="javascript">JavaScript</option>
                  <option value="sqlite3">SQLite 3</option>
                </select>
              </div>
            </div>

            {/* Code Textarea */}
            <textarea
              id="trailhead-code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              className="w-full bg-[#1F3A34] p-4 font-mono text-xs text-[#EFE9D8] leading-relaxed focus:outline-none selection:bg-[#C9962C]/40 resize-y"
              spellCheck={false}
            />

            <div className="px-4 pb-4 bg-[#1F3A34]">
              <label className="block text-[10px] font-mono text-[#C9962C] font-bold mb-2">
                CUSTOM STDIN
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                rows={4}
                className="w-full rounded-xl bg-[#162B26] border border-[#2A4D45] p-3 font-mono text-xs text-[#EFE9D8] focus:outline-none focus:border-[#C9962C] resize-y"
                spellCheck={false}
              />
            </div>

            {/* Editor Action Bottom Bar */}
            <div className="flex items-center justify-between p-4 bg-[#162B26] border-t border-[#2A4D45]">
              <button
                onClick={() => setCode("")}
                className="text-xs font-mono text-[#EFE9D8]/60 hover:text-[#EFE9D8] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Starter Code</span>
              </button>

              <button
                id="run-code-button"
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-6 py-2 rounded-xl bg-[#C9962C] text-[#1A1D1B] font-bold text-xs font-mono hover:bg-[#B58422] transition-colors shadow-sm flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Running on LLM...</span>
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

          {/* Test Harness Terminal Output */}
          {testOutput && (
            <div className="p-4 rounded-xl bg-[#162B26] text-emerald-400 border border-[#2A4D45] font-mono text-xs leading-relaxed whitespace-pre-wrap animate-in fade-in">
              <div className="flex items-center justify-between text-[#EFE9D8]/50 text-[11px] pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>TRAILHEAD VERIFIED TEST RUNNER</span>
                </div>
                <span>STATUS: 200 OK</span>
              </div>
              {testOutput}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

