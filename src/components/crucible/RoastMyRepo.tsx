import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";

import {
  GitBranch, Folder, FileCode, Flame, Send, ShieldAlert,
  ChevronDown, ChevronRight, Code, Link, Loader2, CheckCircle2, RotateCcw,
} from "lucide-react";

const renderTree = (node, selectedFile, handleSelectFile, expandedFolders, toggleFolder) => {
  const isFolder = node.type === "folder";
  const isExpanded = expandedFolders[node.path];
  const isSelected = selectedFile?.path === node.path;
  if (isFolder) {
    return (
      <div key={node.path} className="text-xs font-mono">
        <button onClick={() => toggleFolder(node.path)}
          className="flex items-center gap-1.5 w-full text-left py-1 px-1.5 rounded hover:bg-white/5 text-[#EFE9D8]/80 hover:text-[#EFE9D8] focus:outline-none">
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-[#E8622C]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#4A5A63]" />}
          <Folder className="w-3.5 h-3.5 text-[#C9962C]" />
          <span className="font-semibold">{node.name}</span>
        </button>
        {isExpanded && node.children && (
          <div className="pl-4 border-l border-[#4A5A63]/30 space-y-0.5 mt-0.5">
            {node.children.map((child) => renderTree(child, selectedFile, handleSelectFile, expandedFolders, toggleFolder))}
          </div>
        )}
      </div>
    );
  }
  return (
    <button key={node.path} onClick={() => handleSelectFile(node)}
      className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded text-xs font-mono transition-colors focus:outline-none ${
        isSelected ? "bg-[#E8622C]/20 text-[#E8622C] font-semibold border-l-2 border-[#E8622C]"
          : "text-[#EFE9D8]/70 hover:text-[#EFE9D8] hover:bg-white/5"}`}>
      <FileCode className="w-3.5 h-3.5 text-[#4A5A63]" />
      <span className="truncate">{node.name}</span>
      {node.linesOfCode && <span className="ml-auto text-[10px] text-[#4A5A63]">{node.linesOfCode}L</span>}
    </button>
  );
};

const buildRepoTree = (files) => {
  const root = { name: "/", path: "/", type: "folder", children: [] };
  files.forEach((file) => {
    const parts = file.path.split("/").filter(Boolean);
    let current = root;
    parts.forEach((part, index) => {
      const path = `/${parts.slice(0, index + 1).join("/")}`;
      const isFile = index === parts.length - 1;
      let child = current.children.find((item) => item.path === path);
      if (!child) {
        child = isFile
          ? {
              name: part,
              path,
              type: "file",
              language: part.split(".").pop() || "text",
              linesOfCode: file.content ? file.content.split("\n").length : 0,
              content: file.content || "",
            }
          : { name: part, path, type: "folder", children: [] };
        current.children.push(child);
      }
      current = child;
    });
  });
  return root;
};

const messagesFromReview = (review, snapshot) => {
  const intro = {
    id: "m-review-intro",
    sender: "manager",
    timestamp: "Just now",
    text: review?.summary || `I loaded ${snapshot?.repo || "this repository"} and found a few production-readiness concerns. Defend your choices carefully.`,
  };
  const issues = (review?.issues || []).slice(0, 3).map((issue, index) => ({
    id: `m-review-${index}`,
    sender: "manager",
    timestamp: "Just now",
    referencedFile: issue.file,
    referencedLine: issue.line,
    severity: issue.severity || "warning",
    text: `${issue.title || "Repository concern"}\n\n${issue.explanation || ""}\n\nRecommended direction: ${issue.recommendedFix || "Explain your production fix."}`,
  }));
  const opening = {
    id: "m-review-question",
    sender: "manager",
    timestamp: "Just now",
    severity: "critical",
    text: review?.openingQuestion || "Defend the highest-risk failure mode in this repository and explain your fix.",
  };
  return [intro, ...issues, opening];
};

export const RoastMyRepo = () => {
  const { activeEmberPanel, setActiveEmberPanel, showToast } = useApp();

  // Step 1: URL input state
  const [repoUrl, setRepoUrl] = useState("");
  const [loadState, setLoadState] = useState("idle"); // idle | loading | loaded
  const [repoName, setRepoName] = useState("");
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState("");

  // Step 2: Repo loaded state
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [isManagerTyping, setIsManagerTyping] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({ "/": true, "/src": true, "/src/middleware": true, "/src/queue": true });
  const [repoTree, setRepoTree] = useState(null);
  const [reviewContext, setReviewContext] = useState(null);
  const [reviewId, setReviewId] = useState("");
  const [repoSource, setRepoSource] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isManagerTyping]);

  const handleLoadRepo = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    let name = repoUrl.trim();
    // Try to extract from github URL
    const match = name.match(/github\.com\/[^/]+\/([^/\s]+)/i);
    if (match) name = match[1].replace(/\.git$/, "");
    else name = name.split("/").pop()?.replace(/\.git$/, "") || "repo";

    setRepoName(name);
    setLoadState("loading");
    setLoadProgress(18);
    setLoadStatus("Fetching GitHub repository...");

    try {
      const response = await fetch("/api/crucible/repo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          userId: "11111111-1111-1111-1111-111111111111",
        }),
      });
      const data = await response.json();
      const files = data.snapshot?.files || [];
      const tree = buildRepoTree(files);
      const firstFile = files[0]
        ? {
            name: files[0].path.split("/").pop(),
            path: `/${files[0].path}`,
            type: "file",
            language: files[0].path.split(".").pop() || "text",
            linesOfCode: files[0].content ? files[0].content.split("\n").length : 0,
            content: files[0].content || "",
          }
        : null;
      setLoadProgress(100);
      setLoadStatus(data.source === "github" ? "GitHub analysis ready!" : "Fallback analysis ready.");
      setRepoTree(tree);
      setSelectedFile(firstFile);
      setMessages(messagesFromReview(data.review, data.snapshot));
      setReviewContext({ review: data.review, snapshot: data.snapshot });
      setReviewId(data.id || "demo");
      setRepoSource(data.source || "github");
      setLoadState("loaded");
      showToast(data.source === "github" ? `Repo "${name}" loaded from GitHub.` : `Repo "${name}" used fallback data. Check URL or GitHub token.`);
    } catch {
      setLoadState("idle");
      showToast("Unable to load repo. Start the backend and verify the GitHub URL.");
    }
  };

  const toggleFolder = (path) => setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  const handleSelectFile = (file) => { if (file.type === "file") setSelectedFile(file); };

  const handleSendDefense = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const newMsg = { id: `m-${Date.now()}`, sender: "candidate", timestamp: "Just now", text: replyText };
    setMessages((prev) => [...prev, newMsg]);
    const answerText = replyText;
    setReplyText("");
    setIsManagerTyping(true);
    setActiveEmberPanel("chat");

    try {
      const response = await fetch(`/api/crucible/repo/${reviewId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: answerText,
          userId: '11111111-1111-1111-1111-111111111111',
          review: reviewContext?.review || {},
          lastQuestion: messages.filter((m) => m.sender === "manager").slice(-1)[0]?.text || "",
          selectedFile,
        }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, {
        id: `m-${Date.now()+1}`, sender: "manager", timestamp: "Just now", severity: data.severity || "warning",
        referencedFile: data.referencedFile,
        referencedLine: data.referencedLine,
        text: data.text || data.followUpQuestion || data.question || "Good. Now, how would you handle this at scale?",
      }]);
      showToast("Hiring Manager probed an additional failure mode in your repo.");
    } catch {
      setMessages((prev) => [...prev, {
        id: `m-${Date.now()+1}`, sender: "manager", timestamp: "Just now", severity: "warning",
        text: "How would you approach this problem differently under high load?",
      }]);
    } finally {
      setIsManagerTyping(false);
      setActiveEmberPanel("none");
    }
  };

  // ── STEP 1: URL Input Screen ──
  if (loadState === "idle") {
    return (
      <div className="crucible-theme min-h-screen bg-[#211D1B] text-[#EFE9D8] flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#E8622C]/20 text-[#E8622C] border border-[#E8622C]/30 font-semibold mb-2">
              <Flame className="w-3.5 h-3.5" />
              CRUCIBLE REPO AUDIT
            </div>
            <h1 className="text-4xl font-display font-bold text-[#EFE9D8]">Roast My Repo</h1>
            <p className="text-sm text-[#EFE9D8]/60 leading-relaxed max-w-sm mx-auto">
              Paste your GitHub repository URL below. Our AI Hiring Manager will analyze your code and conduct a stern cross-examination of your architectural decisions.
            </p>
          </div>

          <form onSubmit={handleLoadRepo} className="space-y-4">
            <div className="relative">
              <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5A63]" />
              <input
                id="repo-url-input"
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full bg-[#161311] border border-[#4A5A63] focus:border-[#E8622C] rounded-xl pl-11 pr-4 py-3.5 text-sm font-mono text-[#EFE9D8] focus:outline-none placeholder:text-[#4A5A63] transition-colors"
              />
            </div>
            <button
              id="load-repo-btn"
              type="submit"
              disabled={!repoUrl.trim()}
              className="w-full py-3.5 rounded-xl bg-[#E8622C] text-[#211D1B] font-bold font-mono text-sm hover:bg-[#F2B705] disabled:opacity-40 transition-all shadow-sm flex items-center justify-center gap-2">
              <Flame className="w-4 h-4" />
              Load & Roast This Repo
            </button>
          </form>

          <div className="text-center">
            <div className="text-[10px] font-mono text-[#4A5A63] mb-3 uppercase tracking-widest">Or try a demo repo</div>
            <div className="flex flex-wrap justify-center gap-2">
              {["distributed-task-queue", "auth-service-node", "payment-gateway"].map((demo) => (
                <button key={demo} onClick={() => setRepoUrl(`https://github.com/example/${demo}`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#161311] border border-[#4A5A63]/60 text-[#EFE9D8]/70 hover:border-[#E8622C]/50 hover:text-[#EFE9D8] transition-colors">
                  {demo}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: Loading Screen ──
  if (loadState === "loading") {
    return (
      <div className="crucible-theme min-h-screen bg-[#211D1B] text-[#EFE9D8] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="relative w-24 h-24 mx-auto">
            <Loader2 className="w-24 h-24 text-[#E8622C] animate-spin" />
            <Flame className="absolute inset-0 m-auto w-8 h-8 text-[#F2B705]" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold mb-2">Loading Repo</h2>
            <p className="text-sm font-mono text-[#EFE9D8]/60">{repoUrl}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono text-[#EFE9D8]/60">
              <span>{loadStatus}</span>
              <span>{loadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#161311] overflow-hidden">
              <div className="h-full rounded-full bg-[#E8622C] transition-all duration-500"
                style={{ width: `${loadProgress}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            {["Clone", "Parse", "Analyze"].map((step, i) => (
              <div key={step} className={`p-2 rounded-lg border text-center transition-colors ${
                loadProgress >= (i+1)*33 ? "bg-[#E8622C]/20 border-[#E8622C]/50 text-[#E8622C]" : "bg-[#161311] border-[#4A5A63]/40 text-[#4A5A63]"}`}>
                {loadProgress >= (i+1)*33 ? <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1" /> : <div className="w-3.5 h-3.5 rounded-full border border-current mx-auto mb-1" />}
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 3: Roast Screen ──
  return (
    <div className="crucible-theme min-h-screen bg-[#211D1B] text-[#EFE9D8] p-4 sm:p-6 lg:p-8 space-y-6 selection:bg-[#E8622C]/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#4A5A63]/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#E8622C]/20 text-[#E8622C] border border-[#E8622C]/30 font-semibold">
              <Flame className="w-3.5 h-3.5" />CRUCIBLE REPO AUDIT
            </span>
            <span className="text-xs font-mono text-[#EFE9D8]/60">STERN-BUT-FAIR HIRING MANAGER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#EFE9D8]">Roast My Repo — Production Defense</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs font-mono bg-[#161311] px-4 py-2 rounded-xl border border-[#4A5A63]/60">
            <GitBranch className="w-4 h-4 text-[#E8622C]" />
            <span>REPO: <strong className="text-[#EFE9D8]">{repoName}</strong></span>
            <span className="text-[#4A5A63]">|</span>
            <span className={repoSource === "github" ? "text-emerald-400" : "text-[#F2B705]"}>
              {repoSource === "github" ? "Source: GitHub" : "Source: fallback"}
            </span>
          </div>
          <button onClick={() => { setLoadState("idle"); setRepoUrl(""); setMessages([]); }}
            className="p-2 rounded-xl bg-[#161311] border border-[#4A5A63]/60 hover:border-[#E8622C]/50 transition-colors text-[#EFE9D8]/60 hover:text-[#EFE9D8]" title="Load different repo">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#161311] border border-[#4A5A63]/70 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#4A5A63]/60">
              <div className="p-3 bg-[#110e0d] border-r border-[#4A5A63]/60 max-h-56 md:max-h-96 overflow-y-auto space-y-1">
                <div className="text-[10px] font-mono text-[#E8622C] uppercase tracking-wider font-semibold mb-2 px-1">PROJECT EXPLORER</div>
                {repoTree && renderTree(repoTree, selectedFile, handleSelectFile, expandedFolders, toggleFolder)}
              </div>
              <div className="md:col-span-2 p-3 bg-[#161311] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#E8622C]" />
                    <span className="font-mono text-xs font-semibold text-[#EFE9D8]">{selectedFile?.path}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#4A5A63] uppercase">{selectedFile?.language || "text"}</span>
                </div>
                <div className="text-[11px] font-mono text-[#EFE9D8]/50 mt-1">Click any file in the tree to inspect source code.</div>
              </div>
            </div>
            <div className="bg-[#0e0c0b] p-4 font-mono text-xs overflow-x-auto max-h-[460px] overflow-y-auto">
              <pre className="text-[#EFE9D8]/90 leading-relaxed">
                {selectedFile?.content?.split("\n").map((line, idx) => {
                  const lineNum = idx + 1;
                  const isHighlighted = (selectedFile.path.includes("auth.ts") && lineNum === 14) ||
                    (selectedFile.path.includes("worker_pool.go") && lineNum === 29) ||
                    (selectedFile.path.includes("server.ts") && lineNum === 31);
                  return (
                    <div key={idx} className={`flex items-start gap-4 px-2 rounded ${
                      isHighlighted ? "bg-[#E8622C]/20 border-l-2 border-[#E8622C] text-[#F2B705]" : "hover:bg-white/5"}`}>
                      <span className="select-none text-[#4A5A63] w-6 text-right shrink-0">{lineNum}</span>
                      <span className="whitespace-pre">{line}</span>
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        </div>

        <div id="crucible-roast-chat-panel"
          className={`lg:col-span-5 rounded-2xl bg-[#161311] border transition-all duration-300 flex flex-col h-[600px] shadow-sm ${
            isManagerTyping || activeEmberPanel === "chat" ? "live-ember-glow" : "border-[#4A5A63]/70"}`}>
          <div className="p-4 border-b border-[#4A5A63]/60 flex items-center justify-between bg-[#1f1917] rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E8622C] text-[#211D1B] font-mono font-bold flex items-center justify-center text-xs shadow-sm">HM</div>
              <div>
                <div className="text-xs font-semibold text-[#EFE9D8]">Principal Architect (Interviewer)</div>
                <div className="text-[10px] font-mono text-[#E8622C]">{isManagerTyping ? "READING SOURCE FILE..." : "ACTIVE CROSS-EXAMINATION"}</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#F2B705] border border-[#F2B705]/30">STERN CRITIQUE MODE</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isManager = msg.sender === "manager";
              return (
                <div key={msg.id} className={`flex flex-col ${isManager ? "items-start" : "items-end"}`}>
                  {msg.referencedFile && (
                    <div className="mb-1 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-[#E8622C]/15 text-[#E8622C] border border-[#E8622C]/30">
                      <ShieldAlert className="w-3 h-3" />
                      <span>{msg.referencedFile} : L{msg.referencedLine}</span>
                    </div>
                  )}
                  <div className={`max-w-[90%] p-3.5 rounded-xl text-xs leading-relaxed ${
                    isManager ? "bg-[#211D1B] border border-[#4A5A63]/70 text-[#EFE9D8]"
                      : "bg-[#E8622C] text-[#211D1B] font-medium"}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[9px] font-mono text-[#4A5A63] mt-1 px-1">{msg.timestamp}</span>
                </div>
              );
            })}
            {isManagerTyping && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#E8622C] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#E8622C] animate-ping" />
                <span>Interviewer is evaluating your architectural justification...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendDefense}
            className="p-3 border-t border-[#4A5A63]/60 bg-[#161311] rounded-b-2xl flex items-center gap-2">
            <input id="roast-defense-input" type="text" value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Defend your architectural trade-off or explain your fix..."
              className="flex-1 bg-[#211D1B] border border-[#4A5A63] rounded-xl px-3 py-2 text-xs font-mono text-[#EFE9D8] focus:border-[#E8622C] focus:outline-none placeholder:text-[#4A5A63]" />
            <button id="roast-send-defense-btn" type="submit" disabled={!replyText.trim() || isManagerTyping}
              className="p-2 rounded-xl bg-[#E8622C] text-[#211D1B] hover:bg-[#F2B705] disabled:opacity-40 transition-colors shadow-sm focus:outline-none" aria-label="Send">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
