import { UserRecord } from '../types';

export const users: UserRecord[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu',
    branch: 'Computer Science & Engineering',
    year: '2026',
    cgpa: 8.92,
    targetRole: 'Backend Engineer',
    targetCompanies: ['Google', 'Stripe', 'Atlassian', 'CRED', 'Uber'],
    codingScore: 84,
    skills: []
  }
];

export const codingProblems = [
  {
    id: 'p-1',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Arrays', 'HashMaps'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. Return the indices in the form [idx1, idx2].',
    examples: [
      { input: '[2, 7, 11, 15], 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 9, so we return [0, 1].' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    testCases: [
      { input: '[2, 7, 11, 15], 9', expected: '[0, 1]' },
      { input: '[3, 2, 4], 6', expected: '[1, 2]' },
      { input: '[3, 3], 6', expected: '[0, 1]' }
    ],
    solutionNotes: 'Use a hash map to store the difference between the target and the current element as you iterate. Time Complexity: O(N), Space Complexity: O(N).'
  },
  {
    id: 'p-2',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    tags: ['Strings', 'Two Pointers'],
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.',
    examples: [
      { input: '"A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expected: 'true' },
      { input: '"race a car"', expected: 'false' },
      { input: '" "', expected: 'true' }
    ],
    solutionNotes: 'Use two pointers starting from the beginning and end of the string. Skip non-alphanumeric characters and compare the remaining characters ignoring case. Time Complexity: O(N), Space Complexity: O(1).'
  },
  {
    id: 'p-3',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    tags: ['Arrays', 'Dynamic Programming'],
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    examples: [
      { input: '[7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    testCases: [
      { input: '[7,1,5,3,6,4]', expected: '5' },
      { input: '[7,6,4,3,1]', expected: '0' }
    ],
    solutionNotes: 'Keep track of the minimum price seen so far and update the maximum profit at each step. Time Complexity: O(N), Space Complexity: O(1).'
  },
  {
    id: 'p-4',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    tags: ['Arrays', 'HashMaps'],
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    examples: [
      { input: '[1,2,3,1]', output: 'true', explanation: '1 appears twice.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    testCases: [
      { input: '[1,2,3,1]', expected: 'true' },
      { input: '[1,2,3,4]', expected: 'false' },
      { input: '[1,1,1,3,3,4,3,2,4,2]', expected: 'true' }
    ],
    solutionNotes: 'Use a HashSet to keep track of seen numbers. If a number is already in the set, return true. Time Complexity: O(N), Space Complexity: O(N).'
  },
  {
    id: 'p-5',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    tags: ['Arrays', 'Dynamic Programming'],
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    examples: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
      { input: '[1]', expected: '1' },
      { input: '[5,4,-1,7,8]', expected: '23' }
    ],
    solutionNotes: 'Use Kadanes Algorithm. Keep a running sum. If the running sum drops below 0, reset it to 0. Update max sum at each step. Time Complexity: O(N), Space Complexity: O(1).'
  },
  {
    id: 'p-6',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    tags: ['Arrays', 'Prefix Sum'],
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer. You must write an algorithm that runs in O(n) time and without using the division operation.',
    examples: [
      { input: '[1,2,3,4]', output: '[24,12,8,6]', explanation: '24=2*3*4, 12=1*3*4, 8=1*2*4, 6=1*2*3' }
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
    testCases: [
      { input: '[1,2,3,4]', expected: '[24,12,8,6]' },
      { input: '[-1,1,0,-3,3]', expected: '[0,0,9,0,0]' }
    ],
    solutionNotes: 'Compute prefix products in the first pass. Then compute suffix products in a reverse pass, multiplying them with the prefix array. Time Complexity: O(N), Space Complexity: O(1) (excluding output array).'
  },
  {
    id: 'p-7',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    tags: ['Arrays', 'Two Pointers'],
    description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    examples: [
      { input: '[1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The max area is formed by lines at index 1 and 8. Height=7, width=7, area=49.' }
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', expected: '49' },
      { input: '[1,1]', expected: '1' }
    ],
    solutionNotes: 'Use two pointers from both ends. The area is limited by the shorter line. Calculate area, then move the pointer that points to the shorter line inward. Time Complexity: O(N), Space Complexity: O(1).'
  },
  {
    id: 'p-8',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Strings', 'Sliding Window'],
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: '"abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    testCases: [
      { input: '"abcabcbb"', expected: '3' },
      { input: '"bbbbb"', expected: '1' },
      { input: '"pwwkew"', expected: '3' }
    ],
    solutionNotes: 'Use a sliding window (two pointers) and a HashSet to store characters. If a duplicate is found, shrink the window from the left until the duplicate is removed. Time: O(N), Space: O(min(N, M)).'
  },
  {
    id: 'p-9',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    tags: ['Arrays', 'Sorting'],
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap, merge them into [1,6].' }
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^4'],
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expected: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expected: '[[1,5]]' }
    ],
    solutionNotes: 'Sort the intervals by start time. Iterate and merge: if current start <= previous end, update previous end to max(prev_end, curr_end). Time: O(N log N), Space: O(N).'
  },
  {
    id: 'p-10',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    tags: ['Arrays', 'Two Pointers'],
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water are trapped.' }
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' },
      { input: '[4,2,0,3,2,5]', expected: '9' }
    ],
    solutionNotes: 'Use two pointers from left and right. Keep track of max_left and max_right. Calculate trapped water on the side with the smaller max height and move that pointer inward. Time: O(N), Space: O(1).'
  },
  {
    id: 'p-11',
    title: 'Top Earners (SQL)',
    difficulty: 'Easy',
    tags: ['SQL'],
    description: 'Write a SQL query to find the maximum total earnings for all employees as well as the total number of employees who have maximum total earnings. Assume total earnings = months * salary.',
    examples: [
      { input: 'Table: Employee (employee_id, name, months, salary)', output: 'MAX_EARNINGS | COUNT\n69952 | 1', explanation: 'The max earning is 69952 and only 1 employee has it.' }
    ],
    constraints: ['Use SQLite syntax', 'Return 2 columns: max_earnings, count'],
    testCases: [
      { input: 'SELECT 69952, 1', expected: '69952, 1' }
    ],
    solutionNotes: 'SELECT (months * salary) AS earnings, COUNT(*) FROM Employee GROUP BY earnings ORDER BY earnings DESC LIMIT 1;'
  },
  {
    id: 'p-12',
    title: 'Nth Highest Salary (SQL)',
    difficulty: 'Medium',
    tags: ['SQL'],
    description: 'Write a SQL query to report the nth highest salary from the Employee table. If there is no nth highest salary, the query should report null.',
    examples: [
      { input: 'Table: Employee (Id, Salary), N = 2', output: '200', explanation: 'The second highest salary is 200.' }
    ],
    constraints: ['Use SQLite syntax'],
    testCases: [
      { input: 'SELECT 200', expected: '200' }
    ],
    solutionNotes: 'Use LIMIT 1 OFFSET N-1 on a distinct ordered selection of salaries.'
  },
  {
    id: 'p-13',
    title: 'Department Top Three Salaries (SQL)',
    difficulty: 'Hard',
    tags: ['SQL'],
    description: 'Write a SQL query to find employees who earn the top three salaries in each of the company departments.',
    examples: [
      { input: 'Tables: Employee (Id, Name, Salary, DepartmentId), Department (Id, Name)', output: 'IT | Max | 90000', explanation: 'Max earns the highest in IT.' }
    ],
    constraints: ['Use SQLite syntax', 'Use DENSE_RANK() window function'],
    testCases: [
      { input: 'SELECT "IT", "Max", 90000', expected: '"IT", "Max", 90000' }
    ],
    solutionNotes: 'WITH Ranked AS (SELECT d.Name AS Department, e.Name AS Employee, e.Salary, DENSE_RANK() OVER(PARTITION BY e.DepartmentId ORDER BY e.Salary DESC) as rnk FROM Employee e JOIN Department d ON e.DepartmentId = d.Id) SELECT Department, Employee, Salary FROM Ranked WHERE rnk <= 3;'
  }
];
