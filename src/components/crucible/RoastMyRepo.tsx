import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockRepoTree, initialRoastMessages } from '../../data/mockData';
import { RepoFileNode, RoastMessage } from '../../types';
import {
  GitBranch,
  Folder,
  FileCode,
  Flame,
  Send,
  AlertTriangle,
  FileText,
  Terminal,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code,
} from 'lucide-react';

export const RoastMyRepo: React.FC = () => {
  const { activeEmberPanel, setActiveEmberPanel, showToast } = useApp();

  // Selected file in repo tree
  const [selectedFile, setSelectedFile] = useState<RepoFileNode>({
    name: 'auth.ts',
    path: '/src/middleware/auth.ts',
    type: 'file',
    language: 'typescript',
    linesOfCode: 42,
    content: `import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

export class AuthMiddleware {
  // Line 6: SYNCHRONOUS BCRYPT HASHING ON REQUEST EVENT LOOP!
  static verify(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    // Line 14: Hardcoded secret salt and synchronous compareSync block
    const isMasterKey = bcrypt.compareSync(token, '$2b$10$e8w.hardcodedMockSaltString');
    if (!isMasterKey) {
      return res.status(403).json({ error: 'Invalid authentication credentials' });
    }

    next();
  }
}`,
  });

  // Chat conversation
  const [messages, setMessages] = useState<RoastMessage[]>(initialRoastMessages);
  const [replyText, setReplyText] = useState<string>('');
  const [isManagerTyping, setIsManagerTyping] = useState<boolean>(false);

  // Folder open/close states
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '/': true,
    '/src': true,
    '/src/middleware': true,
    '/src/queue': true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleSelectFile = (file: RepoFileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  };

  const handleSendDefense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newCandidateMsg: RoastMessage = {
      id: `m-${Date.now()}`,
      sender: 'candidate',
      timestamp: 'Just now',
      text: replyText,
    };

    setMessages((prev) => [...prev, newCandidateMsg]);
    setReplyText('');
    setIsManagerTyping(true);
    setActiveEmberPanel('chat');

    setTimeout(() => {
      setIsManagerTyping(false);
      setActiveEmberPanel('none');
      const managerResponses: RoastMessage[] = [
        {
          id: `m-${Date.now() + 1}`,
          sender: 'manager',
          timestamp: 'Just now',
          referencedFile: '/src/server.ts',
          referencedLine: 31,
          severity: 'warning',
          text: `Now that you addressed the auth lock, look at \`/src/server.ts\` Line 31.
You are running a synchronous in-memory scan \`queue.getPendingCount()\` directly inside the \`/api/tasks/stats\` endpoint. If there are 200,000 tasks enqueued, this will block the Node.js event loop for several milliseconds on every health-check poll. Why not maintain an atomic counter or use Redis \`LLEN\` exclusively?`,
        },
      ];
      setMessages((prev) => [...prev, ...managerResponses]);
      showToast('Hiring Manager probed an additional failure mode in your repo.');
    }, 1800);
  };

  // Render tree recursively
  const renderTree = (node: RepoFileNode) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders[node.path];
    const isSelected = selectedFile.path === node.path;

    if (isFolder) {
      return (
        <div key={node.path} className="text-xs font-mono">
          <button
            onClick={() => toggleFolder(node.path)}
            className="flex items-center gap-1.5 w-full text-left py-1 px-1.5 rounded hover:bg-white/5 text-[#EFE9D8]/80 hover:text-[#EFE9D8] focus:outline-none"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#E8622C]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#4A5A63]" />
            )}
            <Folder className="w-3.5 h-3.5 text-[#C9962C]" />
            <span className="font-semibold">{node.name}</span>
          </button>
          {isExpanded && node.children && (
            <div className="pl-4 border-l border-[#4A5A63]/30 space-y-0.5 mt-0.5">
              {node.children.map((child) => renderTree(child))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={node.path}
        onClick={() => handleSelectFile(node)}
        className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-xs font-mono transition-colors focus:outline-none ${
          isSelected
            ? 'bg-[#E8622C]/20 text-[#E8622C] font-semibold border-l-2 border-[#E8622C]'
            : 'text-[#EFE9D8]/70 hover:text-[#EFE9D8] hover:bg-white/5'
        }`}
      >
        <FileCode className="w-3.5 h-3.5 text-[#4A5A63]" />
        <span className="truncate">{node.name}</span>
        {node.linesOfCode && (
          <span className="ml-auto text-[10px] text-[#4A5A63]">
            {node.linesOfCode}L
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="crucible-theme min-h-screen bg-[#211D1B] text-[#EFE9D8] p-4 sm:p-6 lg:p-8 space-y-6 selection:bg-[#E8622C]/30">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#4A5A63]/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#E8622C]/20 text-[#E8622C] border border-[#E8622C]/30 font-semibold">
              <Flame className="w-3.5 h-3.5" />
              CRUCIBLE REPO AUDIT
            </span>
            <span className="text-xs font-mono text-[#EFE9D8]/60">
              STERN-BUT-FAIR HIRING MANAGER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#EFE9D8]">
            Roast My Repo Â· Production Defense
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono bg-[#161311] px-4 py-2 rounded-xl border border-[#4A5A63]/60">
          <GitBranch className="w-4 h-4 text-[#E8622C]" />
          <span>REPO: <strong className="text-[#EFE9D8]">distributed-task-queue</strong></span>
          <span className="text-[#4A5A63]">|</span>
          <span className="text-emerald-400">Branch: main</span>
        </div>
      </div>

      {/* Main Split Layout: Left File Explorer + Code Preview | Right Stern Manager Chat */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: FILE TREE + SYNTAX PREVIEW (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#161311] border border-[#4A5A63]/70 overflow-hidden shadow-sm">
            {/* Split within left: Mini tree on top / side, Code preview below */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#4A5A63]/60">
              {/* File Tree Explorer (1/3) */}
              <div className="p-3 bg-[#110e0d] border-r border-[#4A5A63]/60 max-h-56 md:max-h-96 overflow-y-auto space-y-1">
                <div className="text-[10px] font-mono text-[#E8622C] uppercase tracking-wider font-semibold mb-2 px-1">
                  PROJECT EXPLORER
                </div>
                {renderTree(mockRepoTree)}
              </div>

              {/* File Info Bar (2/3 Top) */}
              <div className="md:col-span-2 p-3 bg-[#161311] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#E8622C]" />
                    <span className="font-mono text-xs font-semibold text-[#EFE9D8]">
                      {selectedFile.path}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#4A5A63] uppercase">
                    {selectedFile.language || 'text'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#EFE9D8]/50 mt-1">
                  Click any file in the tree to inspect source code and compare against hiring manager citations.
                </div>
              </div>
            </div>

            {/* Syntax Highlighted Code Viewer with Line Numbers */}
            <div className="bg-[#0e0c0b] p-4 font-mono text-xs overflow-x-auto max-h-[460px] overflow-y-auto">
              <pre className="text-[#EFE9D8]/90 leading-relaxed">
                {selectedFile.content?.split('\n').map((line, idx) => {
                  const lineNum = idx + 1;
                  const isHighlighted =
                    (selectedFile.path.includes('auth.ts') && lineNum === 14) ||
                    (selectedFile.path.includes('worker_pool.go') && lineNum === 29) ||
                    (selectedFile.path.includes('server.ts') && lineNum === 31);

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-4 px-2 rounded ${
                        isHighlighted
                          ? 'bg-[#E8622C]/20 border-l-2 border-[#E8622C] text-[#F2B705]'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <span className="select-none text-[#4A5A63] w-6 text-right shrink-0">
                        {lineNum}
                      </span>
                      <span className="whitespace-pre">{line}</span>
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: STERN-BUT-FAIR HIRING MANAGER CHAT (5 Cols) */}
        <div
          id="crucible-roast-chat-panel"
          className={`lg:col-span-5 rounded-2xl bg-[#161311] border transition-all duration-300 flex flex-col h-[600px] shadow-sm ${
            isManagerTyping || activeEmberPanel === 'chat'
              ? 'live-ember-glow'
              : 'border-[#4A5A63]/70'
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-[#4A5A63]/60 flex items-center justify-between bg-[#1f1917] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E8622C] text-[#211D1B] font-mono font-bold flex items-center justify-center text-xs shadow-sm">
                HM
              </div>
              <div>
                <div className="text-xs font-semibold text-[#EFE9D8]">
                  Principal Architect (Interviewer)
                </div>
                <div className="text-[10px] font-mono text-[#E8622C]">
                  {isManagerTyping ? 'READING SOURCE FILE...' : 'ACTIVE CROSS-EXAMINATION'}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#F2B705] border border-[#F2B705]/30">
              STERN CRITIQUE MODE
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isManager = msg.sender === 'manager';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isManager ? 'items-start' : 'items-end'}`}
                >
                  {/* Referenced Code Citation Tag */}
                  {msg.referencedFile && (
                    <div className="mb-1 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-[#E8622C]/15 text-[#E8622C] border border-[#E8622C]/30">
                      <ShieldAlert className="w-3 h-3" />
                      <span>{msg.referencedFile} : L{msg.referencedLine}</span>
                    </div>
                  )}

                  <div
                    className={`max-w-[90%] p-3.5 rounded-xl text-xs leading-relaxed ${
                      isManager
                        ? 'bg-[#211D1B] border border-[#4A5A63]/70 text-[#EFE9D8]'
                        : 'bg-[#E8622C] text-[#211D1B] font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[9px] font-mono text-[#4A5A63] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isManagerTyping && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#E8622C] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#E8622C] animate-ping" />
                <span>Interviewer is evaluating your architectural justification...</span>
              </div>
            )}
          </div>

          {/* Defense Input Form */}
          <form
            onSubmit={handleSendDefense}
            className="p-3 border-t border-[#4A5A63]/60 bg-[#161311] rounded-b-2xl flex items-center gap-2"
          >
            <input
              id="roast-defense-input"
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Defend your architectural trade-off or explain fix..."
              className="flex-1 bg-[#211D1B] border border-[#4A5A63] rounded-xl px-3 py-2 text-xs font-mono text-[#EFE9D8] focus:border-[#E8622C] focus:outline-none placeholder:text-[#4A5A63]"
            />
            <button
              id="roast-send-defense-btn"
              type="submit"
              disabled={!replyText.trim() || isManagerTyping}
              className="p-2 rounded-xl bg-[#E8622C] text-[#211D1B] hover:bg-[#F2B705] disabled:opacity-40 transition-colors shadow-sm focus:outline-none"
              aria-label="Send Defense"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

