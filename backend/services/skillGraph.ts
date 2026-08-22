import { findUserById, saveUserSkill } from './repository';
import { SkillCategory } from '../types';

const categoryBySkill = (skill: string): SkillCategory => {
  const value = skill.toLowerCase();
  if (value.includes('aptitude') || value.includes('quant')) return 'Aptitude';
  if (value.includes('communication') || value.includes('interview') || value.includes('spoken')) return 'Communication';
  if (value.includes('git') || value.includes('project') || value.includes('repo')) return 'Projects';
  if (value.includes('system') || value.includes('database') || value.includes('redis')) return 'System Design';
  return 'Algorithms';
};

export async function updateSkillGraph(
  userId: string,
  payload: { skill: string; event: string; result: string; score?: number; verified?: boolean }
) {
  if (!userId || String(userId) === 'undefined' || userId === 'current-user') {
    userId = '11111111-1111-1111-1111-111111111111';
  }

  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  const existing = user.skills.find((skill) => skill.name.toLowerCase() === payload.skill.toLowerCase());
  const scoreDelta = payload.score ?? (payload.result === 'pass' ? 6 : payload.result === 'fail' ? -4 : 2);
  const evidence = {
    event: payload.event,
    result: payload.result,
    scoreDelta,
    createdAt: new Date().toISOString(),
  };

  if (existing) {
    existing.confidence = Math.max(0, Math.min(100, existing.confidence + scoreDelta));
    existing.verified = existing.verified || Boolean(payload.verified);
    existing.lastUpdated = evidence.createdAt;
    existing.evidenceTrail.unshift(evidence);
    await saveUserSkill(userId, existing);
    return existing;
  }

  const created = {
    name: payload.skill,
    category: categoryBySkill(payload.skill),
    confidence: Math.max(0, Math.min(100, 45 + scoreDelta)),
    verified: Boolean(payload.verified),
    lastUpdated: evidence.createdAt,
    evidenceTrail: [evidence],
  };
  await saveUserSkill(userId, created);
  return created;
}
