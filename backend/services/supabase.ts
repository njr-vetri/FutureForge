import { FirebaseUser, SkillProfile, UserRecord } from '../types';

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey);
}

async function supabaseFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey as string,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${body}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function userFromRow(row: any): UserRecord {
  return {
    id: row.id,
    firebaseUid: row.firebase_uid,
    name: row.name,
    email: row.email,
    branch: row.branch || 'Computer Science & Engineering',
    year: row.year || '2026',
    cgpa: Number(row.cgpa || 0),
    targetRole: row.target_role || 'Software Engineer',
    targetCompanies: row.target_companies || [],
    codingScore: Number(row.coding_score || 0),
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

export async function upsertFirebaseUser(firebaseUser: FirebaseUser) {
  const rows = await supabaseFetch<any[]>('users?on_conflict=firebase_uid', {
    method: 'POST',
    body: JSON.stringify([
      {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name,
        avatar_url: firebaseUser.picture,
        branch: 'Computer Science & Engineering',
        year: '2026',
        target_role: 'Software Engineer',
      },
    ]),
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
  });

  return userFromRow(rows[0]);
}

export async function getUserById(userId: string) {
  const rows = await supabaseFetch<any[]>(
    `users?id=eq.${encodeURIComponent(userId)}&select=*,skill_profiles(*)`
  );
  return rows[0] ? userFromRow(rows[0]) : null;
}

export async function getUserByFirebaseUid(firebaseUid: string) {
  const rows = await supabaseFetch<any[]>(
    `users?firebase_uid=eq.${encodeURIComponent(firebaseUid)}&select=*,skill_profiles(*)`
  );
  return rows[0] ? userFromRow(rows[0]) : null;
}

export async function listUsers() {
  const rows = await supabaseFetch<any[]>('users?select=*,skill_profiles(*)&order=coding_score.desc');
  return rows.map(userFromRow);
}

export async function upsertSkillProfile(userId: string, skill: SkillProfile) {
  const rows = await supabaseFetch<any[]>('skill_profiles?on_conflict=user_id,name', {
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
    headers: {
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
  });

  return rows[0];
}

export async function insertSubmission(payload: {
  userId: string;
  problemId: string;
  code: string;
  language: string;
  input?: string;
  verdict: string;
  stdout: string;
  stderr: string;
  runtimeMs: number;
}) {
  return supabaseFetch('submissions', {
    method: 'POST',
    body: JSON.stringify([
      {
        user_id: payload.userId,
        problem_id: payload.problemId,
        code: payload.code,
        language: payload.language,
        custom_input: payload.input || '',
        verdict: payload.verdict,
        stdout: payload.stdout,
        stderr: payload.stderr,
        runtime_ms: payload.runtimeMs,
      },
    ]),
  });
}

export async function insertResumeAnalysis(payload: Record<string, unknown>) {
  return supabaseFetch('resumes', {
    method: 'POST',
    body: JSON.stringify([payload]),
  });
}

export async function insertInterview(payload: Record<string, unknown>) {
  return supabaseFetch('interviews', {
    method: 'POST',
    body: JSON.stringify([payload]),
  });
}

