import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HelpCenterWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useApp();

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/help-center/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.content
          }))
        })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'ai', content: data.reply || 'Sorry, I am offline.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Network error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all z-50 flex items-center justify-center ${
          isOpen ? 'bg-[#C9962C] text-[#1F3A34] rotate-90 scale-0 opacity-0' : 'bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26] hover:scale-105 scale-100 opacity-100'
        }`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-[#DCD4C0] flex flex-col overflow-hidden z-50 transition-all origin-bottom-right duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-[#1F3A34] p-4 flex items-center justify-between text-[#EFE9D8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8622C] flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm">CareerOS AI Tutor</h3>
              <p className="text-[10px] font-mono text-[#EFE9D8]/70 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C9962C]" />
                Ready to help
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F2]">
          {messages.length === 0 && (
            <div className="text-center text-[#1A1D1B]/50 text-sm mt-8">
              Ask me anything about your career path, technical concepts, or platform features!
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                m.role === 'user' 
                  ? 'bg-[#1F3A34] text-[#EFE9D8] rounded-br-sm' 
                  : 'bg-white border border-[#DCD4C0] text-[#1A1D1B] rounded-bl-sm shadow-sm'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-3 rounded-2xl bg-white border border-[#DCD4C0] rounded-bl-sm shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-[#1F3A34]/50" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-[#DCD4C0] flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-[#FAF8F2] border border-[#DCD4C0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1F3A34]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-[#1F3A34] text-[#EFE9D8] flex items-center justify-center hover:bg-[#162B26] disabled:opacity-50 transition-colors shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </>
  );
};
