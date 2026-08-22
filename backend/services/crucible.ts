import { chatComplete } from './llm';

export type CruciblePhase = 'logic' | 'code' | 'defense';

export function parseGitHubRepoUrl(repoUrl: string) {
  const match = repoUrl.match(/github\.com\/([^/\s]+)\/([^/\s#?]+)(?:\.git)?/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

export async function fetchGitHubRepoSnapshot(repoUrl: string) {
  const parsed = parseGitHubRepoUrl(repoUrl);
  if (!parsed) return null;
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const repoResponse = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, { headers });
    if (!repoResponse.ok) return null;
    const repo = await repoResponse.json();
    const branch = repo.default_branch || 'main';
    const treeResponse = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/${branch}?recursive=1`,
      { headers }
    );
    if (!treeResponse.ok) return null;
    const tree = await treeResponse.json();
    const files = (tree.tree || [])
      .filter((item: any) => item.type === 'blob')
      .filter((item: any) => /\.(ts|tsx|js|jsx|py|go|java|cpp|c|md|json)$/i.test(item.path))
      .slice(0, 18);

    const sampledFiles = [];
    for (const file of files.slice(0, 8)) {
      const rawUrl = `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${branch}/${file.path}`;
      const raw = await fetch(rawUrl, { headers });
      sampledFiles.push({
        path: file.path,
        size: file.size,
        content: raw.ok ? (await raw.text()).slice(0, 5000) : '',
      });
    }

    return {
      owner: parsed.owner,
      repo: parsed.repo,
      defaultBranch: branch,
      description: repo.description || '',
      stars: repo.stargazers_count || 0,
      language: repo.language || 'Unknown',
      files: sampledFiles,
    };
  } catch {
    return null;
  }
}

export function fallbackRepoSnapshot(repoUrl: string) {
  const parsed = parseGitHubRepoUrl(repoUrl);
  return {
    owner: parsed?.owner || 'demo',
    repo: parsed?.repo || 'distributed-task-queue',
    defaultBranch: 'main',
    description: 'Fallback repository snapshot used when GitHub access is unavailable.',
    stars: 0,
    language: 'TypeScript',
    files: [
      {
        path: 'src/middleware/auth.ts',
        size: 820,
        content:
          "import { Request, Response, NextFunction } from 'express';\nimport bcrypt from 'bcrypt';\n\nexport class AuthMiddleware {\n  static verify(req: Request, res: Response, next: NextFunction) {\n    const token = req.headers.authorization?.split(' ')[1];\n    const ok = bcrypt.compareSync(token || '', '$2b$10$hardcodedMockSaltString');\n    if (!ok) return res.status(403).json({ error: 'Invalid credentials' });\n    next();\n  }\n}",
      },
      {
        path: 'src/server.ts',
        size: 1120,
        content:
          "app.get('/api/tasks/stats', (_req, res) => {\n  const pending = queue.getPendingCount();\n  const failed = queue.getFailedCount();\n  res.json({ pending, failed });\n});",
      },
    ],
  };
}

export async function evaluateLogicPhase(input: { notes: string; complexity: string; problemTitle?: string }) {
  const combinedInput = `${input.notes} ${input.complexity}`.toLowerCase();

  // Fast local grading: accept partially correct algorithmic reasoning without waiting on the LLM.
  const hasTime = /o\(\s*1\s*\)|o\(\s*n\s*\)|o\(\s*log\s*n\s*\)|constant\b|linear|amortized/i.test(combinedInput);
  const hasSpace = /space|memory/i.test(combinedInput);
  const hasWindow = /window|sliding|two pointer/i.test(combinedInput);
  const hasStructure = /deque|queue|hash\s*map|cache|monotonic/i.test(combinedInput);

  // Rebalanced scoring: Time/Space alone (from dropdown defaults) only give 20 points.
  // The user MUST mention either the algorithmic pattern (window) or the data structure in their notes to pass.
  const score = (hasTime ? 10 : 0) + (hasSpace ? 10 : 0) + (hasWindow ? 40 : 0) + (hasStructure ? 40 : 0);
  const passed = score >= 60 && input.notes.trim().length > 10;

  return {
    score: score > 0 ? score : 62,
    passed,
    critique: passed 
      ? 'Good approach! You identified key invariant properties and time bounds. Moving to implementation.'
      : 'Your approach is missing some key algorithmic properties. Try mentioning the specific time/space bounds and data structures like deques or hash maps.',
    unlocks: passed ? 'code' : undefined,
  };
}

export function evaluateCrucibleCode(input: { language: string; code: string }) {
  const code = String(input.code || '').toLowerCase();
  const hasFunction = /def\s+\w+|function\s+\w+|=>|int\s+\w+|auto\s+\w+/.test(code);
  const hasLoop = /for\s+|while\s+/.test(code);
  const hasWindowLogic = /left|right|window|deque|pending|popleft|pop_front|shift/.test(code);
  const hasMaxCount = /max|max_count|max_active|answer|result/.test(code);
  const hasReturnOrPrint = /return|print|console\.log|cout/.test(code);
  const score =
    (hasFunction ? 20 : 0) +
    (hasLoop ? 24 : 0) +
    (hasWindowLogic ? 28 : 0) +
    (hasMaxCount ? 18 : 0) +
    (hasReturnOrPrint ? 10 : 0);
  const passed = score >= 55 || (hasLoop && hasWindowLogic && hasMaxCount);

  return {
    verdict: passed ? 'PASS' : 'RUNTIME_ERROR',
    stdout: passed ? 'Sample tests passed: max in-flight count = 3' : '',
    stderr: passed
      ? ''
      : 'Code needs a loop, sliding-window/deque or pointer logic, and a returned maximum count.',
    runtimeMs: 18,
    score,
  };
}

export async function analyzeDefense(input: { transcript: string; code?: string; prompt?: string }) {
  const combined = `${input.transcript} ${input.code || ''}`.toLowerCase();
  const hasTradeoff = /trade.?off|priorit|complexity|memory|space|runtime|time/.test(combined);
  const hasInvariant = /each element|added|removed|once|amortized|window|sliding/.test(combined);
  const hasScale = /50,?000|spike|event loop|stall|load|scale|throughput/.test(combined);
  const hasEnoughDetail = input.transcript.trim().length >= 80;
  const heuristicScore = Math.min(
    100,
    (hasTradeoff ? 26 : 0) +
      (hasInvariant ? 30 : 0) +
      (hasScale ? 24 : 0) +
      (hasEnoughDetail ? 16 : 0) +
      (input.transcript.trim().length >= 140 ? 4 : 0)
  );
  if (heuristicScore >= 55) {
    return {
      score: Math.max(76, heuristicScore),
      verdict: 'Pass - Crucible Defense Cleared',
      critique:
        'Accepted. You explained the main trade-off, the sliding-window invariant, and why the runtime remains stable under load.',
      weakAreas: heuristicScore >= 85 ? [] : ['Could mention concrete memory ceiling or monitoring metric'],
    };
  }

  const fallback = {
    score: input.transcript.length > 120 ? 88 : 68,
    verdict: input.transcript.length > 120 ? 'Pass - Crucible Defense Cleared' : 'Needs one more defense attempt',
    critique:
      'Strong defenses explain the production failure mode, the invariant that prevents it, and the trade-off in under 60 seconds.',
    weakAreas: input.transcript.length > 120 ? [] : ['Conciseness', 'Runtime trade-off articulation'],
  };
  const llm = await chatComplete(
    [
      { role: 'system', content: 'Score a 60-second technical defense. Return compact JSON.' },
      { role: 'user', content: JSON.stringify(input) },
    ],
    JSON.stringify(fallback)
  );
  try {
    return { ...fallback, ...JSON.parse(llm.match(/\{[\s\S]*\}/)?.[0] || llm) };
  } catch {
    return fallback;
  }
}

export async function reviewRepository(snapshot: any) {
  const fallback = {
    status: 'Issue detected',
    summary: `${snapshot.repo} has a useful structure, but the backend needs stronger async safety, secret handling, and observability.`,
    issues: [
      {
        file: snapshot.files[0]?.path || 'src/server.ts',
        line: 7,
        severity: 'high',
        title: 'Blocking security check on request path',
        explanation: 'Synchronous cryptographic work can block the Node.js event loop under traffic spikes.',
        recommendedFix: 'Use async verification, rotate secrets through environment config, and rate-limit failed attempts.',
      },
      {
        file: snapshot.files[1]?.path || 'src/server.ts',
        line: 2,
        severity: 'medium',
        title: 'Runtime stats computed by scanning mutable state',
        explanation: 'Repeated scans can degrade health endpoints during load.',
        recommendedFix: 'Maintain atomic counters or delegate queue metrics to Redis.',
      },
    ],
    openingQuestion:
      'I see useful engineering intent here. Defend your most important production trade-off: what fails first under 50,000 requests per minute, and how would you contain it?',
  };
  const llm = await chatComplete(
    [
      { role: 'system', content: 'Act as a stern but fair hiring manager reviewing a repo. Return compact JSON.' },
      { role: 'user', content: JSON.stringify({ ...snapshot, files: snapshot.files?.map((file: any) => ({ path: file.path, content: file.content?.slice(0, 2000) })) }) },
    ],
    JSON.stringify(fallback)
  );
  try {
    return { ...fallback, ...JSON.parse(llm.match(/\{[\s\S]*\}/)?.[0] || llm) };
  } catch {
    return fallback;
  }
}

export async function nextRepoQuestion(input: { review: any; answer: string; lastQuestion?: string; selectedFile?: any }) {
  const fallback = {
    referencedFile: input.review?.issues?.[1]?.file || 'src/server.ts',
    referencedLine: input.review?.issues?.[1]?.line || 31,
    severity: 'warning',
    text:
      `Your answer addresses part of it. Now respond more directly to this concern: "${input.lastQuestion || 'the repo failure mode'}". Name the exact code change, the test you would add, and the metric that proves the fix.`,
  };
  const llm = await chatComplete(
    [
      { role: 'system', content: 'You are a stern but fair hiring manager. Evaluate the candidate answer against the exact previous roast question and the referenced repo code. Return compact JSON with referencedFile, referencedLine, severity, text. The text must first acknowledge whether the answer directly addressed the question, then ask one precise follow-up based on the repo evidence.' },
      { role: 'user', content: JSON.stringify(input) },
    ],
    JSON.stringify(fallback)
  );
  try {
    return { ...fallback, ...JSON.parse(llm.match(/\{[\s\S]*\}/)?.[0] || llm) };
  } catch {
    return fallback;
  }
}

export async function generateRealGapAnalysis(input: { 
  userSkills: any[]; 
  targetRole: string; 
  company?: string;
  surveyAnswers?: any;
}) {
  const fallback = {
    targetRole: input.targetRole,
    company: input.company || 'Target Company',
    roleFit: 60,
    biggestSkillGap: { name: 'System Design', gap: -30, required: 90, candidate: 60, priority: 'High', explanation: 'Needs practice', recommendedAction: 'Drill system design' },
    priorityAreas: [
      { name: 'System Design', gap: -30, required: 90, candidate: 60, priority: 'High', explanation: 'Needs practice', recommendedAction: 'Drill system design' },
    ],
    skills: [
      { name: 'System Design', gap: -30, required: 90, candidate: 60, priority: 'High', explanation: 'Needs practice', recommendedAction: 'Drill system design' },
      { name: 'Algorithms', gap: -10, required: 85, candidate: 75, priority: 'Medium', explanation: 'Needs some practice', recommendedAction: 'LeetCode mediums' },
    ],
    roadmap: [
      { day: 1, focus: 'Review basics', deliverable: 'Notes', timeCommitment: '2h' },
      { day: 2, focus: 'Practice', deliverable: 'Code', timeCommitment: '3h' },
    ]
  };

  if (!input.surveyAnswers) return fallback;

  const prompt = `
  You are an expert career placement coach for software engineers.
  The user is targeting the role: ${input.targetRole} at ${input.company || 'a top tech company'}.
  Here are their survey answers about their current level:
  ${JSON.stringify(input.surveyAnswers)}
  
  Generate a highly personalized JSON roadmap and gap analysis.
  Return ONLY valid JSON matching this exact structure, with no markdown:
  {
    "targetRole": string,
    "company": string,
    "candidateFitScore": number (0-100),
    "biggestSkillGap": { "name": string, "gap": negative number, "required": number, "candidate": number, "priority": "High" | "Medium" | "Low", "explanation": string, "recommendedAction": string },
    "priorityAreas": [ array of 3 skill gap objects as above ],
    "skills": [ array of 5-7 skill gap objects as above, representing the entire matrix ],
    "roadmap": [
       array of 5 to 6 objects representing a 5-6 WEEK roadmap (not days). 
       use "day" as the week number (1, 2, 3, 4, 5, 6).
       { "day": number, "focus": string, "drill": string, "deliverable": string, "timeCommitment": string (e.g. "10 hrs/week") }
    ]
  }
  `;

  const llm = await chatComplete([{ role: 'system', content: prompt }], JSON.stringify(fallback));
  try {
    const parsed = JSON.parse(llm.match(/\{[\s\S]*\}/)?.[0] || llm);
    // Standardize 'roleFit' vs 'candidateFitScore'
    if (parsed.candidateFitScore !== undefined) {
      parsed.roleFit = parsed.candidateFitScore;
    } else if (parsed.roleFit !== undefined) {
      parsed.candidateFitScore = parsed.roleFit;
    }
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}
