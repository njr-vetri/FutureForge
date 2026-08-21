import {
  CandidateProfile,
  Waypoint,
  CodingProblem,
  AptitudeQuestion,
  JobOpening,
  RepoFileNode,
  RoastMessage,
  TargetBenchmark,
} from '../types';

export const initialCandidateProfile: CandidateProfile = {
  id: 'c-8821',
  name: 'Aarav Sharma',
  avatar: 'AS',
  email: 'aarav.sharma@campus.edu',
  phone: '+91 98765 43210',
  location: 'Bangalore, India',
  college: 'National Institute of Technology',
  degree: 'Bachelor of Technology',
  batch: 'Batch of 2026 (Final Year)',
  branch: 'Computer Science & Engineering',
  bio: 'Systems enthusiast with a passion for distributed architectures and competitive programming.',
  github: 'github.com/aaravsh',
  linkedin: '', // Missing
  portfolio: '', // Missing
  cgpa: 8.92,
  readinessScore: 81,
  targetRoles: ['Backend Engineer', 'Systems Developer', 'Distributed Systems Specialist'],
  targetCompanies: ['Google', 'Stripe', 'Atlassian', 'CRED', 'Uber'],
  trailheadCompletedWaypoints: 4,
  totalWaypoints: 6,
  crucibleBadges: ['Memory Leak Hunter', 'Concurrency Veteran', 'Kernel Defender'],
  currentStreakDays: 14,
  skills: [
    { name: 'Data Structures & Algorithmic Complexity', category: 'Algorithms', score: 86, target: 90, level: 'Proficient' },
    { name: 'Dynamic Programming & Graph Theory', category: 'Algorithms', score: 79, target: 85, level: 'Competent' },
    { name: 'System Design & Distributed Caching', category: 'System Design', score: 84, target: 90, level: 'Proficient' },
    { name: 'Database Indexing & ACID Transactions', category: 'System Design', score: 88, target: 90, level: 'Proficient' },
    { name: 'Quantitative Aptitude & Probabilities', category: 'Aptitude', score: 91, target: 90, level: 'Master' },
    { name: 'Logical Deduction & Abstract Reasoning', category: 'Aptitude', score: 82, target: 85, level: 'Proficient' },
    { name: '60s Spoken Technical Defense', category: 'Communication', score: 74, target: 85, level: 'Competent' },
    { name: 'Behavioral & STAR Method Alignment', category: 'Communication', score: 80, target: 85, level: 'Proficient' },
    { name: 'Production Git Architecture & Clean Code', category: 'Projects', score: 89, target: 90, level: 'Proficient' },
  ],
};

export const trailheadWaypoints: Waypoint[] = [
  {
    id: 'wp-1',
    number: 1,
    title: 'Algorithmic Foundations',
    category: 'Core Fundamentals',
    description: 'Master time-space complexities, two-pointers, and sliding windows.',
    score: 95,
    status: 'completed',
    coordinate: { x: 10, y: 65 },
    tasks: [
      { title: 'Bit Manipulation & Prefix Sums', type: 'coding', completed: true, duration: '45m' },
      { title: 'Quantitative Speed Assessment I', type: 'aptitude', completed: true, duration: '30m' },
    ],
  },
  {
    id: 'wp-2',
    number: 2,
    title: 'Trees & Graph Traversal',
    category: 'Non-Linear Structures',
    description: 'Topological sort, Dijkstra pathfinding, and union-find disjoint sets.',
    score: 88,
    status: 'completed',
    coordinate: { x: 26, y: 35 },
    tasks: [
      { title: 'Alien Dictionary & Bipartite Check', type: 'coding', completed: true, duration: '60m' },
      { title: 'Tree Serialization Spoken Defense', type: 'video', completed: true, duration: '15m' },
    ],
  },
  {
    id: 'wp-3',
    number: 3,
    title: 'Aptitude & Speed Matrix',
    category: 'Screening Elimination',
    description: 'High-speed elimination drills: probability, combinatorics, and data sufficiency.',
    score: 92,
    status: 'completed',
    coordinate: { x: 44, y: 55 },
    tasks: [
      { title: 'TCS/Infosys National Qualifier Mock', type: 'aptitude', completed: true, duration: '50m' },
      { title: 'Verbal Precision & Grammar Engine', type: 'aptitude', completed: true, duration: '25m' },
    ],
  },
  {
    id: 'wp-4',
    number: 4,
    title: 'Systems & Concurrency',
    category: 'Production Readiness',
    description: 'Thread safety, locks, mutexes, and non-blocking I/O queues.',
    score: 80,
    status: 'completed',
    coordinate: { x: 62, y: 25 },
    tasks: [
      { title: 'Rate Limiter Token Bucket Implementation', type: 'coding', completed: true, duration: '75m' },
      { title: 'ATS Resume Engineering & Bullet Audit', type: 'resume', completed: true, duration: '20m' },
    ],
  },
  {
    id: 'wp-5',
    number: 5,
    title: 'The Crucible Gate',
    category: 'High-Intensity Trial',
    description: 'Live 60-second verbal defense under hiring manager cross-examination.',
    score: 74,
    status: 'in-progress',
    coordinate: { x: 80, y: 48 },
    tasks: [
      { title: 'Roast My Repo Diagnostic Review', type: 'interview', completed: false, duration: '40m' },
      { title: 'Crucible 3-Phase Continuous Workflow', type: 'coding', completed: false, duration: '60m' },
    ],
  },
  {
    id: 'wp-6',
    number: 6,
    title: 'Placement Day Final Summit',
    category: 'Final Board Placement',
    description: 'End-to-end full simulation: 1 HR Round + 2 Technical Interviews.',
    score: 0,
    status: 'locked',
    coordinate: { x: 94, y: 20 },
    tasks: [
      { title: 'Tier-1 FAANG/Unicorn Placement Mock', type: 'interview', completed: false, duration: '90m' },
      { title: 'Executive Offer Letter Negotiation', type: 'video', completed: false, duration: '30m' },
    ],
  },
];

export const mockCodingProblems: CodingProblem[] = [
  {
    id: 'p-101',
    title: 'Sliding Window Maximum with Capacity Threshold',
    difficulty: 'Medium',
    category: 'Sliding Window / Monotonic Queue',
    acceptance: '64.2%',
    tags: ['Deque', 'Monotonic Queue', 'Sliding Window'],
    description: `You are given an array of integers \`nums\` and an integer \`k\` representing sliding window size. Return the maximum value inside each sliding window as it moves from left to right across the stream, strictly constrained to O(N) time complexity.`,
    examples: [
      {
        input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        output: '[3,3,5,5,6,7]',
        explanation: 'Window 1: [1,3,-1] -> 3; Window 2: [3,-1,-3] -> 3; Window 3: [-1,-3,5] -> 5; Window 4: [-3,5,3] -> 5; Window 5: [5,3,6] -> 6; Window 6: [3,6,7] -> 7',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length',
      'Execution must be O(N) time and O(k) auxiliary space.',
    ],
    starterCode: {
      python: `def max_sliding_window(nums: list[int], k: int) -> list[int]:
    # Write your O(N) monotonic deque solution here
    from collections import deque
    dq = deque()
    res = []
    for i, n in enumerate(nums):
        while dq and nums[dq[-1]] < n:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res`,
      cpp: `#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;
        vector<int> result;
        for (int i = 0; i < nums.size(); ++i) {
            while (!dq.empty() && nums[dq.back()] < nums[i]) {
                dq.pop_back();
            }
            dq.push_back(i);
            if (dq.front() <= i - k) dq.pop_front();
            if (i >= k - 1) result.push_back(nums[dq.front()]);
        }
        return result;
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        if (nums == null || k <= 0) return new int[0];
        int n = nums.length;
        int[] r = new int[n - k + 1];
        int ri = 0;
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < nums.length; i++) {
            while (!q.isEmpty() && q.peek() < i - k + 1) q.poll();
            while (!q.isEmpty() && nums[q.peekLast()] < nums[i]) q.pollLast();
            q.offer(i);
            if (i >= k - 1) r[ri++] = nums[q.peek()];
        }
        return r;
    }
}`,
      javascript: `function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = []; // stores indices
  
  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside the current window
    if (deque.length && deque[0] < i - k + 1) {
      deque.shift();
    }
    // Remove smaller elements
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}`,
    },
    solutionNotes: 'Using a monotonic double-ended queue guarantees each index is pushed and popped at most once, yielding linear O(N) runtime.',
    testCases: [
      { input: '[1,3,-1,-3,5,3,6,7], k=3', expected: '[3,3,5,5,6,7]' },
      { input: '[1], k=1', expected: '[1]' },
      { input: '[9,11], k=2', expected: '[11]' },
      { input: '[4,-2], k=2', expected: '[4]' },
    ],
  },
  {
    id: 'p-102',
    title: 'Atomic Distributed Lock with Heartbeat Lease',
    difficulty: 'Hard',
    category: 'Distributed Systems / Concurrency',
    acceptance: '38.5%',
    tags: ['Locks', 'Redis', 'Atomic CAS', 'TTL'],
    description: `Implement a lock manager simulating Redlock lease renewal. The lock must support acquiring with TTL, atomic release only if the token matches, and renewing the heartbeat before lease expiration without race conditions.`,
    examples: [
      {
        input: 'acquire("resource_db", "client_99", 5000) -> true',
        output: 'true',
        explanation: 'Lock granted to client_99 with 5000ms TTL.',
      },
    ],
    constraints: [
      'Resource keys must be alpha-numeric strings up to 64 chars.',
      'Lock acquisition must not block other keys.',
      'Releases with non-matching owner tokens must throw 403 Forbidden.',
    ],
    starterCode: {
      python: `class LockManager:
    def __init__(self):
        self.locks = {}

    def acquire(self, key: str, owner: str, ttl_ms: int) -> bool:
        # Atomic test and set
        import time
        now = time.time() * 1000
        if key in self.locks:
            curr_owner, expiry = self.locks[key]
            if now < expiry:
                return False
        self.locks[key] = (owner, now + ttl_ms)
        return True

    def release(self, key: str, owner: str) -> bool:
        if key not in self.locks:
            return False
        curr_owner, _ = self.locks[key]
        if curr_owner != owner:
            return False
        del self.locks[key]
        return True`,
      cpp: `// C++ implementation for Lock Manager`,
      java: `// Java Lock Manager`,
      javascript: `class LockManager {
  constructor() {
    this.store = new Map();
  }
  acquire(key, owner, ttl) {
    const now = Date.now();
    if (this.store.has(key)) {
      const lock = this.store.get(key);
      if (lock.expiry > now) return false;
    }
    this.store.set(key, { owner, expiry: now + ttl });
    return true;
  }
  release(key, owner) {
    if (!this.store.has(key)) return false;
    if (this.store.get(key).owner !== owner) return false;
    this.store.delete(key);
    return true;
  }
}`,
    },
    solutionNotes: 'Check expiration epoch timestamp upon read. Ensure atomic verification of token equality during deletion.',
    testCases: [
      { input: 'acquire("user_1", "worker_A", 1000)', expected: 'true' },
      { input: 'acquire("user_1", "worker_B", 1000)', expected: 'false' },
      { input: 'release("user_1", "worker_B")', expected: 'false' },
      { input: 'release("user_1", "worker_A")', expected: 'true' },
    ],
  },
  {
    id: 'p-103',
    title: 'Shortest Subarray with Sum at Least K',
    difficulty: 'Hard',
    category: 'Prefix Sums / Monotonic Deque',
    acceptance: '31.1%',
    tags: ['Prefix Sum', 'Deque', 'Array'],
    description: `Given an integer array nums and an integer k, return the length of the shortest non-empty subarray of nums with a sum of at least k. If there is no such subarray, return -1.`,
    examples: [
      {
        input: 'nums = [2,-1,2], k = 3',
        output: '3',
        explanation: 'Subarray [2,-1,2] sum is 3, length 3.',
      },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^5 <= nums[i] <= 10^5', '1 <= k <= 10^9'],
    starterCode: {
      python: `def shortest_subarray(nums: list[int], k: int) -> int:
    from collections import deque
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    dq = deque()
    res = float('inf')
    for i in range(n + 1):
        while dq and prefix[i] - prefix[dq[0]] >= k:
            res = min(res, i - dq.popleft())
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        dq.append(i)
    return res if res != float('inf') else -1`,
      cpp: `// C++ solution`,
      java: `// Java solution`,
      javascript: `function shortestSubarray(nums, k) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  
  const deque = [];
  let minLen = Infinity;
  for (let i = 0; i <= n; i++) {
    while (deque.length && prefix[i] - prefix[deque[0]] >= k) {
      minLen = Math.min(minLen, i - deque.shift());
    }
    while (deque.length && prefix[i] <= prefix[deque[deque.length - 1]]) {
      deque.pop();
    }
    deque.push(i);
  }
  return minLen === Infinity ? -1 : minLen;
}`,
    },
    solutionNotes: 'Maintain increasing order of prefix sums in monotonic deque to find shortest length in O(N).',
    testCases: [
      { input: 'nums = [1], k = 1', expected: '1' },
      { input: 'nums = [1,2], k = 4', expected: '-1' },
      { input: 'nums = [2,-1,2], k = 3', expected: '3' },
    ],
  },
];

export const mockAptitudeQuestions: AptitudeQuestion[] = [
  {
    id: 'apt-1',
    category: 'Quantitative',
    question: 'A train 180 meters long travelling at 72 km/hr crosses a platform in 24 seconds. What is the length of the platform in meters?',
    options: ['300 m', '320 m', '360 m', '280 m'],
    correctIndex: 0,
    explanation: 'Speed = 72 * (5/18) = 20 m/s. Total distance in 24s = 20 * 24 = 480 m. Platform length = 480 - 180 = 300 m.',
    difficulty: 'Foundation',
  },
  {
    id: 'apt-2',
    category: 'Logical Reasoning',
    question: 'In a code, EXECUTABLE is written as EWDBVSACLD. How is REFACTORING written in that same cipher shift logic?',
    options: ['QDGBBUPQHMF', 'QEFAASPQING', 'RDGBBUQQIMG', 'SFGBBUPQHNG'],
    correctIndex: 0,
    explanation: 'Alternating subtraction and addition of 1 across consecutive character positions.',
    difficulty: 'Intermediate',
  },
  {
    id: 'apt-3',
    category: 'Quantitative',
    question: 'Two cards are drawn at random from a standard deck of 52 cards. What is the probability that both are aces given that at least one is a red ace?',
    options: ['1/34', '1/51', '3/101', '5/102'],
    correctIndex: 2,
    explanation: 'Total pairs with at least one red ace = 52C2 - 50C2 = 1326 - 1225 = 101. Total pairs of two aces with at least one red = 4C2 - 2C2 = 6 - 1 = 5... Exact conditional reduction yields 3/101.',
    difficulty: 'Advanced',
  },
  {
    id: 'apt-4',
    category: 'Core Engineering',
    question: 'Which scheduling algorithm can cause the convoy effect when a CPU-intensive process arrives before I/O intensive processes?',
    options: ['Round Robin (RR)', 'Shortest Job First (SJF)', 'First-Come, First-Served (FCFS)', 'Multilevel Queue'],
    correctIndex: 2,
    explanation: 'FCFS non-preemptive scheduling causes subsequent I/O bound tasks to starve behind a single long compute thread.',
    difficulty: 'Foundation',
  },
  {
    id: 'apt-5',
    category: 'Verbal Ability',
    question: 'Identify the sentence with the most precise grammatical placement of the modifier:',
    options: [
      'Having finished the code audit, the production deploy was initiated by the lead engineer.',
      'Having finished the code audit, the lead engineer initiated the production deploy.',
      'The lead engineer initiated, having finished the code audit, production deploy.',
      'The production deploy was initiated having finished the code audit by the lead engineer.',
    ],
    correctIndex: 1,
    explanation: 'Option B correctly places the participle phrase "Having finished the code audit" directly adjacent to the subject performing the action ("the lead engineer").',
    difficulty: 'Intermediate',
  },
];

export const mockJobOpenings: JobOpening[] = [
  {
    id: 'job-1',
    company: 'Stripe',
    role: 'Software Engineer, Core Infrastructure',
    location: 'Bengaluru / Hybrid',
    type: 'Full-time',
    package: '₹38.5 LPA',
    deadline: 'In 3 Days',
    matchScore: 92,
    requiredSkills: ['Distributed Systems', 'Go / Java', 'ACID Transactions', 'Concurrency', 'Low Latency'],
    matchedSkills: ['Distributed Systems', 'ACID Transactions', 'Concurrency', 'Low Latency'],
    missingSkills: ['Go Production Idioms'],
    status: 'Shortlisted',
  },
  {
    id: 'job-2',
    company: 'CRED',
    role: 'Backend SDE-1 (High-Throughput Systems)',
    location: 'Bengaluru',
    type: 'Full-time',
    package: '₹34.0 LPA',
    deadline: 'In 5 Days',
    matchScore: 88,
    requiredSkills: ['Kafka', 'Redis', 'PostgreSQL Internals', 'Microservices', 'Algorithmic Complexity'],
    matchedSkills: ['Redis', 'PostgreSQL Internals', 'Algorithmic Complexity'],
    missingSkills: ['Kafka Partitioning'],
    status: 'Under Review',
  },
  {
    id: 'job-3',
    company: 'Google',
    role: 'Software Engineer L3 (Campus Drive 2026)',
    location: 'Hyderabad / Bengaluru',
    type: 'Full-time',
    package: '₹45.0 LPA',
    deadline: 'In 8 Days',
    matchScore: 84,
    requiredSkills: ['Graph Theory', 'Dynamic Programming', 'Clean Modular OOP', 'System Scale', 'STAR Interviews'],
    matchedSkills: ['Graph Theory', 'Dynamic Programming', 'Clean Modular OOP'],
    missingSkills: ['System Scale at Billion-QPS'],
    status: 'Applied',
  },
  {
    id: 'job-4',
    company: 'Atlassian',
    role: 'Associate Software Engineer',
    location: 'Remote / Bengaluru',
    type: 'Full-time',
    package: '₹32.0 LPA',
    deadline: 'In 12 Days',
    matchScore: 78,
    requiredSkills: ['React/TypeScript', 'Node.js', 'REST & GraphQL', 'Jest/Cypress', 'CI/CD Pipelines'],
    matchedSkills: ['React/TypeScript', 'Node.js', 'REST & GraphQL'],
    missingSkills: ['CI/CD Pipelines', 'Jest/Cypress'],
    status: 'Not Applied',
  },
];

// Crucible Repo Mock File Tree
export const mockRepoTree: RepoFileNode = {
  name: 'distributed-task-queue',
  path: '/',
  type: 'folder',
  children: [
    {
      name: 'src',
      path: '/src',
      type: 'folder',
      children: [
        {
          name: 'server.ts',
          path: '/src/server.ts',
          type: 'file',
          language: 'typescript',
          linesOfCode: 58,
          content: `import express from 'express';
import { TaskQueue } from './queue/task_queue';
import { AuthMiddleware } from './middleware/auth';
import { Logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 8080;
const queue = new TaskQueue();

app.use(express.json());

// Line 12: Potential bottleneck - global unindexed route
app.post('/api/tasks/enqueue', AuthMiddleware.verify, async (req, res) => {
  const { taskName, payload, priority } = req.body;
  
  if (!taskName) {
    return res.status(400).json({ error: 'Missing taskName' });
  }

  // Line 20: Missing idempotency token checking
  const taskId = await queue.push({
    name: taskName,
    payload,
    priority: priority || 0,
    enqueuedAt: new Date().toISOString()
  });

  return res.status(202).json({ taskId, status: 'QUEUED' });
});

// Line 31: Synchronous heavy stats aggregation on main thread
app.get('/api/tasks/stats', (req, res) => {
  const memoryStats = process.memoryUsage();
  const queueLength = queue.getPendingCount(); // synchronous in-memory iterate!
  res.json({ memoryStats, queueLength });
});

app.listen(PORT, () => {
  Logger.info(\`Task queue broker listening on port \${PORT}\`);
});`,
        },
        {
          name: 'queue',
          path: '/src/queue',
          type: 'folder',
          children: [
            {
              name: 'task_queue.ts',
              path: '/src/queue/task_queue.ts',
              type: 'file',
              language: 'typescript',
              linesOfCode: 84,
              content: `import { createClient } from 'redis';
import crypto from 'crypto';

export class TaskQueue {
  private redisClient: any;
  private inMemoryFallback: Map<string, any> = new Map();

  constructor() {
    // Line 9: No exponential backoff reconnection strategy
    this.redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    this.redisClient.connect().catch((err: any) => {
      console.warn('Redis unavailable, falling back to memory Map', err);
    });
  }

  // Line 18: Race condition risk in lock acquisition
  async push(task: any): Promise<string> {
    const id = crypto.randomUUID();
    const serialized = JSON.stringify({ id, ...task });
    
    if (this.redisClient.isOpen) {
      await this.redisClient.lPush('active_queue', serialized);
    } else {
      this.inMemoryFallback.set(id, task);
    }
    return id;
  }

  // Line 32: Unbounded scan operation O(N) blocking Redis event loop
  async getPendingCount(): Promise<number> {
    if (this.redisClient.isOpen) {
      return await this.redisClient.lLen('active_queue');
    }
    return this.inMemoryFallback.size;
  }
}`,
            },
            {
              name: 'worker_pool.go',
              path: '/src/queue/worker_pool.go',
              type: 'file',
              language: 'go',
              linesOfCode: 62,
              content: `package queue

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type WorkerPool struct {
	concurrency int
	taskChan    chan Task
	wg          sync.WaitGroup
}

// Line 17: Goroutine leak hazard if context is cancelled without draining
func (p *WorkerPool) Start(ctx context.Context) {
	for i := 0; i < p.concurrency; i++ {
		p.wg.Add(1)
		go func(workerID int) {
			defer p.wg.Done()
			for {
				select {
				case <-ctx.Done():
					fmt.Printf("Worker %d shutting down\\n", workerID)
					return
				case task := <-p.taskChan:
					// Line 29: No panic recovery wrapper inside worker goroutine!
					p.executeTask(task)
				}
			}
		}(i)
	}
}`,
            },
          ],
        },
        {
          name: 'middleware',
          path: '/src/middleware',
          type: 'folder',
          children: [
            {
              name: 'auth.ts',
              path: '/src/middleware/auth.ts',
              type: 'file',
              language: 'typescript',
              linesOfCode: 42,
              content: `import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

export class AuthMiddleware {
  // Line 6: SYNCHRONOUS BCRYPT HASHING ON REQUEST EVENT LOOP!
  static verify(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    // Line 14: Hardcoded secret salt and synchronous compareSync block
    const isMasterKey = bcrypt.compareSync(token, '$2b$10$e8w.hardcodedMockSaltString');
    if (!isMasterKey) {
      return res.status(403).json({ error: 'Invalid authentication credentials' });
    }

    next();
  }
}`,
            },
          ],
        },
      ],
    },
    {
      name: 'Dockerfile',
      path: '/Dockerfile',
      type: 'file',
      language: 'dockerfile',
      linesOfCode: 24,
      content: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Line 10: Running as root user in production container!
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
CMD ["node", "dist/server.js"]`,
    },
    {
      name: 'README.md',
      path: '/README.md',
      type: 'file',
      language: 'markdown',
      linesOfCode: 35,
      content: `# Distributed Task Queue

A lightweight concurrent task processor backed by Redis with local fallback.

## Architectural Trade-offs
- Hybrid in-memory queue when Redis cluster drops.
- Worker pool with adjustable concurrency threads.
- Express API broker for ingestion.`,
    },
  ],
};

export const initialRoastMessages: RoastMessage[] = [
  {
    id: 'm-1',
    sender: 'manager',
    timestamp: '10:02 AM',
    text: `Alright Aarav. I pulled your "distributed-task-queue" repo onto my terminal. I like that you built a concurrent worker pool in Go alongside TypeScript, but let's talk about what happens when 50,000 requests hit this on Black Friday.`,
  },
  {
    id: 'm-2',
    sender: 'manager',
    timestamp: '10:03 AM',
    referencedFile: '/src/middleware/auth.ts',
    referencedLine: 14,
    severity: 'critical',
    text: `Look at \`/src/middleware/auth.ts\` Line 14. You are calling \`bcrypt.compareSync()\` synchronously on EVERY incoming task ingestion request!
That locks the Node.js V8 event loop for ~80 milliseconds per invocation. 15 requests in parallel and your entire API server completely stops answering health checks. Why did you use sync hashing in an async middleware?`,
  },
  {
    id: 'm-3',
    sender: 'candidate',
    timestamp: '10:05 AM',
    text: `In initial prototype testing with local curl scripts, I wanted to prevent race conditions during auth validation and didn't anticipate event loop starvation. I should have used asynchronous \`await bcrypt.compare()\` with worker threads or delegated authentication to a JWT/PASETO token verification.`,
  },
  {
    id: 'm-4',
    sender: 'manager',
    timestamp: '10:06 AM',
    referencedFile: '/src/queue/worker_pool.go',
    referencedLine: 29,
    severity: 'critical',
    text: `Fair admission. Now jump to \`/src/queue/worker_pool.go\` Line 29.
Your worker goroutine executes \`p.executeTask(task)\` inside a raw loop with NO \`defer recover()\` block. If any single poisoned task payload causes a nil-pointer dereference, what happens to your entire backend service? Defend your error containment model.`,
  },
];

export const mockCrucibleTargetBenchmarks: TargetBenchmark[] = [
  {
    roleId: 'stripe-infra',
    roleTitle: 'Software Engineer, Core Infrastructure',
    company: 'Stripe',
    salaryBenchmark: '₹38.5 LPA (Base + Stock)',
    candidateFitScore: 82,
    categories: [
      { name: 'Distributed Consensus & Concurrency', required: 92, candidate: 80, gap: -12, critique: 'Lacks hands-on raft/paxos protocol defense. Understand leader election timeouts.' },
      { name: 'Algorithmic Efficiency & Space Guarantees', required: 90, candidate: 88, gap: -2, critique: 'Solid baseline. Needs sharper boundary checks on 64-bit integer overflows.' },
      { name: 'Failure Mode Containment & Observability', required: 95, candidate: 72, gap: -23, critique: 'Critical weakness: Missing circuit breaker pattern & panic isolation in workers.' },
      { name: 'High-Pressure Spoken Technical Defense', required: 88, candidate: 76, gap: -12, critique: 'Tends to over-explain code line-by-line rather than leading with architectural trade-offs.' },
    ],
    sevenDayRoadmap: [
      { day: 1, focus: 'Panic Recovery & Goroutine Draining', drill: 'Refactor WorkerPool with defer recover() + dead letter queue.', deliverable: 'Zero-downtime chaos test script.', timeCommitment: '2.5 hrs' },
      { day: 2, focus: 'Asynchronous Auth & Non-blocking I/O', drill: 'Replace bcrypt.compareSync with asynchronous token verification.', deliverable: 'Autocannon 10,000 req/s benchmark proof.', timeCommitment: '2.0 hrs' },
      { day: 3, focus: 'Distributed Lock Idempotency', drill: 'Implement Redlock CAS lease with monotonic heartbeat refresh.', deliverable: 'Passing race condition test suite.', timeCommitment: '3.0 hrs' },
      { day: 4, focus: 'Docker Multi-stage & Non-Root Hardening', drill: 'Remove root user execution, drop Alpine privileges to USER node.', deliverable: 'Trivy security vulnerability scan.', timeCommitment: '1.5 hrs' },
      { day: 5, focus: '60s Spoken Pitch Defense Drill', drill: 'Record 3 rapid architectural trade-off defenses under 60s timer.', deliverable: 'Verified Crucible Voice Evaluation >85.', timeCommitment: '2.0 hrs' },
      { day: 6, focus: 'Circuit Breaker & Fallback Telemetry', drill: 'Add Hystrix-style half-open circuit breaker around Redis client.', deliverable: 'Metrics export with p99 latency grafana spec.', timeCommitment: '2.5 hrs' },
      { day: 7, focus: 'Full Crucible Mock & Placement Gate', drill: 'Complete 3-phase live workflow under strict 45-minute countdown.', deliverable: 'Crucible Certified Placement Seal.', timeCommitment: '3.0 hrs' },
    ],
  },
  {
    roleId: 'google-swe',
    roleTitle: 'Software Engineer (L3 Campus Drive)',
    company: 'Google',
    salaryBenchmark: '₹45.0 LPA CTC',
    candidateFitScore: 84,
    categories: [
      { name: 'Graph Theory & DP Optimization', required: 95, candidate: 86, gap: -9, critique: 'Struggles with state compression bitmask dynamic programming.' },
      { name: 'Clean Code & Extensibility', required: 90, candidate: 89, gap: -1, critique: 'Good modularity. Follow standard Google style guides rigorously.' },
      { name: 'Verbal Problem Solving & Clarification', required: 92, candidate: 79, gap: -13, critique: 'Must ask proactive edge case questions before typing the first line of code.' },
    ],
    sevenDayRoadmap: [
      { day: 1, focus: 'Graph Cycle & Topological Sort', drill: 'Solve Alien Dictionary + Parallel Course Schedule III.', deliverable: '100% test pass on LeetCode Hard.', timeCommitment: '3 hrs' },
      { day: 2, focus: 'Bitmask Dynamic Programming', drill: 'Shortest Path Visiting All Nodes with state memoization.', deliverable: 'Complexity proof write-up.', timeCommitment: '2.5 hrs' },
      { day: 3, focus: 'Monotonic Queue & Deque Drills', drill: 'Sliding Window Maximum & Shortest Subarray sum >= k.', deliverable: 'Zero-allocation C++ / Python implementations.', timeCommitment: '2 hrs' },
      { day: 4, focus: 'Tree Diameter & Heavy-Light Prep', drill: 'Binary Tree Maximum Path Sum & LCA with binary lifting.', deliverable: 'Interactive test driver.', timeCommitment: '2.5 hrs' },
      { day: 5, focus: 'Google Mock Interview Simulator', drill: '2x 45-minute technical interviews with AI evaluation.', deliverable: 'Google Bar-Raiser Scorecard >85%.', timeCommitment: '3 hrs' },
      { day: 6, focus: 'System Scalability Fundamentals', drill: 'Design TinyURL with 100M daily active writes + Geo-distributed read caches.', deliverable: 'Back-of-envelope math doc.', timeCommitment: '2.5 hrs' },
      { day: 7, focus: 'Googlyness & Behavioral Alignment', drill: 'Structure 5 key stories in STAR format (Handling Ambiguity & Conflict).', deliverable: 'Video pitch recordings with AI feedback.', timeCommitment: '2 hrs' },
    ],
  },
  {
    roleId: 'cred-backend',
    roleTitle: 'Backend SDE-1 (High-Throughput)',
    company: 'CRED',
    salaryBenchmark: '₹34.0 LPA',
    candidateFitScore: 87,
    categories: [
      { name: 'PostgreSQL Indexing & B-Trees', required: 92, candidate: 88, gap: -4, critique: 'Solid SQL understanding. Practice partial and composite indexing strategies.' },
      { name: 'Kafka Partitions & Rebalancing', required: 88, candidate: 75, gap: -13, critique: 'Needs clarity on consumer group lag and exactly-once semantics.' },
      { name: 'Microsecond Latency Optimization', required: 90, candidate: 84, gap: -6, critique: 'Optimize garbage collection overhead in memory allocation loops.' },
    ],
    sevenDayRoadmap: [
      { day: 1, focus: 'Postgres Query Execution Plans', drill: 'Analyze EXPLAIN ANALYZE on 5M row table; optimize seq scan to index scan.', deliverable: 'Before/after query latency benchmarks.', timeCommitment: '2.5 hrs' },
      { day: 2, focus: 'Kafka Consumer Lag Mitigation', drill: 'Configure manual offset commit with idempotent producer configs.', deliverable: 'Failure recovery script.', timeCommitment: '2.0 hrs' },
      { day: 3, focus: 'Redis Caching Patterns (Cache-Aside, Write-Through)', drill: 'Implement stampede prevention with probabilistic early expiration (XFetch).', deliverable: 'Working TypeScript driver.', timeCommitment: '2.5 hrs' },
      { day: 4, focus: 'Idempotent Payment Webhooks', drill: 'Design double-entry ledger database schema with advisory locks.', deliverable: 'SQL DDL with constraint validation.', timeCommitment: '3.0 hrs' },
      { day: 5, focus: 'Crucible Spoken System Defense', drill: 'Defend database deadlock scenarios in 60-second voice prompt.', deliverable: 'Crucible Speech Confidence Score >88%.', timeCommitment: '2.0 hrs' },
      { day: 6, focus: 'High-Concurrency Load Testing', drill: 'Run k6 load test simulating 5,000 concurrent credit card bill payments.', deliverable: 'p99 latency < 25ms proof.', timeCommitment: '2.5 hrs' },
      { day: 7, focus: 'Final CRED Engineering Gate', drill: 'End-to-end architecture review with Stern Hiring Manager AI.', deliverable: 'Approved Candidate Placement Clearance.', timeCommitment: '2.0 hrs' },
    ],
  },
];
