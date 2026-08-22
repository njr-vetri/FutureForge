import { UserRecord } from '../types';

export function readinessScore(user: UserRecord) {
  if (!user.skills.length) return Math.round(user.codingScore * 0.6);

  const skillAvg =
    user.skills.reduce((sum, skill) => sum + skill.confidence, 0) / user.skills.length;
  const profileBonus = Math.min(10, Math.round(user.cgpa));

  return Math.max(0, Math.min(100, Math.round(skillAvg * 0.65 + user.codingScore * 0.25 + profileBonus)));
}

export function estimateGapDays(missingSkills: string[]) {
  return Math.max(1, missingSkills.length * 2);
}

