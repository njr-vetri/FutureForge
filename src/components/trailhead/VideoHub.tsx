import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, PlayCircle, Clock, Tag, ChevronRight, CheckCircle2, Search, Lightbulb, Sparkles } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

interface VideoDispatch {
  id: string;
  title: string;
  channel: string;
  videoId: string;
  category: string;
  duration: string;
  description: string;
  skillTag?: string;
  quiz: QuizQuestion[];
}

const mockDispatches: VideoDispatch[] = [
  {
    id: 'v1',
    title: 'How to Prepare for Coding Interviews',
    channel: 'NeetCode',
    videoId: 'Ljk2K_xY2nI', 
    category: 'Career Baseline',
    duration: '11:22',
    description: 'A comprehensive guide on what to expect and how to study for tech interviews.',
    skillTag: 'Career Baseline',
    quiz: [
      { question: 'What is the most important factor in coding interviews?', options: ['Memorizing code', 'Problem solving & communication', 'Typing speed', 'Knowing multiple languages'], answerIndex: 1 },
      { question: 'Should you jump straight into coding?', options: ['Yes, to save time', 'No, always clarify constraints first', 'Only for easy problems', 'Yes, if you know the answer'], answerIndex: 1 },
      { question: 'What is a common mistake candidates make?', options: ['Talking too much', 'Staying completely silent while thinking', 'Using Python', 'Writing pseudo-code'], answerIndex: 1 }
    ]
  },
  {
    id: 'v2',
    title: 'Mastering Dynamic Programming',
    channel: 'freeCodeCamp',
    videoId: 'oBt53YbR9Kk', 
    category: 'DSA & Problem Solving',
    duration: '5:10:00',
    description: 'Breaking down DP problems into manageable sub-problems using memoization and tabulation.',
    skillTag: 'Dynamic Programming',
    quiz: [
      { question: 'What are the two main approaches to DP?', options: ['Sorting and Searching', 'Memoization and Tabulation', 'Greedy and Divide & Conquer', 'BFS and DFS'], answerIndex: 1 },
      { question: 'What does memoization do?', options: ['Caches results of expensive function calls', 'Sorts an array', 'Creates a table iteratively', 'Loops infinitely'], answerIndex: 0 },
      { question: 'Which data structure is typically used for tabulation?', options: ['Tree', 'Array or Matrix', 'Graph', 'Linked List'], answerIndex: 1 }
    ]
  },
  {
    id: 'v3',
    title: 'System Design Course for Beginners',
    channel: 'freeCodeCamp',
    videoId: 'm8Icp_Cid5o',
    category: 'Job Matching & Crucible',
    duration: '2:15:20',
    description: 'A complete overview of system design concepts for modern distributed systems.',
    skillTag: 'System Design',
    quiz: [
      { question: 'What is vertical scaling?', options: ['Adding more servers', 'Upgrading the CPU/RAM of an existing server', 'Using a load balancer', 'Sharding a database'], answerIndex: 1 },
      { question: 'What is the purpose of a Load Balancer?', options: ['To store data', 'To distribute incoming network traffic across multiple servers', 'To encrypt passwords', 'To compile code'], answerIndex: 1 },
      { question: 'What does caching improve?', options: ['Data consistency', 'Read latency/performance', 'Storage capacity', 'Network security'], answerIndex: 1 }
    ]
  },
  {
    id: 'v4',
    title: 'Behavioral Interviews (STAR Method)',
    channel: 'Career Prep',
    videoId: 'bgT4XW8h-0s',
    category: 'Application Readiness',
    duration: '10:05',
    description: 'Using the STAR method to answer any behavioral question perfectly.',
    skillTag: 'Communication',
    quiz: [
      { question: 'What does STAR stand for?', options: ['Situation, Task, Action, Result', 'Stop, Think, Act, React', 'Situation, Time, Action, Review', 'Start, Task, Action, Result'], answerIndex: 0 },
      { question: 'Which part of STAR should take the longest to explain?', options: ['Situation', 'Task', 'Action', 'Result'], answerIndex: 2 },
      { question: 'Why is the "Result" important?', options: ['It wastes time', 'It shows the measurable impact of your actions', 'It is required by law', 'It distracts the interviewer'], answerIndex: 1 }
    ]
  },
  {
    id: 'v5',
    title: 'Operating Systems - Introduction',
    channel: 'Neso Academy',
    videoId: 'vBURTt97EkA',
    category: 'Honest Skill Graph',
    duration: '22:15',
    description: 'Core concepts of operating systems essential for technical screening.',
    skillTag: 'Core CS',
    quiz: [
      { question: 'What is the core component of an Operating System?', options: ['The GUI', 'The Kernel', 'The Compiler', 'The Browser'], answerIndex: 1 },
      { question: 'What is a process?', options: ['A program in execution', 'A static file on disk', 'A hardware component', 'A network packet'], answerIndex: 0 },
      { question: 'Which of these is a CPU scheduling algorithm?', options: ['Round Robin', 'Bubble Sort', 'Binary Search', 'Dijkstra'], answerIndex: 0 }
    ]
  },
  {
    id: 'v6',
    title: 'Data Structures and Algorithms for Beginners',
    channel: 'Programming with Mosh',
    videoId: 'BBpAmxU_NQo',
    category: 'DSA & Problem Solving',
    duration: '1:10:00',
    description: 'Essential data structures and algorithms crash course for coding interviews.',
    skillTag: 'Data Structures',
    quiz: [
      { question: 'What is the time complexity of searching in a Hash Map?', options: ['O(N)', 'O(1) on average', 'O(log N)', 'O(N^2)'], answerIndex: 1 },
      { question: 'Which data structure uses LIFO (Last In First Out)?', options: ['Queue', 'Stack', 'Linked List', 'Array'], answerIndex: 1 },
      { question: 'What is the best case time complexity for sorting an array using Quick Sort?', options: ['O(N log N)', 'O(N^2)', 'O(N)', 'O(1)'], answerIndex: 0 }
    ]
  },
  {
    id: 'v7',
    title: 'Aptitude Math Hacks',
    channel: 'Speed Math',
    videoId: 'vdK2I46qYXE',
    category: 'Screening Readiness',
    duration: '08:45',
    description: 'Mental math shortcuts for quantitative assessments.',
    skillTag: 'Aptitude',
    quiz: [
      { question: 'What is 15% of 200?', options: ['15', '20', '30', '45'], answerIndex: 2 },
      { question: 'If a train travels 60km in 1 hour, how far does it travel in 45 minutes?', options: ['40km', '45km', '50km', '55km'], answerIndex: 1 },
      { question: 'What is the next number in the series: 2, 4, 8, 16...?', options: ['24', '30', '32', '64'], answerIndex: 2 }
    ]
  },
  {
    id: 'v8',
    title: 'Resume Tips for Tech Jobs',
    channel: 'Tech Interview Pro',
    videoId: 'Tt08KmFfIYQ',
    category: 'Application Readiness',
    duration: '15:20',
    description: 'How to structure your resume to get past ATS and land the interview.',
    skillTag: 'Resume',
    quiz: [
      { question: 'What is ATS?', options: ['Automatic Tracking System', 'Applicant Tracking System', 'Advanced Tech Solution', 'Apple Tech Support'], answerIndex: 1 },
      { question: 'Should you include a photo on a standard US tech resume?', options: ['Yes, always', 'No, it can cause bias and ATS issues', 'Only if it is professional', 'Only for design roles'], answerIndex: 1 },
      { question: 'How long should a junior developer resume be?', options: ['3 pages', '2 pages', 'Strictly 1 page', 'As long as needed'], answerIndex: 2 }
    ]
  },
];

export const VideoHub: React.FC = () => {
  const { profile, waypoints } = useApp();
  
  // Dynamically derive video categories from the user's roadmap milestones
  const categories = useMemo(() => {
    const waypointCategories = waypoints.map(w => w.category);
    return ['All', ...Array.from(new Set(waypointCategories))];
  }, [waypoints]);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeVideoId, setActiveVideoId] = useState(mockDispatches[0].id);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const [failedVideoIds, setFailedVideoIds] = useState<Set<string>>(new Set());

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>, id: string) => {
    const img = e.currentTarget;
    // YouTube returns a 120px wide generic grey image for deleted/private videos
    if (img.naturalWidth === 120) {
      setFailedVideoIds(prev => new Set(prev).add(id));
    }
  };

  // Reset quiz state when video changes
  React.useEffect(() => {
    setQuizAnswers({});
    setShowQuiz(false);
  }, [activeVideoId]);

  const availableDispatches = useMemo(() => {
    return mockDispatches.filter(v => !failedVideoIds.has(v.id));
  }, [failedVideoIds]);

  const activeVideo = useMemo(() => {
    return availableDispatches.find(v => v.id === activeVideoId) || availableDispatches[0] || mockDispatches[0];
  }, [activeVideoId, availableDispatches]);

  // Find the skill with the lowest score
  const lowestSkill = useMemo(() => {
    if (!profile.skills || profile.skills.length === 0) return null;
    return [...profile.skills].sort((a, b) => a.score - b.score)[0];
  }, [profile.skills]);

  const recommendedVideos = useMemo(() => {
    if (!lowestSkill) return [];
    return availableDispatches.filter(v => v.skillTag === lowestSkill.category).slice(0, 2);
  }, [lowestSkill, availableDispatches]);

  const filteredDispatches = useMemo(() => {
    return activeCategory === 'All' 
      ? availableDispatches 
      : availableDispatches.filter(v => v.category === activeCategory);
  }, [activeCategory, availableDispatches]);

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
              src={`https://www.youtube.com/embed/${activeVideo.videoId}?rel=0`}
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
              <span>-</span>
              <span>{activeVideo.duration}</span>
              {activeVideo.skillTag && (
                <>
                  <span>-</span>
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
            
            {/* Dynamic Video Quiz */}
            {showQuiz && activeVideo.quiz && (
              <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#1F3A34]" />
                  <h3 className="font-bold text-[#1F3A34] font-display">Concept Check</h3>
                </div>
                
                {activeVideo.quiz.map((q, qIndex) => (
                  <div key={qIndex} className="p-5 rounded-xl bg-[#EFE9D8]/50 border border-[#DCD4C0]">
                    <p className="text-sm text-[#1A1D1B] mb-4 font-semibold">{qIndex + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = quizAnswers[qIndex] === optIndex;
                        const hasAnswered = quizAnswers[qIndex] !== undefined;
                        const isCorrect = optIndex === q.answerIndex;
                        
                        let btnStyle = "border-[#DCD4C0] hover:border-[#1F3A34] hover:bg-white text-[#1A1D1B]/80";
                        if (hasAnswered) {
                          if (isCorrect) {
                            btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-medium";
                          } else if (isSelected) {
                            btnStyle = "border-rose-500 bg-rose-50 text-rose-900 font-medium";
                          } else {
                            btnStyle = "border-[#DCD4C0] opacity-50";
                          }
                        }
                        
                        return (
                          <button 
                            key={optIndex}
                            disabled={hasAnswered}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [qIndex]: optIndex }))}
                            className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
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
                      <img 
                        src={`https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                        alt="" 
                        onError={() => setFailedVideoIds(prev => new Set(prev).add(vid.id))}
                        onLoad={(e) => handleImageLoad(e, vid.id)}
                      />
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
