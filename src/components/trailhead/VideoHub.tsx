import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, PlayCircle, Clock, Tag, ChevronRight, CheckCircle2, Search, Lightbulb, Sparkles } from 'lucide-react';

interface VideoDispatch {
  id: string;
  title: string;
  channel: string;
  videoId: string;
  category: string;
  duration: string;
  description: string;
  skillTag?: string;
}

const mockDispatches: VideoDispatch[] = [
  {
    id: 'v1',
    title: 'The Truth About Tech Interviews',
    channel: 'TechLead Insights',
    videoId: 'dQw4w9WgXcQ', 
    category: 'Career Guidance',
    duration: '12:45',
    description: 'A deep dive into what hiring managers actually look for.',
    skillTag: 'Communication'
  },
  {
    id: 'v2',
    title: 'Mastering Dynamic Programming',
    channel: 'Algorithm Weekly',
    videoId: 'oBt53YbR9Kk', 
    category: 'Technical Deep-Dives',
    duration: '24:10',
    description: 'Breaking down DP problems into manageable sub-problems.',
    skillTag: 'Algorithms'
  },
  {
    id: 'v3',
    title: 'System Design: Rate Limiting',
    channel: 'Architecture Now',
    videoId: 'FU4WjzPe_em',
    category: 'Technical Deep-Dives',
    duration: '18:20',
    description: 'How to design a scalable rate limiter for distributed systems.',
    skillTag: 'System Design'
  },
  {
    id: 'v4',
    title: 'Behavioral Interviews 101',
    channel: 'Career Prep',
    videoId: 'bgT4XW8h-0s',
    category: 'Interview Skills',
    duration: '10:05',
    description: 'Using the STAR method to answer any behavioral question.',
    skillTag: 'Communication'
  },
  {
    id: 'v5',
    title: 'Negotiating Your First Salary',
    channel: 'Money Matters',
    videoId: 't-CgM7Q8OaE',
    category: 'Career Guidance',
    duration: '14:30',
    description: 'Strategies to get the offer you deserve without burning bridges.'
  },
  {
    id: 'v6',
    title: 'Advanced Git Workflow',
    channel: 'DevTools Pro',
    videoId: 'Uszj_k0DGsg',
    category: 'Technical Deep-Dives',
    duration: '22:15',
    description: 'Rebasing, cherry-picking, and resolving complex conflicts.',
    skillTag: 'Projects'
  },
  {
    id: 'v7',
    title: 'Aptitude Math Hacks',
    channel: 'Speed Math',
    videoId: 'vdK2I46qYXE',
    category: 'Interview Skills',
    duration: '08:45',
    description: 'Mental math shortcuts for quantitative assessments.',
    skillTag: 'Aptitude'
  },
  {
    id: 'v8',
    title: 'Speaking with Confidence',
    channel: 'Public Speaking',
    videoId: 'a2MR5XbJtXU',
    category: 'Communication',
    duration: '15:20',
    description: 'Eliminate filler words and project your voice effectively.',
    skillTag: 'Communication'
  },
];

const categories = ['All', 'Career Guidance', 'Technical Deep-Dives', 'Interview Skills', 'Communication'];

export const VideoHub: React.FC = () => {
  const { profile } = useApp();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeVideoId, setActiveVideoId] = useState(mockDispatches[0].id);
  const [showQuiz, setShowQuiz] = useState(false);

  const activeVideo = useMemo(() => mockDispatches.find(v => v.id === activeVideoId) || mockDispatches[0], [activeVideoId]);

  // Find the skill with the lowest score
  const lowestSkill = useMemo(() => {
    if (!profile.skills || profile.skills.length === 0) return null;
    return [...profile.skills].sort((a, b) => a.score - b.score)[0];
  }, [profile.skills]);

  const recommendedVideos = useMemo(() => {
    if (!lowestSkill) return [];
    return mockDispatches.filter(v => v.skillTag === lowestSkill.category).slice(0, 2);
  }, [lowestSkill]);

  const filteredDispatches = useMemo(() => {
    return activeCategory === 'All' 
      ? mockDispatches 
      : mockDispatches.filter(v => v.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#EFE9D8] text-[#1A1D1B] p-4 sm:p-6 lg:p-8 space-y-6 selection:bg-[#C9962C]/30 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCD4C0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#1F3A34] text-[#C9962C] font-semibold">
              <Video className="w-3.5 h-3.5" />
              FIELD DISPATCHES
            </span>
            <span className="text-xs font-mono text-[#1A1D1B]/60 uppercase tracking-widest">
              CURATED KNOWLEDGE BASE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1D1B]">
            Placement Video Library
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Player & Meta */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Video Player */}
          <div className="bg-[#1F3A34] rounded-2xl overflow-hidden shadow-sm border border-[#2A4D45] aspect-video relative flex items-center justify-center">
            {/* Embedded YouTube Player */}
            <iframe 
              className="w-full h-full absolute inset-0"
              src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&mute=1`}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Active Video Meta */}
          <div className="bg-white rounded-2xl p-6 border border-[#DCD4C0] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono text-[#1A1D1B]/60 mb-2 uppercase tracking-wider">
              <span>{activeVideo.channel}</span>
              <span>â€¢</span>
              <span>{activeVideo.duration}</span>
              {activeVideo.skillTag && (
                <>
                  <span>â€¢</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#1F3A34]/5 text-[#1F3A34] font-bold border border-[#1F3A34]/20">
                    {activeVideo.skillTag}
                  </span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-display font-bold text-[#1A1D1B] mb-2">{activeVideo.title}</h2>
            <p className="text-[#1A1D1B]/70 leading-relaxed mb-6">{activeVideo.description}</p>
            
            <button 
              onClick={() => setShowQuiz(!showQuiz)}
              className="px-5 py-2.5 rounded-xl bg-[#1F3A34] text-[#EFE9D8] text-sm font-semibold hover:bg-[#162B26] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Lightbulb className="w-4 h-4 text-[#C9962C]" />
              {showQuiz ? 'Hide Quiz' : 'Test Your Understanding'}
            </button>
            
            {/* Optional Mock Quiz */}
            {showQuiz && (
              <div className="mt-6 p-5 rounded-xl bg-[#EFE9D8]/50 border border-[#DCD4C0] animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#1F3A34]" />
                  <h3 className="font-bold text-[#1F3A34] font-display">Concept Check</h3>
                </div>
                <p className="text-sm text-[#1A1D1B]/80 mb-4 font-medium">Based on the video, which of the following best describes the key takeaway?</p>
                <div className="space-y-2">
                  {['Option A: Focus on syntax over logic.', 'Option B: The STAR method structures behavioral answers.', 'Option C: Rate limiters are only for front-end.', 'Option D: Never negotiate your first offer.'].map((opt, i) => (
                    <button key={i} className="w-full text-left p-3 rounded-lg border border-[#DCD4C0] hover:border-[#1F3A34] hover:bg-white text-sm transition-colors text-[#1A1D1B]/80 hover:text-[#1A1D1B]">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Library List */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all shadow-sm ${
                  activeCategory === cat 
                    ? 'bg-[#1F3A34] text-white border border-[#1F3A34]' 
                    : 'bg-white text-[#1A1D1B]/70 border border-[#DCD4C0] hover:border-[#1F3A34]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Recommendations */}
            {lowestSkill && recommendedVideos.length > 0 && activeCategory === 'All' && (
              <div className="mb-6 p-4 rounded-xl bg-white border-2 border-[#C9962C]/40 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                  <Sparkles className="w-16 h-16 text-[#C9962C]" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#C9962C] font-bold mb-1 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommended For You
                </div>
                <p className="text-xs text-[#1A1D1B]/60 mb-4">
                  Because your {lowestSkill.category} readiness is {lowestSkill.score}%.
                </p>
                <div className="space-y-3 relative z-10">
                  {recommendedVideos.map(vid => (
                    <div 
                      key={`rec-${vid.id}`}
                      onClick={() => setActiveVideoId(vid.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex gap-3 ${
                        activeVideoId === vid.id 
                          ? 'border-[#C9962C] bg-[#C9962C]/5' 
                          : 'border-[#DCD4C0] bg-[#F7F8F5] hover:border-[#1F3A34]'
                      }`}
                    >
                      <div className="w-24 h-16 rounded-md bg-[#1F3A34] flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                        <PlayCircle className="w-6 h-6 text-white/50" />
                        <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-[9px] text-white font-mono">{vid.duration}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#1A1D1B] truncate" title={vid.title}>{vid.title}</div>
                        <div className="text-xs text-[#1A1D1B]/60 truncate">{vid.channel}</div>
                        {vid.skillTag && (
                          <div className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono border border-[#C9962C] text-[#C9962C] uppercase">
                            {vid.skillTag}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* List */}
            {filteredDispatches.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#DCD4C0]">
                <Search className="w-8 h-8 text-[#1A1D1B]/30 mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#1A1D1B]/60">No dispatches in this category yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDispatches.map(vid => (
                  <div 
                    key={vid.id}
                    onClick={() => setActiveVideoId(vid.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 group ${
                      activeVideoId === vid.id 
                        ? 'border-[#1F3A34] bg-white shadow-sm' 
                        : 'border-[#DCD4C0] bg-white/50 hover:bg-white hover:border-[#1F3A34]/50'
                    }`}
                  >
                    <div className="w-24 h-16 rounded-md bg-[#1F3A34] flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                      <img src={`https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                      <PlayCircle className="w-6 h-6 text-white relative z-10 drop-shadow-md" />
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[9px] text-white font-mono z-10">{vid.duration}</div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="text-sm font-bold text-[#1A1D1B] line-clamp-2 leading-tight mb-1" title={vid.title}>{vid.title}</div>
                      <div className="text-xs text-[#1A1D1B]/60 truncate">{vid.channel}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};
