const fs = require('fs');
const code = fs.readFileSync('server.ts', 'utf8');
const lines = code.split('\n');
const startIndex = lines.findIndex(l => l.includes("app.post('/api/crucible/workflow/start', async (req, res) => {"));
if (startIndex !== -1) {
  const goodCode = lines.slice(0, startIndex).join('\n');
  const tailCode = `
app.post('/api/crucible/workflow/start', async (req, res) => {
  const session = await insertRecord('crucibleSessions', {
    userId: req.body.userId || '11111111-1111-1111-1111-111111111111',
    status: 'phase_a_active',
    problem: req.body.problem || {
      title: 'Distributed Streaming Lag & Monotonic Eviction',
      prompt: 'Given a sorted stream of event timestamps and a maximum lag window, return the maximum count of in-flight events inside any rolling window.',
      targetComplexity: 'O(N) amortized time',
      tags: ['Algorithms', 'System Design', 'Concurrency'],
    },
    phases: {
      logic: { status: 'active' },
      code: { status: 'locked' },
      defense: { status: 'locked' },
    },
  });
  res.status(201).json(session);
});

app.post('/api/crucible/workflow/:sessionId/logic', async (req, res) => {
  const evaluation = await evaluateLogicPhase({
    notes: req.body.notes || '',
    complexity: req.body.complexity || '',
    problemTitle: req.body.problemTitle,
  });
  const userId = req.body.userId || '11111111-1111-1111-1111-111111111111';
  const record = await insertRecord('crucibleSessions', {
    parentSessionId: req.params.sessionId,
    userId: userId,
    phase: 'logic',
    evaluation,
  });
  await updateSkillGraph(userId, {
    skill: 'Crucible Algorithmic Reasoning',
    event: 'crucible_logic_phase',
    result: evaluation.passed ? 'pass' : 'needs_practice',
    score: evaluation.passed ? 6 : -2,
    verified: evaluation.passed,
  });
  res.json({ ...evaluation, sessionEventId: record.id, nextPhase: evaluation.passed ? 'code' : 'logic_retry' });
});

app.post('/api/crucible/workflow/:sessionId/code', async (req, res) => {
  const execution = await runCodeWithPiston({
    language: req.body.language || 'python',
    code: req.body.code || '',
    input: req.body.input || '5\\n1 2 3 4 5',
  });
  const passed = execution.verdict === 'PASS';
  const userId = req.body.userId || '11111111-1111-1111-1111-111111111111';
  const record = await insertRecord('crucibleSessions', {
    parentSessionId: req.params.sessionId,
    userId: userId,
    phase: 'code',
    execution,
  });
  await updateSkillGraph(userId, {
    skill: 'Crucible Production Coding',
    event: 'crucible_code_phase',
    result: passed ? 'pass' : 'fail',
    score: passed ? 7 : -3,
    verified: passed,
  });
  res.json({ ...execution, sessionEventId: record.id, nextPhase: passed ? 'defense' : 'code_retry' });
});

app.post('/api/crucible/workflow/:sessionId/defense', async (req, res) => {
  const evaluation = await analyzeDefense({
    transcript: req.body.transcript || '',
    code: req.body.code || '',
    prompt: req.body.prompt || '',
  });
  const passed = evaluation.score >= 75;
  const userId = req.body.userId || '11111111-1111-1111-1111-111111111111';
  const record = await insertRecord('crucibleSessions', {
    parentSessionId: req.params.sessionId,
    userId: userId,
    phase: 'defense',
    evaluation,
    completed: passed,
  });
  await updateSkillGraph(userId, {
    skill: '60s Spoken Technical Defense',
    event: 'crucible_defense_phase',
    result: passed ? 'pass' : 'needs_practice',
    score: passed ? 8 : -2,
    verified: passed,
  });
  res.json({ ...evaluation, sessionEventId: record.id, completed: passed });
});

app.post('/api/crucible/repo/analyze', async (req, res) => {
  const userId = req.body.userId || '11111111-1111-1111-1111-111111111111';
  const repoUrl = req.body.repoUrl || '';
  const snapshot = (await fetchGitHubRepoSnapshot(repoUrl)) || fallbackRepoSnapshot(repoUrl);
  const review = await reviewRepository(snapshot);
  const record = await insertRecord('repoReviews', {
    userId,
    repoUrl,
    snapshot,
    review,
  });
  await updateSkillGraph(userId, {
    skill: 'Repository Architecture Defense',
    event: 'crucible_repo_review',
    result: 'reviewed',
    score: 4,
    verified: true,
  });
  res.json({ id: record.id, snapshot, review });
});\n\n` + lines.slice(lines.findIndex(l => l.includes("app.post('/api/crucible/repo/:reviewId/respond', async (req, res) => {"))).join('\n');
  fs.writeFileSync('server.ts', goodCode + '\n' + tailCode);
  console.log('Fixed server.ts');
}
