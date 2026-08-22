import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquareCode,
  Mic,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface MockMessage {
  id: string;
  sender: 'ai' | 'candidate';
  text: string;
  timestamp: string;
}

export const MockInterview: React.FC = () => {
  const { showToast, profile } = useApp();
  const [rolePersona, setRolePersona] = useState<'faang' | 'startup' | 'unicorn'>('faang');
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState(false);

  React.useEffect(() => {
    if (hasStarted) return;
    setHasStarted(true);
    setIsThinking(true);
    fetch('/api/interview/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answer: 'Hello, I am ready to start my interview.',
        mode: rolePersona,
        targetRole: profile?.targetRoles?.[0] || 'Software Engineer',
        qaPairs: []
      }),
    })
      .then(res => res.json())
      .then(data => {
        setMessages([{
          id: `im-${Date.now()}`,
          sender: 'ai',
          text: data.reply || "Let's begin. Can you introduce yourself?",
          timestamp: 'Just now'
        }]);
        setIsThinking(false);
      })
      .catch(() => setIsThinking(false));
  }, [hasStarted, rolePersona, profile]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const candidateMsg: MockMessage = {
      id: `im-${Date.now()}`,
      sender: 'candidate',
      text: inputText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, candidateMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/interview/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: inputText,
          mode: rolePersona,
          targetRole: profile?.targetRoles?.[0] || 'Software Engineer',
          qaPairs: messages.map(m => ({ answer: m.sender === 'candidate' ? m.text : '', reply: m.sender === 'ai' ? m.text : '' })) // rudimentary map, in a real app would pair them properly
        }),
      });
      const data = await response.json();
      
      const aiReply: MockMessage = {
        id: `im-${Date.now() + 1}`,
        sender: 'ai',
        text: data.reply || 'Let me evaluate your answer.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiReply]);
      showToast('Interviewer cross-examined your response.');
    } catch (err) {
      showToast('Failed to connect to interviewer AI.');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 space-y-6 selection:bg-[#C9962C]/30">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD4C0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1F3A34] text-[#C9962C] font-semibold">
              <MessageSquareCode className="w-3.5 h-3.5" />
              MOCK INTERVIEW ROOM
            </span>
            <span className="text-xs font-mono text-[#1A1D1B]/60">
              REAL-TIME TECHNICAL SIMULATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1D1B]">
            Placement Technical Cross-Examination
          </h1>
        </div>

        {/* Persona Selector */}
        <div className="flex items-center gap-2 bg-[#FAF8F2] p-1.5 rounded-xl border border-[#DCD4C0] text-xs font-mono">
          <span className="text-[#1A1D1B]/60 pl-2">PERSONA:</span>
          <select
            value={rolePersona}
            onChange={(e) => setRolePersona(e.target.value as any)}
            className="bg-white border border-[#DCD4C0] rounded-lg px-2.5 py-1 text-xs font-mono text-[#1F3A34] font-semibold focus:outline-none"
          >
            <option value="faang">FAANG Bar Raiser</option>
            <option value="unicorn">Unicorn Tech Lead</option>
            <option value="startup">Series-B Architect</option>
          </select>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="max-w-5xl mx-auto rounded-2xl bg-[#FAF8F2] border border-[#DCD4C0] overflow-hidden shadow-sm flex flex-col h-[640px]">
        {/* Top Interview Header */}
        <div className="p-4 bg-[#1F3A34] text-[#EFE9D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9962C] text-[#1A1D1B] font-mono font-bold flex items-center justify-center text-xs">
              AI
            </div>
            <div>
              <div className="text-xs font-semibold">Principal Staff Engineer</div>
              <div className="text-[10px] font-mono text-[#C9962C]">
                {rolePersona === 'faang'
                  ? 'FAANG Bar Raiser Mode'
                  : rolePersona === 'unicorn'
                  ? 'High-Scale Concurrency Focus'
                  : 'Fast Execution & Architecture'}
              </div>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#162B26] text-[#C9962C] border border-[#2A4D45]">
            LIVE RECORDING AUDIO STREAM
          </span>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-white border border-[#DCD4C0] text-[#1A1D1B] shadow-xs'
                      : 'bg-[#1F3A34] text-[#EFE9D8] font-medium'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[9px] font-mono text-[#1A1D1B]/50 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#1F3A34] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#1F3A34] animate-ping" />
              <span>Interviewer is evaluating technical depth...</span>
            </div>
          )}
        </div>

        {/* Text Input & Mic Form */}
        <form
          onSubmit={handleSend}
          className="p-4 bg-white border-t border-[#DCD4C0] flex items-center gap-2"
        >
          <input
            id="mock-interview-text-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your technical defense or STAR response..."
            className="flex-1 bg-[#FAF8F2] border border-[#DCD4C0] rounded-xl px-4 py-2.5 text-xs font-mono text-[#1A1D1B] focus:outline-none focus:border-[#1F3A34]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="px-5 py-2.5 rounded-xl bg-[#1F3A34] text-[#EFE9D8] text-xs font-mono font-bold hover:bg-[#162B26] disabled:opacity-40 transition-colors shadow-sm flex items-center gap-2"
          >
            <span>Submit</span>
            <Send className="w-3.5 h-3.5 text-[#C9962C]" />
          </button>
        </form>
      </div>
    </div>
  );
};

