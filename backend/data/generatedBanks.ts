const topics = [
  'Arrays',
  'Strings',
  'Hash Maps',
  'Two Pointers',
  'Sliding Window',
  'Stacks',
  'Queues',
  'Linked Lists',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Binary Search',
  'Heaps',
  'SQL',
  'Operating Systems',
  'DBMS',
  'Networks',
  'System Design',
  'JavaScript',
];

const difficulties = ['Easy', 'Medium', 'Hard'] as const;

export function generateCodingBank(count = 50) {
  return Array.from({ length: count }, (_, index) => {
    const topic = topics[index % topics.length];
    const difficulty = difficulties[index % difficulties.length];
    const number = index + 1;

    return {
      id: `cp-${String(number).padStart(3, '0')}`,
      title: `${topic} Placement Drill ${number}`,
      difficulty,
      tags: [topic, difficulty],
      description: `Solve a ${difficulty.toLowerCase()} ${topic.toLowerCase()} placement problem. Read input from stdin and print the final answer to stdout.`,
      examples: [{ input: '5\n1 2 3 4 5', output: '15', explanation: 'The sample asks for the aggregate result.' }],
      constraints: ['Input is provided through stdin.', 'Print only the requested answer.', 'Prefer O(N log N) or better where possible.'],
      starterCode: {
        python: 'import sys\n\ndef solve(data: str) -> str:\n    nums = list(map(int, data.split()))\n    return str(sum(nums[1:])) if nums else \"0\"\n\nprint(solve(sys.stdin.read()))',
        javascript: 'const fs = require("fs");\nconst data = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);\nconst nums = data.slice(1);\nconsole.log(nums.reduce((a, b) => a + b, 0));',
        cpp: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){ios::sync_with_stdio(false);cin.tie(nullptr); int n; if(!(cin>>n)){cout<<0; return 0;} long long sum=0,x; while(cin>>x) sum+=x; cout<<sum; return 0;}',
        java: 'import java.io.*; import java.util.*;\npublic class Main { public static void main(String[] args) throws Exception { Scanner sc = new Scanner(System.in); if(!sc.hasNextInt()){ System.out.print(0); return; } int n=sc.nextInt(); long sum=0; while(sc.hasNextLong()) sum+=sc.nextLong(); System.out.print(sum); } }',
      },
      solutionNotes: `For this ${topic} drill, first parse stdin reliably, then handle edge cases before optimizing.`,
      testCases: [{ input: '5\n1 2 3 4 5', expected: '15' }],
    };
  });
}

export function generateAptitudeBank(count = 500) {
  const categories = ['Quantitative', 'Logical Reasoning', 'Verbal Ability', 'Core Engineering'] as const;

  return Array.from({ length: count }, (_, index) => {
    const category = categories[index % categories.length];
    const base = 12 + (index % 29);
    const answer = base * 3;
    return {
      id: `apt-${String(index + 1).padStart(3, '0')}`,
      category,
      difficulty: index % 3 === 0 ? 'Foundation' : index % 3 === 1 ? 'Intermediate' : 'Advanced',
      question:
        category === 'Quantitative'
          ? `If 3x = ${answer}, what is x?`
          : category === 'Logical Reasoning'
            ? `Which option continues the pattern: ${base}, ${base + 2}, ${base + 4}, ?`
            : category === 'Verbal Ability'
              ? 'Choose the clearest professional sentence.'
              : 'Which concept is most important for avoiding race conditions?',
      options:
        category === 'Quantitative'
          ? [String(base - 1), String(base), String(base + 1), String(base + 2)]
          : category === 'Logical Reasoning'
            ? [String(base + 5), String(base + 6), String(base + 8), String(base + 10)]
            : category === 'Verbal Ability'
              ? ['The code was wrote fast.', 'The code was written carefully.', 'Careful written code was.', 'The code careful written.']
              : ['Mutex / lock discipline', 'CSS specificity', 'DNS caching only', 'Image compression'],
      correctIndex: category === 'Logical Reasoning' ? 1 : category === 'Verbal Ability' || category === 'Core Engineering' ? 1 : 1,
      explanation:
        category === 'Core Engineering'
          ? 'Locks or equivalent synchronization protect shared state from concurrent mutation.'
          : 'Solve by applying the direct pattern or grammar rule.',
    };
  });
}

