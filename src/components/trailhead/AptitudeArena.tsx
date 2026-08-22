import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockAptitudeQuestions } from '../../data/mockData';
import { AptitudeQuestion } from '../../types';
import {
  BrainCircuit,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
} from 'lucide-react';

export const AptitudeArena: React.FC = () => {
  const { showToast, profile, setProfile } = useApp();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>(mockAptitudeQuestions);
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [timerMinutes, setTimerMinutes] = useState<number>(10);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [testHistory, setTestHistory] = useState<{ date: string; score: number }[]>([]);

  const currentQ = questions[currentIdx];

  useEffect(() => {
    if (isFinished || !hasStarted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished, hasStarted]);



  const handleSelectOption = (optIdx: number) => {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleFinish = async () => {
    setIsFinished(true);
    
    const answers = questions.map((q, idx) => ({
      questionId: q.id,
      selectedIndex: selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1
    }));
    
    try {
      const response = await fetch('/api/aptitude/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: (!profile.id || profile.id === 'current-user') ? '11111111-1111-1111-1111-111111111111' : profile.id, answers })
      });
      const data = await response.json();
      setTestHistory(prev => [{ date: new Date().toLocaleString(), score: data.score }, ...prev]);
      showToast(`Assessment Complete! Score: ${data.score}% (${data.correct}/${data.total} Correct)`);
    } catch {
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) correct++;
      });
      const pct = Math.round((correct / questions.length) * 100);
      setTestHistory(prev => [{ date: new Date().toLocaleString(), score: pct }, ...prev]);
      showToast(`Assessment Complete! Score: ${pct}% (${correct}/${questions.length} Correct)`);
    }
  };

  const handleStart = async () => {
    setIsLoadingQuestions(true);
    try {
      const response = await fetch(`/api/aptitude/questions?count=${numQuestions}`);
      const body = await response.json();
      if (body?.questions?.length) {
        setQuestions(body.questions);
      }
    } catch {
      setQuestions(mockAptitudeQuestions);
    } finally {
      setCurrentIdx(0);
      setSelectedAnswers({});
      setIsLoadingQuestions(false);
      setTimeLeft(timerMinutes * 60);
      setHasStarted(true);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 space-y-6 selection:bg-[#C9962C]/30">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD4C0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#2E6E8E] text-[#EFE9D8] font-semibold">
              <BrainCircuit className="w-3.5 h-3.5" />
              APTITUDE MATRIX
            </span>
            <span className="text-xs font-mono text-[#1A1D1B]/60">
              NATIONAL PLACEMENT ELIMINATION DRILL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1D1B]">
            Speed Assessment: Round 01 Qualifier
          </h1>
        </div>

        {/* Live Timer */}
        {hasStarted && !isFinished && (
          <div className="flex items-center gap-3 bg-[#FAF8F2] px-4 py-2 rounded-xl border border-[#DCD4C0] font-mono">
            <Clock className="w-4 h-4 text-[#2E6E8E]" />
            <span className="text-sm font-bold text-[#1F3A34]">{formatTime(timeLeft)}</span>
            <span className="text-xs text-[#1A1D1B]/50">Remaining</span>
          </div>
        )}
      </div>

      {!hasStarted ? (
        <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center justify-center py-12 text-center animate-in fade-in">
          <div className="w-20 h-20 bg-[#2E6E8E]/10 text-[#2E6E8E] rounded-3xl flex items-center justify-center mb-2">
            <BrainCircuit className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold">Configure Your Assessment</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 mt-4 w-full max-w-md bg-[#FAF8F2] p-6 rounded-2xl border border-[#DCD4C0]">
            <div className="flex-1 text-left">
              <label className="block text-xs font-mono font-bold text-[#1F3A34] mb-2">QUESTIONS</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full bg-white border border-[#DCD4C0] rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#2E6E8E]"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>
            <div className="flex-1 text-left">
              <label className="block text-xs font-mono font-bold text-[#1F3A34] mb-2">TIMER (MINS)</label>
              <select
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(Number(e.target.value))}
                className="w-full bg-white border border-[#DCD4C0] rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#2E6E8E]"
              >
                <option value={5}>5 Minutes</option>
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
              </select>
            </div>
          </div>

          <p className="text-[#1A1D1B]/70 max-w-md text-sm mt-4">
            The timer will start immediately once you click begin. Good luck!
          </p>
          <button
            onClick={handleStart}
            disabled={isLoadingQuestions}
            className="mt-2 px-8 py-3 rounded-xl bg-[#1F3A34] text-[#EFE9D8] font-mono font-bold hover:bg-[#162B26] transition-colors shadow-sm text-lg w-full max-w-md"
          >
            {isLoadingQuestions ? 'Loading...' : 'Start Assessment'}
          </button>
        </div>
      ) : !isFinished ? (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Question Navigator Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isCurrent = currentIdx === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all focus:outline-none shrink-0 ${
                    isCurrent
                      ? 'bg-[#1F3A34] text-[#C9962C] ring-2 ring-[#C9962C]'
                      : isAnswered
                      ? 'bg-[#2E6E8E] text-[#EFE9D8]'
                      : 'bg-[#FAF8F2] text-[#1A1D1B] border border-[#DCD4C0]'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Card */}
          <div className="rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCD4C0] pb-3">
              <span className="text-xs font-mono text-[#2E6E8E] font-bold uppercase tracking-wider">
                QUESTION {currentIdx + 1} OF {questions.length} - {currentQ.category}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/5 text-[#1A1D1B]/70">
                {currentQ.difficulty}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-display font-semibold text-[#1A1D1B] leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    id={`opt-${currentIdx}-${optIdx}`}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-mono transition-all flex items-center gap-3 focus:outline-none ${
                      isSelected
                        ? 'bg-[#1F3A34] text-[#EFE9D8] border-[#1F3A34] shadow-sm font-semibold'
                        : 'bg-white text-[#1A1D1B] border-[#DCD4C0] hover:border-[#1F3A34]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-[#C9962C] text-[#1A1D1B]' : 'bg-[#EFE9D8] text-[#1A1D1B]'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Nav controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#DCD4C0]">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((p) => p - 1)}
                className="px-4 py-2 rounded-xl border border-[#DCD4C0] text-xs font-mono font-medium disabled:opacity-40 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((p) => p + 1)}
                  className="px-5 py-2 rounded-xl bg-[#1F3A34] text-[#EFE9D8] text-xs font-mono font-bold hover:bg-[#162B26] transition-colors flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  id="submit-aptitude-test-btn"
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-xl bg-[#C9962C] text-[#1A1D1B] text-xs font-mono font-bold hover:bg-[#B58422] transition-colors shadow-sm"
                >
                  Submit Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Results Report View */
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
          <div className="rounded-2xl bg-[#1F3A34] text-[#EFE9D8] p-8 border border-[#2A4D45] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#C9962C] font-semibold mb-1">
                <Trophy className="w-4 h-4" />
                <span>ASSESSMENT SUMMARY REPORT</span>
              </div>
              <h2 className="text-3xl font-display font-bold">Total Score: {Math.round(
                  (Object.keys(selectedAnswers).filter(
                    (k) => selectedAnswers[Number(k)] === questions[Number(k)].correctIndex
                  ).length / questions.length) * 100
                )}%</h2>
              <p className="text-xs text-[#EFE9D8]/70 mt-1 max-w-md">
                You correctly answered {Object.keys(selectedAnswers).filter(
                    (k) => selectedAnswers[Number(k)] === questions[Number(k)].correctIndex
                  ).length} out of {questions.length} questions.
              </p>
            </div>

            <div className="text-center sm:text-right bg-[#162B26] p-4 rounded-xl border border-[#2A4D45]">
              <div className="text-xs font-mono text-[#EFE9D8]/60">CORRECT ANSWERS</div>
              <div className="text-4xl font-bold font-mono text-[#C9962C]">
                {Object.keys(selectedAnswers).filter(
                    (k) => selectedAnswers[Number(k)] === questions[Number(k)].correctIndex
                  ).length} / {questions.length}
              </div>
            </div>
          </div>

          {/* Past History */}
          <div className="bg-[#FAF8F2] p-6 rounded-2xl border border-[#DCD4C0]">
            <h3 className="text-xl font-display font-bold text-[#1A1D1B] mb-4">Past Test History</h3>
            <div className="space-y-3">
              {testHistory.length === 0 ? (
                <div className="text-sm font-mono text-[#1A1D1B]/50 italic text-center py-4">No past tests recorded in this session.</div>
              ) : (
                testHistory.map((history, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-3 rounded-xl border border-[#DCD4C0] ${idx === 0 ? 'bg-white' : 'bg-white/50 border-dashed'}`}>
                    <div className={`text-sm font-mono ${idx === 0 ? 'text-[#1A1D1B] font-bold' : 'text-[#1A1D1B]/70'}`}>{history.date}</div>
                    <div className={`text-sm font-mono font-bold ${idx === 0 ? 'text-[#2E6E8E]' : 'text-[#1A1D1B]/70'}`}>{history.score}% Score</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detailed Question Review & Step-by-Step Solutions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-[#1A1D1B]">
                Step-by-Step Solutions
              </h3>
              <button 
                onClick={() => setShowAnswers(!showAnswers)}
                className="px-4 py-2 bg-[#2E6E8E] text-white text-xs font-mono font-bold rounded-lg hover:bg-[#205169] transition"
              >
                {showAnswers ? 'Hide Answers' : 'Review Answers'}
              </button>
            </div>
            
            {showAnswers && questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border ${
                    isCorrect
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-rose-50/60 border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold">
                      Q{idx + 1} - {q.category}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        isCorrect
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      {isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-[#1A1D1B] mb-2">{q.question}</p>

                  <div className="text-xs font-mono text-[#1A1D1B]/80 space-y-1 bg-white/70 p-3 rounded-lg border border-current/10">
                    <div>
                      <strong>Your Answer: </strong>
                      {userAns !== undefined
                        ? `${String.fromCharCode(65 + userAns)}) ${q.options[userAns]}`
                        : 'Skipped'}
                    </div>
                    <div className="text-emerald-800 font-bold">
                      <strong>Correct Answer: </strong>
                      {String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                    </div>
                    <div className="pt-2 text-[11px] text-[#1A1D1B]/70 font-sans">
                      <strong>Explanation: </strong> {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setIsFinished(false);
                setHasStarted(false);
                setSelectedAnswers({});
                setShowAnswers(false);
                setTimeLeft(timerMinutes * 60);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#1F3A34] text-[#EFE9D8] text-xs font-mono font-bold hover:bg-[#162B26] transition-colors flex items-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

