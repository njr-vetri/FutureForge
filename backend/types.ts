export type SkillCategory =
  | 'Algorithms'
  | 'System Design'
  | 'Aptitude'
  | 'Communication'
  | 'Projects';

export interface SkillEvidence {
  event: string;
  result: string;
  scoreDelta: number;
  createdAt: string;
}

export interface SkillProfile {
  name: string;
  category: SkillCategory;
  confidence: number;
  verified: boolean;
  lastUpdated: string;
  evidenceTrail: SkillEvidence[];
}

export interface UserRecord {
  id: string;
  firebaseUid?: string;
  name: string;
  email: string;
  branch: string;
  year: string;
  cgpa: number;
  targetRole: string;
  targetCompanies: string[];
  skills: SkillProfile[];
  codingScore: number;
}

export interface FirebaseUser {
  uid: string;
  email: string;
  name: string;
  picture?: string;
}
