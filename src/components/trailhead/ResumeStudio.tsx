import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  Target
} from 'lucide-react';

export const ResumeStudio: React.FC = () => {
  const { profile, showToast } = useApp();
  const [appState, setAppState] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const targetRole = profile?.targetRoles?.[0] || 'Software Engineer';

  const [suggestions, setSuggestions] = useState<any[]>([
    {
      id: 's1',
      type: 'bullet',
      original: 'Built a task queue using Redis and Go for processing async tasks in our college server.',
      enhanced: 'Engineered a concurrent task distribution pipeline in Go and Redis with non-blocking worker pools, reducing p99 job latency by 42% across 50,000 requests.',
      isApplied: false,
    },
    {
      id: 's2',
      type: 'bullet',
      original: 'Worked on database indexes in PostgreSQL to make queries faster.',
      enhanced: 'Optimized PostgreSQL composite B-tree indexing and query execution plans, slashing sequential scan durations from 1.4s to 18ms on a 5M-row ledger.',
      isApplied: false,
    },
    {
      id: 's3',
      type: 'general',
      text: 'Add a measurable achievement to your final year project description (e.g., "Supported 500+ users").',
      isApplied: false,
    },
    {
      id: 's4',
      type: 'general',
      text: `Resume is missing a Skills section keyword match for "Docker", which is highly requested for ${targetRole} roles.`,
      isApplied: false,
    }
  ]);

  const matchedSkills = analysisResult?.matchedSkills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git'];
  const missingSkills = analysisResult?.missingSkills || ['Docker', 'AWS', 'GraphQL', 'CI/CD'];
  const appliedSuggestions = suggestions.filter(s => s.isApplied);

  const normalizeSuggestion = (s: any, i: number) => {
    const fallbackOriginals = [
      'Project work is described without clear measurable impact.',
      'Technical stack is listed, but the outcome is not quantified.',
      `Resume does not clearly connect experience to ${targetRole} requirements.`,
    ];
    const fallbackEnhanced = [
      'Engineered a production-ready project module with clear ownership, technical scope, and measurable performance or user impact.',
      'Optimized implementation quality by documenting stack decisions, measurable results, and deployment-ready engineering practices.',
      `Reframed experience around ${targetRole} keywords, technical depth, and outcome-focused evidence.`,
    ];
    const type = s?.type === 'general' ? 'general' : 'bullet';
    if (type === 'general') {
      return {
        id: `s${i}`,
        type,
        text: s?.text || `Add honest evidence for missing keywords: ${missingSkills.slice(0, 3).join(', ')}.`,
        isApplied: false,
      };
    }
    return {
      id: `s${i}`,
      type,
      original: s?.original || fallbackOriginals[i % fallbackOriginals.length],
      enhanced: s?.enhanced || fallbackEnhanced[i % fallbackEnhanced.length],
      isApplied: false,
    };
  };

  const updatedResumeDraft = useMemo(() => {
    const improvedBullets = appliedSuggestions
      .filter(s => s.type === 'bullet')
      .map(s => `- ${s.enhanced}`);
    const generalFixes = appliedSuggestions
      .filter(s => s.type !== 'bullet')
      .map(s => `- ${s.text}`);
    const selectedSkills = Array.from(new Set([...matchedSkills, ...missingSkills.slice(0, 4)])).filter(Boolean);
    const sourceSnippet = String(analysisResult?.originalResumeText || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 700);

    return [
      `${profile?.name || 'Candidate Name'}`,
      `${profile?.email || 'email@example.com'}${profile?.phone ? ` | ${profile.phone}` : ''}${profile?.location ? ` | ${profile.location}` : ''}`,
      profile?.github || profile?.linkedin || profile?.portfolio
        ? [profile.github, profile.linkedin, profile.portfolio].filter(Boolean).join(' | ')
        : '',
      '',
      `TARGET ROLE: ${targetRole}`,
      '',
      'SUMMARY',
      `ATS-focused ${targetRole} candidate with evidence across ${matchedSkills.slice(0, 4).join(', ') || 'software engineering'} and a resume refined for measurable ownership, technical clarity, and recruiter scanning.`,
      '',
      'CORE SKILLS',
      selectedSkills.join(' | '),
      '',
      'UPDATED EXPERIENCE BULLETS',
      improvedBullets.length ? improvedBullets.join('\n') : '- Apply suggested bullet changes to generate improved experience bullets.',
      '',
      generalFixes.length ? 'ADDITIONAL RESUME FIXES' : '',
      generalFixes.join('\n'),
      generalFixes.length ? '' : '',
      'SOURCE RESUME SNAPSHOT',
      sourceSnippet || 'Original resume text was parsed from the uploaded PDF. Apply suggestions above to create the revised version.',
    ].filter(line => line !== '').join('\n');
  }, [analysisResult, appliedSuggestions, matchedSkills, missingSkills, profile, targetRole]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setAppState('analyzing');

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('userId', profile?.id || '11111111-1111-1111-1111-111111111111');
    formData.append('targetRole', targetRole);

    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnalysisResult(data);

      if (data.suggestions?.length) {
        setSuggestions(data.suggestions.map(normalizeSuggestion));
      }

      setAppState('results');
    } catch (err) {
      showToast('Failed to analyze resume. Make sure backend is running.');
      setAppState('upload');
    }
  };

  const handleReupload = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setAppState('upload');
    setSuggestions(suggestions.map(s => ({ ...s, isApplied: false })));
  };

  const toggleSuggestion = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, isApplied: !s.isApplied } : s));
    showToast('Resume draft updated.');
  };

  const handleExport = () => {
    if (!analysisResult) return;
    const content = `${updatedResumeDraft}\n\n---\nGenerated by CareerOS Trailhead\nMatch Score: ${analysisResult.score}/100`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Updated_Resume_${targetRole.replace(/\\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Updated resume exported successfully!');
  };

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 selection:bg-[#C9962C]/30 font-sans">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD4C0] pb-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1F3A34] text-[#C9962C] font-semibold">
              <FileText className="w-3.5 h-3.5" />
              RESUME STUDIO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1D1B]">
            AI ATS Optimization
          </h1>
        </div>
        
        {appState === 'results' && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleReupload}
              className="px-4 py-2 rounded-xl bg-white border border-[#DCD4C0] text-[#1A1D1B] hover:bg-[#F7F8F5] font-mono text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Re-upload
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-xl bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26] font-mono text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4 text-[#C9962C]" />
              Export Updated Resume
            </button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* STATE 1: Upload */}
        {(appState === 'upload' || appState === 'analyzing') && (
          <div className="bg-[#FAF8F2] rounded-2xl border border-[#DCD4C0] p-8 md:p-16 flex flex-col items-center justify-center text-center shadow-sm animate-in fade-in zoom-in-95 duration-300">
            
            <div className={`relative w-20 h-20 mb-6 flex items-center justify-center rounded-full ${appState === 'analyzing' ? 'bg-[#1F3A34]' : 'bg-white border-2 border-dashed border-[#1F3A34]/30'}`}>
              {appState === 'analyzing' ? (
                <Loader2 className="w-8 h-8 text-[#C9962C] animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8 text-[#1F3A34]/50" />
              )}
            </div>

            <h2 className="text-2xl font-display font-bold mb-3">
              {appState === 'analyzing' ? 'Analyzing Resume...' : 'Upload your Resume'}
            </h2>
            
            <p className="text-[#1A1D1B]/60 max-w-sm mx-auto mb-8">
              {appState === 'analyzing' 
                ? 'Running ATS parsing algorithms and matching against target role benchmarks.' 
                : `We'll review your PDF against the ${targetRole} profile to identify missing keywords and impact gaps.`}
            </p>

            {appState === 'upload' && (
              <div className="space-y-4 w-full max-w-sm">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#1F3A34]/30 rounded-xl cursor-pointer bg-white hover:bg-[#F7F8F5] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-[#1A1D1B]/70 font-medium">
                      <span className="font-bold text-[#1F3A34]">Click to browse</span> or drag and drop
                    </p>
                    <p className="text-xs font-mono text-[#1A1D1B]/40">PDF (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                </label>

                {selectedFile && (
                  <div className="p-3 bg-white border border-[#DCD4C0] rounded-lg flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-4 h-4 text-[#1F3A34] flex-shrink-0" />
                      <span className="text-sm font-mono truncate">{selectedFile.name}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile}
                  className={`w-full py-3 rounded-xl font-mono font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                    selectedFile 
                      ? 'bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26]' 
                      : 'bg-[#1F3A34]/10 text-[#1F3A34]/40 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Analyze Resume
                </button>
              </div>
            )}
          </div>
        )}

        {/* STATE 2: Results */}
        {appState === 'results' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. Overall Score */}
            <div className="bg-[#FAF8F2] rounded-2xl border border-[#DCD4C0] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-[#C9962C] flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-3xl font-bold font-mono text-[#1F3A34]">{analysisResult?.score || 82}</span>
              </div>
              <div className="text-center sm:text-left">
                <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono bg-[#1F3A34]/10 text-[#1F3A34] font-bold uppercase tracking-wider mb-2">
                  Target: {targetRole}
                </div>
                <h2 className="text-2xl font-display font-bold text-[#1A1D1B] mb-1">
                  {analysisResult?.roastText || 'Strong technical foundation, but lacks impact metrics.'}
                </h2>
                <p className="text-[#1A1D1B]/70 text-sm leading-relaxed">
                  Your resume successfully parses standard ATS filters, but many of your bullet points describe responsibilities rather than quantified achievements.
                </p>
              </div>
            </div>

            {/* 2. Skills Breakdown */}
            <div className="bg-[#FAF8F2] rounded-2xl border border-[#DCD4C0] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-[#DCD4C0] pb-3 mb-4">
                <Target className="w-5 h-5 text-[#1F3A34]" />
                <h3 className="font-display font-bold text-lg">Keyword Match Analysis</h3>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#1F3A34] mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    MATCHED SKILLS
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 text-[11px] font-mono font-semibold rounded-full bg-white border border-[#C9962C] text-[#1F3A34] shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold text-[#1A1D1B]/60 mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    MISSING FOR TARGET ROLE
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1 text-[11px] font-mono font-medium rounded-full bg-[#1A1D1B]/5 border border-[#1A1D1B]/10 text-[#1A1D1B]/60">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Suggested Improvements */}
            <div className="bg-[#FAF8F2] rounded-2xl border border-[#DCD4C0] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#DCD4C0] pb-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#C9962C]" />
                <h3 className="font-display font-bold text-lg">Suggested Improvements</h3>
              </div>

              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-4 sm:p-5 rounded-xl bg-white border transition-all shadow-xs ${
                      suggestion.isApplied ? 'border-emerald-500/30 bg-emerald-50/30' : 'border-[#DCD4C0]'
                    }`}
                  >
                    {suggestion.type === 'bullet' ? (
                      <div className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="text-[#1A1D1B]/60 line-through decoration-rose-400/50">
                            <span className="font-mono text-[10px] text-rose-600 font-bold uppercase mr-2 tracking-wider">
                              Original:
                            </span>
                            {suggestion.original}
                          </div>
                          <div className="text-[#1A1D1B] font-medium pt-1">
                            <span className="font-mono text-[10px] text-emerald-700 font-bold uppercase mr-2 tracking-wider">
                              Enhanced:
                            </span>
                            {suggestion.enhanced}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-sm text-[#1A1D1B] font-medium">
                        <AlertTriangle className="w-4 h-4 text-[#C9962C] flex-shrink-0 mt-0.5" />
                        <p>{suggestion.text}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-end pt-4 mt-3 border-t border-[#DCD4C0]/50">
                      <button
                        onClick={() => toggleSuggestion(suggestion.id)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
                          suggestion.isApplied
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26]'
                        }`}
                      >
                        {suggestion.isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Applied
                          </>
                        ) : (
                          'Apply to Resume'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Updated Resume Draft */}
            <div className="bg-[#FAF8F2] rounded-2xl border border-[#DCD4C0] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCD4C0] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#1F3A34]" />
                  <h3 className="font-display font-bold text-lg">Minimal Updated Resume</h3>
                </div>
                <span className="text-[11px] font-mono text-[#1A1D1B]/60">
                  {appliedSuggestions.length} change{appliedSuggestions.length === 1 ? '' : 's'} applied
                </span>
              </div>
              <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl bg-white border border-[#DCD4C0] p-5 text-xs sm:text-sm leading-relaxed text-[#1A1D1B] font-mono">
                {updatedResumeDraft}
              </pre>
              <div className="flex justify-end">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 rounded-xl bg-[#1F3A34] text-[#EFE9D8] hover:bg-[#162B26] font-mono text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4 text-[#C9962C]" />
                  Download .txt
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
