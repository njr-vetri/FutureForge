import { randomUUID } from 'node:crypto';
import { codingProblems, users as seededUsers } from '../data/store';
import { generateAptitudeBank, generateCodingBank } from '../data/generatedBanks';
import { hashPassword } from './auth';
import { SkillProfile, UserRecord } from '../types';

type RecordName =
  | 'submissions'
  | 'aptitudeResults'
  | 'resumes'
  | 'interviews'
  | 'videoQuizzes'
  | 'videoQuizResults'
  | 'roadmaps'
  | 'crucibleSessions'
  | 'repoReviews'
  | 'gapAnalyses';

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabaseDisabledForSession = false;

const generatedCodingProblems = generateCodingBank(50);
const aptitudeBank = generateAptitudeBank(500);

const memory = {
  users: seededUsers.map((user) => ({
    ...user,
    passwordHash: hashPassword('password123'),
    createdAt: new Date().toISOString(),
  })),
  problems: [...codingProblems],
  aptitudeQuestions: aptitudeBank,
  submissions: [],
  aptitudeResults: [],
  resumes: [],
  interviews: [],
  videoQuizzes: [],
  videoQuizResults: [],
  roadmaps: [],
  crucibleSessions: [],
  repoReviews: [],
  gapAnalyses: [],
} as Record<string, any[]>;

const tableByRecord: Record<RecordName, string> = {
  submissions: 'submissions',
  aptitudeResults: 'aptitude_results',
  resumes: 'resumes',
  interviews: 'interviews',
  videoQuizzes: 'video_quizzes',
  videoQuizResults: 'video_quiz_results',
  roadmaps: 'roadmaps',
  crucibleSessions: 'crucible_sessions',
  repoReviews: 'repo_reviews',
  gapAnalyses: 'gap_analyses',
};

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey && !supabaseDisabledForSession);
}

async function supabaseFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');
  let response: Response;
  try {
    response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: serviceRoleKey as string,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        ...(init.headers || {}),
      },
    });
  } catch (error) {
    supabaseDisabledForSession = true;
    console.warn('Supabase unavailable. Falling back to in-memory store for this backend session.');
    throw error;
  }
  if (!response.ok) {
    const body = await response.text();
    if (response.status >= 500 || response.status === 401 || response.status === 403) {
      supabaseDisabledForSession = true;
      console.warn(`Supabase disabled for this session after ${response.status}: ${body}`);
    }
    throw new Error(`Supabase request failed: ${response.status} ${body}`);
  }
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function userFromRow(row: any): UserRecord & { passwordHash?: string } {
  return {
    id: row.id,
    firebaseUid: row.firebase_uid || undefined,
    name: row.name,
    email: row.email,
    branch: row.branch || 'Computer Science & Engineering',
    year: row.year || '2026',
    cgpa: Number(row.cgpa || 0),
    targetRole: row.target_role || 'Software Engineer',
    targetCompanies: row.target_companies || [],
    codingScore: Number(row.coding_score || 0),
    passwordHash: row.password_hash,
    skills: (row.skill_profiles || []).map((skill: any) => ({
      name: skill.name,
      category: skill.category,
      confidence: Number(skill.confidence || 0),
      verified: Boolean(skill.verified),
      lastUpdated: skill.last_updated,
      evidenceTrail: skill.evidence_trail || [],
    })),
  };
}

function publicUser(user: any): UserRecord {
  const { passwordHash: _passwordHash, password_hash: _password_hash, _id: _id, ...rest } = user;
  return rest as UserRecord;
}

function problemToRow(problem: any) {
  return {
    id: problem.id,
    title: problem.title,
    description: problem.description || '',
    difficulty: problem.difficulty,
    tags: problem.tags || [],
    examples: problem.examples || [],
    constraints: problem.constraints || [],
    starter_code: problem.starterCode || {},
    solution_notes: problem.solutionNotes || '',
    test_cases: problem.testCases || [],
  };
}

function problemFromRow(row: any) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    tags: row.tags || [],
    examples: row.examples || [],
    constraints: row.constraints || [],
    starterCode: row.starter_code || {},
    solutionNotes: row.solution_notes || '',
    testCases: row.test_cases || [],
  };
}

function aptitudeToRow(question: any) {
  return {
    id: question.id,
    category: question.category,
    difficulty: question.difficulty,
    question: question.question,
    options: question.options || [],
    correct_index: question.correctIndex,
    explanation: question.explanation || '',
    source: question.source || 'seeded',
  };
}

function aptitudeFromRow(row: any) {
  return {
    id: row.id,
    category: row.category,
    difficulty: row.difficulty,
    question: row.question,
    options: row.options || [],
    correctIndex: row.correct_index,
    explanation: row.explanation || '',
    source: row.source || 'seeded',
  };
}

function recordToRow(name: RecordName, payload: any) {
  if (name === 'submissions') {
    return {
      user_id: payload.userId,
      problem_id: payload.problemId,
      code: payload.code,
      language: payload.language,
      custom_input: payload.input || '',
      verdict: payload.verdict,
      stdout: payload.stdout || '',
      stderr: payload.stderr || '',
      runtime_ms: payload.runtimeMs || 0,
    };
  }
  if (name === 'aptitudeResults') {
    return {
      user_id: payload.userId,
      category_scores: payload.categoryScores || {},
      overall_score: payload.score ?? payload.overallScore ?? 0,
      accuracy: payload.total ? Number(payload.correct || 0) / Number(payload.total) : 0,
      time_taken_seconds: payload.timeTakenSeconds || 0,
      answers: payload.answers || [],
    };
  }
  if (name === 'resumes') {
    return {
      user_id: payload.userId,
      extracted_text: payload.extractedText || '',
      target_role: payload.targetRole || 'Software Engineer',
      score: payload.score || 0,
      matched_skills: payload.matchedSkills || [],
      missing_skills: payload.missingSkills || [],
      suggestions: payload.suggestions || [],
      roast_text: payload.roastText || null,
    };
  }
  if (name === 'interviews') {
    return {
      user_id: payload.userId,
      mode: payload.mode || 'text',
      qa_pairs: payload.qaPairs || [],
      follow_ups: payload.followUps || [],
      tech_score: payload.scores?.technical || payload.techScore || 0,
      clarity_score: payload.scores?.clarity || payload.clarityScore || 0,
      comm_score: payload.scores?.communication || payload.commScore || 0,
      weak_areas: payload.weakAreas || [],
    };
  }
  if (name === 'videoQuizzes') {
    return {
      video_id: payload.videoId,
      topic: payload.topic,
      transcript: payload.transcript || '',
      mcqs: payload.mcqs || [],
    };
  }
  if (name === 'videoQuizResults') {
    return {
      user_id: payload.userId,
      video_quiz_id: payload.videoQuizId || null,
      score: payload.score || 0,
    };
  }
  if (name === 'roadmaps') {
    return {
      user_id: payload.userId,
      target_role: payload.targetRole || 'Software Engineer',
      days: payload.days || [],
      generated_at: payload.generatedAt || new Date().toISOString(),
    };
  }
  if (name === 'crucibleSessions') {
    return {
      user_id: payload.userId,
      parent_session_id: payload.parentSessionId || null,
      status: payload.status || null,
      phase: payload.phase || null,
      problem: payload.problem || {},
      phases: payload.phases || {},
      execution: payload.execution || {},
      evaluation: payload.evaluation || {},
      completed: Boolean(payload.completed),
    };
  }
  if (name === 'repoReviews') {
    return {
      user_id: payload.userId,
      parent_review_id: payload.parentReviewId || null,
      repo_url: payload.repoUrl || null,
      snapshot: payload.snapshot || {},
      review: payload.review || {},
      answer: payload.answer || null,
      follow_up: payload.followUp || {},
    };
  }
  return {
    user_id: payload.userId,
    target_role: payload.targetRole,
    company: payload.company,
    role_fit: payload.roleFit,
    biggest_skill_gap: payload.biggestSkillGap || {},
    priority_areas: payload.priorityAreas || [],
    skills: payload.skills || [],
    seven_day_plan: payload.sevenDayPlan || [],
  };
}

function rowToRecord(name: RecordName, row: any) {
  const base = { id: row.id, createdAt: row.created_at };
  if (name === 'videoQuizzes') return { ...base, videoId: row.video_id, topic: row.topic, transcript: row.transcript, mcqs: row.mcqs || [] };
  if (name === 'videoQuizResults') return { ...base, userId: row.user_id, videoQuizId: row.video_quiz_id, score: row.score };
  if (name === 'roadmaps') return { ...base, userId: row.user_id, targetRole: row.target_role, days: row.days || [], generatedAt: row.generated_at };
  return { ...base, ...row };
}

export async function seedDatabaseIfEmpty() {
  if (!isSupabaseConfigured()) return;

  const demoUserId = '11111111-1111-1111-1111-111111111111';
  const userRows = await supabaseFetch<any[]>(`users?id=eq.${demoUserId}&select=id`);
  if (!userRows.length) {
    await supabaseFetch('users?on_conflict=id', {
      method: 'POST',
      body: JSON.stringify([{ id: demoUserId, email: 'demo@careeros.com', name: 'Demo Candidate' }]),
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    });
  }

  await supabaseFetch('problems?on_conflict=id', {
    method: 'POST',
    body: JSON.stringify(memory.problems.map(problemToRow)),
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  });

  await supabaseFetch('aptitude_questions?on_conflict=id', {
    method: 'POST',
    body: JSON.stringify(memory.aptitudeQuestions.map(aptitudeToRow)),
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  });
}

export async function getBackendStatus() {
  return {
    database: isSupabaseConfigured() ? 'supabase' : 'memory',
    supabaseConfigured: isSupabaseConfigured(),
    seededProblems: memory.problems.length,
    seededAptitudeQuestions: memory.aptitudeQuestions.length,
  };
}

export async function listUsers() {
  if (!isSupabaseConfigured()) return memory.users.map(publicUser);
  const rows = await supabaseFetch<any[]>('users?select=*,skill_profiles(*)&order=coding_score.desc');
  return rows.map(userFromRow).map(publicUser);
}

export async function findUserById(id: string) {
  if (!isSupabaseConfigured()) {
    const user = memory.users.find((item) => item.id === id);
    return user ? publicUser(user) : null;
  }
  const rows = await supabaseFetch<any[]>(`users?id=eq.${encodeURIComponent(id)}&select=*,skill_profiles(*)`);
  return rows[0] ? publicUser(userFromRow(rows[0])) : null;
}

export async function findPrivateUserByEmail(email: string) {
  const normalized = email.toLowerCase();
  if (!isSupabaseConfigured()) return memory.users.find((item) => item.email.toLowerCase() === normalized);
  const rows = await supabaseFetch<any[]>(`users?email=eq.${encodeURIComponent(normalized)}&select=*,skill_profiles(*)`);
  return rows[0] ? userFromRow(rows[0]) : null;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  branch?: string;
  year?: string;
  cgpa?: number;
  targetRole?: string;
}) {
  const user = {
    id: randomUUID(),
    name: input.name,
    email: input.email.toLowerCase(),
    branch: input.branch || 'Computer Science & Engineering',
    year: input.year || '2026',
    cgpa: Number(input.cgpa || 0),
    targetRole: input.targetRole || 'Software Engineer',
    targetCompanies: [],
    skills: [],
    codingScore: 0,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    memory.users.push(user);
    return publicUser(user);
  }

  const rows = await supabaseFetch<any[]>('users', {
    method: 'POST',
    body: JSON.stringify([
      {
        id: user.id,
        email: user.email,
        name: user.name,
        branch: user.branch,
        year: user.year,
        cgpa: user.cgpa,
        target_role: user.targetRole,
        target_companies: user.targetCompanies,
        coding_score: user.codingScore,
        password_hash: user.passwordHash,
      },
    ]),
  });
  return publicUser(userFromRow(rows[0]));
}

export async function upsertFirebaseUser(firebaseUser: { uid: string; email: string; name: string; picture?: string }) {
  if (!isSupabaseConfigured()) {
    const existing = memory.users.find((item) => item.firebaseUid === firebaseUser.uid);
    if (existing) return publicUser(existing);
    const user = {
      id: randomUUID(),
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email.toLowerCase(),
      name: firebaseUser.name,
      branch: 'Computer Science & Engineering',
      year: '2026',
      cgpa: 0,
      targetRole: 'Software Engineer',
      targetCompanies: [],
      codingScore: 0,
      skills: [],
      avatarUrl: firebaseUser.picture,
      createdAt: new Date().toISOString(),
    };
    memory.users.push(user);
    return publicUser(user);
  }

  const rows = await supabaseFetch<any[]>('users?on_conflict=firebase_uid', {
    method: 'POST',
    body: JSON.stringify([
      {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email.toLowerCase(),
        name: firebaseUser.name,
        avatar_url: firebaseUser.picture,
        branch: 'Computer Science & Engineering',
        year: '2026',
        target_role: 'Software Engineer',
      },
    ]),
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  });
  return publicUser(userFromRow(rows[0]));
}

export async function saveUserSkill(userId: string, skill: SkillProfile) {
  if (!isSupabaseConfigured()) {
    const user = memory.users.find((item) => item.id === userId);
    if (!user) return;
    user.skills = [skill, ...user.skills.filter((item: SkillProfile) => item.name.toLowerCase() !== skill.name.toLowerCase())];
    return;
  }

  await supabaseFetch('skill_profiles?on_conflict=user_id,name', {
    method: 'POST',
    body: JSON.stringify([
      {
        user_id: userId,
        name: skill.name,
        category: skill.category,
        confidence: skill.confidence,
        verified: skill.verified,
        last_updated: skill.lastUpdated,
        evidence_trail: skill.evidenceTrail,
      },
    ]),
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  });
}

export async function listProblems() {
  // Always return curated memory.problems instead of fetching from Supabase
  // because the Supabase database is still filled with the 50 dummy questions.
  return memory.problems;
}

export async function findProblem(problemId: string) {
  const problems = await listProblems();
  return problems.find((item: any) => item.id === problemId);
}

export async function listAptitudeQuestions(filters: { count?: number; category?: string; difficulty?: string }) {
  const count = Math.max(1, Math.min(50, Number(filters.count || 10)));
  if (!isSupabaseConfigured()) {
    const rows = memory.aptitudeQuestions.filter((item) => {
      return (!filters.category || item.category === filters.category) && (!filters.difficulty || item.difficulty === filters.difficulty);
    });
    return [...rows].sort(() => Math.random() - 0.5).slice(0, count);
  }

  const query = ['select=*'];
  if (filters.category) query.push(`category=eq.${encodeURIComponent(filters.category)}`);
  if (filters.difficulty) query.push(`difficulty=eq.${encodeURIComponent(filters.difficulty)}`);
  query.push(`limit=${count}`);
  const rows = await supabaseFetch<any[]>(`aptitude_questions?${query.join('&')}`);
  return rows.map(aptitudeFromRow).sort(() => Math.random() - 0.5).slice(0, count);
}

export async function findAptitudeQuestions(ids: string[]) {
  if (!isSupabaseConfigured()) {
    const set = new Set(ids);
    return memory.aptitudeQuestions.filter((item) => set.has(item.id));
  }
  if (!ids.length) return [];
  const rows = await supabaseFetch<any[]>(`aptitude_questions?id=in.(${ids.map(encodeURIComponent).join(',')})&select=*`);
  return rows.map(aptitudeFromRow);
}

export async function insertRecord(name: RecordName, payload: any) {
  if (payload.userId === 'current-user') {
    payload.userId = '11111111-1111-1111-1111-111111111111';
  }
  
  const id = randomUUID();
  if (!isSupabaseConfigured()) {
    const record = { id, ...payload, createdAt: new Date().toISOString() };
    memory[name].push(record);
    return record;
  }

  const table = tableByRecord[name];
  const rows = await supabaseFetch<any[]>(table, {
    method: 'POST',
    body: JSON.stringify([{ id, ...recordToRow(name, payload) }]),
  });
  return rowToRecord(name, rows[0]);
}
