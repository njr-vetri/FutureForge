export type Track = 'trailhead' | 'crucible';

export interface SkillScore {
  name: string;
  category: 'Algorithms' | 'System Design' | 'Aptitude' | 'Communication' | 'Projects';
  score: number; // 0 - 100
  target: number; // 0 - 100
  level: 'Novice' | 'Competent' | 'Proficient' | 'Master';
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  location?: string;
  college: string;
  degree?: string;
  batch: string;
  branch: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  cgpa: number;
  readinessScore: number; // Overall 0 - 100
  targetRoles: string[];
  targetCompanies: string[];
  skills: SkillScore[];
  trailheadCompletedWaypoints: number;
  totalWaypoints: number;
  crucibleBadges: string[];
  currentStreakDays: number;
}

export interface Waypoint {
  id: string;
  number: number;
  title: string;
  category: string;
  description: string;
  score: number; // 0 - 100
  status: 'completed' | 'in-progress' | 'locked';
  coordinate: { x: number; y: number }; // Topographic trail coordinates (percentage 0-100)
  tasks: {
    title: string;
    type: 'coding' | 'aptitude' | 'video' | 'resume' | 'interview';
    completed: boolean;
    duration: string;
  }[];
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance: string;
  tags: string[];
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    python: string;
    cpp: string;
    java: string;
    javascript: string;
  };
  solutionNotes: string;
  testCases: {
    input: string;
    expected: string;
  }[];
}

export interface AptitudeQuestion {
  id: string;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability' | 'Core Engineering';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
}

export interface JobOpening {
  id: string;
  company: string;
  role: string;
  location: string;
  type: 'Full-time' | 'Internship';
  package: string;
  deadline: string;
  matchScore: number; // calculated from candidate skills
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  status: 'Not Applied' | 'Applied' | 'Under Review' | 'Shortlisted' | 'Offer';
}

export interface CrucibleWorkflowState {
  currentPhase: 'phaseA' | 'phaseB' | 'phaseC' | 'complete';
  phaseACompleted: boolean;
  phaseBCompleted: boolean;
  phaseCCompleted: boolean;
  logicProblem: {
    title: string;
    scenario: string;
    requirements: string[];
    constraints: string[];
    complexityTarget: string;
  };
  candidateApproach: string;
  code: string;
  selectedLanguage: string;
  testRunStatus: 'idle' | 'running' | 'passed' | 'failed';
  testResults: {
    name: string;
    passed: boolean;
    runtime: string;
    memory: string;
  }[];
  recordingDuration: number;
  isRecording: boolean;
  audioWaveform: number[];
  spokenDefenseTranscript: string;
  managerVerdict?: {
    overallVerdict: 'Pass with Distinction' | 'Conditional Hire' | 'Needs Hardening';
    soundnessScore: number;
    communicationScore: number;
    codeEleganceScore: number;
    critiqueNote: string;
  };
}

export interface RepoFileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: RepoFileNode[];
  content?: string;
  language?: string;
  linesOfCode?: number;
}

export interface RoastMessage {
  id: string;
  sender: 'manager' | 'candidate';
  text: string;
  timestamp: string;
  referencedFile?: string;
  referencedLine?: number;
  severity?: 'critical' | 'warning' | 'kudos';
}

export interface TargetBenchmark {
  roleId: string;
  roleTitle: string;
  company: string;
  salaryBenchmark: string;
  candidateFitScore: number;
  categories: {
    name: string;
    required: number;
    candidate: number;
    gap: number;
    critique: string;
  }[];
  sevenDayRoadmap: {
    day: number;
    focus: string;
    drill: string;
    deliverable: string;
    timeCommitment: string;
  }[];
}
