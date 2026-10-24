const { createProblem } = require('./problem-helper');

const problems = [
  // --------------------------------------------------------------------------
  // cv177: DP - Dungeon Game Knight Health (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv177',
    slug: 'dungeon-game-knight-health',
    title: 'The Catacomb Knight Minimum Health',
    difficulty: 'HARD',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A knight begins at the top-left room (0, 0) of an N x M dungeon grid and must reach the captive princess in the bottom-right room (N - 1, M - 1).
Each room contains either demons (negative integer health penalty) or magic potions (positive integer health boost).
The knight can only move either rightward or downward at each step.
If at any point the knight's health drops to 0 or below, he dies immediately.

Determine the knight's minimum initial health required to rescue the princess.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated integers.',
    outputFormat: 'Print the minimum initial health.',
    constraints: '1 <= N, M <= 200\n-1000 <= Room_val <= 1000',
    sampleCases: [
      { input: '3 3\n-2 -3 3\n-5 -10 1\n10 30 -5', expectedOutput: '7', explanation: 'Path: right -> right -> down -> down requires initial health 7.' },
      { input: '1 1\n0', expectedOutput: '1', explanation: 'Needs at least 1 HP to survive.' },
    ],
    hiddenCases: [
      { input: '1 1\n-5' },
      { input: '1 1\n10' },
      { input: '2 2\n1 -2\n-3 1' },
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9' },
      { input: '3 3\n-1 -2 -3\n-4 -5 -6\n-7 -8 -9' },
      { input: '1 3\n-3 5 -2' },
      { input: '3 1\n-2\n-3\n-4' },
      { input: '4 4\n-2 -3 3 -1\n-5 -10 1 -2\n10 30 -5 -3\n-1 -2 -3 -4' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    grid = []
    idx = 2
    for _ in range(n):
        grid.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    dp = [[float('inf')] * (m + 1) for _ in range(n + 1)]
    dp[n][m - 1] = 1
    dp[n - 1][m] = 1
    
    for r in range(n - 1, -1, -1):
        for c in range(m - 1, -1, -1):
            needed = min(dp[r + 1][c], dp[r][c + 1]) - grid[r][c]
            dp[r][c] = max(1, needed)
            
    print(dp[0][0])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Bottom-up dynamic programming working backwards from princess chamber: dp[r][c] = max(1, min(dp[r+1][c], dp[r][c+1]) - grid[r][c]).',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv178: DP - Triangle Minimum Path Sum (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv178',
    slug: 'triangle-minimum-path-sum',
    title: 'The Triangular Pyramid Minimum Descent',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a triangular array of integers where row i has i + 1 numbers, find the minimum path sum from top to bottom.
For each step, you may move to an adjacent number on the row below (from index c in row r, you can move to index c or c + 1 in row r + 1).`,
    inputFormat: 'First line: Integer N (number of rows in the triangle).\nNext N lines: The i-th line contains i space-separated integers (1-based row index).',
    outputFormat: 'Print the minimum path sum.',
    constraints: '1 <= N <= 200\n-10000 <= val <= 10000',
    sampleCases: [
      { input: '4\n2\n3 4\n6 5 7\n4 1 8 3', expectedOutput: '11', explanation: 'Path: 2 -> 3 -> 5 -> 1 = 11.' },
      { input: '1\n-10', expectedOutput: '-10', explanation: 'Single element.' },
    ],
    hiddenCases: [
      { input: '2\n-1\n2 3' },
      { input: '3\n1\n-2 -5\n3 6 9' },
      { input: '4\n2\n3 2\n6 5 4\n4 1 8 2' },
      { input: '5\n7\n3 8\n8 1 0\n2 7 4 4\n4 5 2 6 5' },
      { input: '3\n-1\n-2 -3\n-4 -5 -6' },
      { input: '4\n1\n2 3\n4 5 6\n7 8 9 10' },
      { input: '5\n10\n1 2\n3 4 5\n6 7 8 9\n1 1 1 1 1' },
      { input: '2\n100\n-50 50' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    triangle = []
    idx = 1
    for r in range(1, n + 1):
        triangle.append([int(x) for x in data[idx:idx+r]])
        idx += r
        
    dp = triangle[-1][:]
    for r in range(n - 2, -1, -1):
        for c in range(r + 1):
            dp[c] = triangle[r][c] + min(dp[c], dp[c + 1])
            
    print(dp[0])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Bottom-up dynamic programming: collapse rows from bottom to top in-place.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv179: DP - Unique Paths Obstacle Grid (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv179',
    slug: 'unique-paths-obstacle-grid',
    title: 'The Fortress Rubble Obstacle Navigation',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A robot is located at the top-left corner of an N x M grid (marked (0, 0)).
The robot can only move either down or right at any point in time.
The robot is trying to reach the bottom-right corner of the grid (marked (N - 1, M - 1)).
An obstacle is marked as 1 and an open space is marked as 0 in the grid.
A path that encounters an obstacle is blocked.

Find the number of possible unique paths that the robot can take to reach the bottom-right corner.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated integers (0 or 1).',
    outputFormat: 'Print the total number of unique paths.',
    constraints: '1 <= N, M <= 100',
    sampleCases: [
      { input: '3 3\n0 0 0\n0 1 0\n0 0 0', expectedOutput: '2', explanation: '2 unique paths avoiding the center obstacle.' },
      { input: '2 2\n0 1\n0 0', expectedOutput: '1', explanation: 'Only 1 path.' },
    ],
    hiddenCases: [
      { input: '1 1\n0' },
      { input: '1 1\n1' },
      { input: '3 3\n1 0 0\n0 0 0\n0 0 0' },
      { input: '3 3\n0 0 0\n0 0 0\n0 0 1' },
      { input: '4 4\n0 0 0 0\n0 0 0 0\n0 0 0 0\n0 0 0 0' },
      { input: '3 4\n0 0 0 0\n0 1 0 0\n0 0 0 0' },
      { input: '5 5\n0 0 0 0 0\n0 1 1 1 0\n0 1 0 1 0\n0 1 1 1 0\n0 0 0 0 0' },
      { input: '2 3\n0 0 0\n0 0 0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    dp = [0] * m
    idx = 2
    
    first_val = int(data[idx])
    if first_val == 0:
        dp[0] = 1
        
    for r in range(n):
        for c in range(m):
            val = int(data[idx])
            idx += 1
            if val == 1:
                dp[c] = 0
            elif c > 0:
                dp[c] += dp[c - 1]
                
    print(dp[m - 1])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: '1D space-optimized grid DP: dp[c] = dp[c] + dp[c-1], resetting dp[c] = 0 when cell is an obstacle.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv180: DP - Russian Doll Envelopes (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv180',
    slug: 'russian-doll-envelopes',
    title: 'The Matryoshka Envelope Nesting',
    difficulty: 'HARD',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are given a 2D array of integers envelopes where envelopes[i] = [w_i, h_i] represents the width and height of an envelope.
One envelope can fit into another if and only if both the width and height of one envelope are strictly greater than the other envelope's width and height.

Return the maximum number of envelopes you can Russian doll (i.e., put one inside the other).
Rotation of envelopes is not allowed.`,
    inputFormat: 'First line: Integer N.\nNext N lines: Two space-separated integers w and h.',
    outputFormat: 'Print the maximum number of nested envelopes.',
    constraints: '1 <= N <= 50000\n1 <= w_i, h_i <= 10^5',
    sampleCases: [
      { input: '4\n5 4\n6 4\n6 7\n2 3', expectedOutput: '3', explanation: '[2,3] => [5,4] => [6,7] (3 envelopes).' },
      { input: '3\n1 1\n1 1\n1 1', expectedOutput: '1', explanation: 'All have identical dimensions; cannot nest.' },
    ],
    hiddenCases: [
      { input: '1\n10 10' },
      { input: '4\n1 3\n3 5\n6 7\n6 8' },
      { input: '5\n2 100\n3 200\n4 300\n5 500\n5 400' },
      { input: '5\n4 5\n4 6\n6 7\n2 3\n1 1' },
      { input: '3\n1 2\n2 3\n3 4' },
      { input: '6\n1 1\n2 2\n3 3\n4 4\n5 5\n6 6' },
      { input: '4\n10 20\n15 10\n20 30\n12 18' },
      { input: '5\n3 4\n3 5\n3 6\n3 7\n3 8' },
    ],
    solutionCode: `
import sys
import bisect

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    envelopes = []
    idx = 1
    for _ in range(n):
        w = int(data[idx])
        h = int(data[idx+1])
        envelopes.append((w, h))
        idx += 2
        
    # Sort: ascending width, descending height (prevents same-width nesting)
    envelopes.sort(key=lambda x: (x[0], -x[1]))
    
    # LIS on heights
    tails = []
    for _, h in envelopes:
        pos = bisect.bisect_left(tails, h)
        if pos == len(tails):
            tails.append(h)
        else:
            tails[pos] = h
            
    print(len(tails))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort width ascending and height descending, then find the Longest Increasing Subsequence on heights using patience sorting in O(N log N).',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv181: DP - Longest Arithmetic Subsequence (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv181',
    slug: 'longest-arithmetic-subsequence',
    title: 'The Harmonic Arithmetic Progression Span',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an array nums of integers, return the length of the longest arithmetic subsequence in nums.
A subsequence is a sequence of integers that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.
A sequence seq is arithmetic if seq[i+1] - seq[i] has the same value for all 0 <= i < len(seq) - 1.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the length of the longest arithmetic progression subsequence.',
    constraints: '2 <= N <= 1000\n0 <= nums[i] <= 500',
    sampleCases: [
      { input: '4\n3 6 9 12', expectedOutput: '4', explanation: 'Entire array is an AP with difference 3.' },
      { input: '6\n9 4 7 2 10 20', expectedOutput: '3', explanation: '[4, 7, 10] has common difference 3, length 3.' },
    ],
    hiddenCases: [
      { input: '2\n1 1' },
      { input: '2\n1 5' },
      { input: '5\n20 1 15 3 10' },
      { input: '6\n1 2 3 4 5 6' },
      { input: '5\n5 4 3 2 1' },
      { input: '7\n1 7 10 13 14 19 20' },
      { input: '5\n10 10 10 10 10' },
      { input: '6\n1 3 5 2 4 6' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    dp = {}
    max_len = 2
    
    for i in range(n):
        for j in range(i):
            diff = nums[i] - nums[j]
            dp[(i, diff)] = dp.get((j, diff), 1) + 1
            if dp[(i, diff)] > max_len:
                max_len = dp[(i, diff)]
                
    print(max_len)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Hash-map dynamic programming: dp[(i, diff)] stores the length of arithmetic subsequence ending at index i with step diff.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv182: DP - Target Sum Plus Minus Ways (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv182',
    slug: 'target-sum-plus-minus-ways',
    title: 'The Sign Assignment Target Balance',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given an integer array nums and an integer target.
You want to build an expression out of nums by adding one of the symbols '+' and '-' before each integer in nums and then concatenate all the integers.
Return the number of different expressions that you can build, which evaluates to target.`,
    inputFormat: 'First line: Two integers N and target.\nSecond line: N space-separated non-negative integers.',
    outputFormat: 'Print the number of ways.',
    constraints: '1 <= N <= 20\n0 <= nums[i] <= 1000\n-1000 <= target <= 1000',
    sampleCases: [
      { input: '5 3\n1 1 1 1 1', expectedOutput: '5', explanation: '5 ways to assign signs to sum to 3.' },
      { input: '1 1\n1', expectedOutput: '1', explanation: '+1 = 1.' },
    ],
    hiddenCases: [
      { input: '1 2\n1' },
      { input: '2 0\n0 0' },
      { input: '4 2\n1 1 1 1' },
      { input: '3 1\n1 2 2' },
      { input: '5 5\n1 2 3 4 5' },
      { input: '6 0\n1 2 3 1 2 3' },
      { input: '4 4\n2 2 2 2' },
      { input: '3 -3\n1 1 1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    total = sum(nums)
    if (total + target) % 2 != 0 or total < abs(target):
        print(0)
        return
        
    p = (total + target) // 2
    dp = [0] * (p + 1)
    dp[0] = 1
    
    for x in nums:
        for j in range(p, x - 1, -1):
            dp[j] += dp[j - x]
            
    print(dp[p])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Reduction to subset sum: P - N = target and P + N = total => 2*P = total + target. Count subsets summing to P.',
      timeComplexity: 'O(N * P)',
      spaceComplexity: 'O(P)',
    },
  },

  // --------------------------------------------------------------------------
  // cv183: DP - Interleaving String Verifier (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv183',
    slug: 'interleaving-string-verifier',
    title: 'The Dual Tapestry Thread Interleaver',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given strings s1, s2, and s3, find whether s3 is formed by an interleaving of s1 and s2.
An interleaving of two strings s and t is a configuration where s and t are divided into n and m substrings respectively, such that:
s = s_1 + s_2 + ... + s_n
t = t_1 + t_2 + ... + t_m
|n - m| <= 1
and the interleaving is s_1 + t_1 + s_2 + t_2 + ... or t_1 + s_1 + t_2 + s_2 + ...

Print YES if s3 is an interleaving of s1 and s2, otherwise print NO.`,
    inputFormat: 'Three lines: String s1, String s2, String s3.',
    outputFormat: 'Print YES or NO.',
    constraints: '0 <= len(s1), len(s2) <= 100\n0 <= len(s3) <= 200',
    sampleCases: [
      { input: 'aabcc\ndbbca\naadbbcbcac', expectedOutput: 'YES', explanation: 'Valid interleaving.' },
      { input: 'aabcc\ndbbca\naadbbbaccc', expectedOutput: 'NO', explanation: 'Not a valid interleaving.' },
    ],
    hiddenCases: [
      { input: 'a\nb\nab' },
      { input: 'a\nb\nba' },
      { input: 'aa\nbb\naabb' },
      { input: 'aa\nbb\nabab' },
      { input: 'abc\ndef\nadbecf' },
      { input: 'abc\ndef\nabcdef' },
      { input: 'abc\ndef\nfedcba' },
      { input: 'code\nvita\ncodevita' },
    ],
    solutionCode: `
import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 3:
        if len(lines) == 2:
            print("YES" if lines[0] == lines[1] else "NO")
        elif len(lines) == 0:
            print("YES")
        else:
            print("NO")
        return
    s1, s2, s3 = lines[0], lines[1], lines[2]
    
    n, m = len(s1), len(s2)
    if n + m != len(s3):
        print("NO")
        return
        
    dp = [False] * (m + 1)
    dp[0] = True
    
    for j in range(1, m + 1):
        dp[j] = dp[j - 1] and s2[j - 1] == s3[j - 1]
        
    for i in range(1, n + 1):
        dp[0] = dp[0] and s1[i - 1] == s3[i - 1]
        for j in range(1, m + 1):
            dp[j] = (dp[j] and s1[i - 1] == s3[i + j - 1]) or (dp[j - 1] and s2[j - 1] == s3[i + j - 1])
            
    print("YES" if dp[m] else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: '2D DP with 1D rolling array optimization: dp[j] indicates whether s1[0..i] and s2[0..j] can interleave to form s3[0..i+j].',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv184: DP - Count Palindromic Substrings (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv184',
    slug: 'count-palindromic-substrings',
    title: 'The Mirror Cipher Palindromic Substring Count',
    difficulty: 'EASY',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a string S, return the total number of palindromic substrings in it.
A string is a palindrome when it reads the same backward as forward.
A substring is a contiguous sequence of characters within the string.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print the count of palindromic substrings.',
    constraints: '1 <= len(S) <= 1000\nContains lowercase English letters.',
    sampleCases: [
      { input: 'abc', expectedOutput: '3', explanation: 'Palindromic substrings: "a", "b", "c".' },
      { input: 'aaa', expectedOutput: '6', explanation: '"a", "a", "a", "aa", "aa", "aaa".' },
    ],
    hiddenCases: [
      { input: 'a' },
      { input: 'aa' },
      { input: 'aba' },
      { input: 'racecar' },
      { input: 'noon' },
      { input: 'abcdef' },
      { input: 'bananas' },
      { input: 'aaaa' },
    ],
    solutionCode: `
import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    n = len(s)
    count = 0
    
    # Expand around centers
    for center in range(2 * n - 1):
        left = center // 2
        right = left + center % 2
        while left >= 0 and right < n and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
            
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Expand around 2N - 1 possible centers (odd and even palindromes) in O(N^2) time and O(1) space.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv185: DP - Distinct Subsequences Counting (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv185',
    slug: 'distinct-subsequences-counting',
    title: 'The Canonical Subsequence Occurrence Count',
    difficulty: 'HARD',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given two strings S and T, return the number of distinct subsequences of S which equals T.
Because the answer may be very large, print it modulo 10^9 + 7.`,
    inputFormat: 'First line: String S.\nSecond line: String T.',
    outputFormat: 'Print the number of distinct subsequences modulo 1000000007.',
    constraints: '1 <= len(S), len(T) <= 1000\nStrings contain lowercase English letters.',
    sampleCases: [
      { input: 'rabbbit\nrabbit', expectedOutput: '3', explanation: '3 distinct ways to form "rabbit" from "rabbbit".' },
      { input: 'babgbag\nbag', expectedOutput: '5', explanation: '5 distinct ways to form "bag".' },
    ],
    hiddenCases: [
      { input: 'a\na' },
      { input: 'a\nb' },
      { input: 'aaaa\naa' },
      { input: 'codevita\nvita' },
      { input: 'algorithms\nalg' },
      { input: 'banana\nan' },
      { input: 'geeksforgeeks\nge' },
      { input: 'abcdef\nabcdef' },
    ],
    solutionCode: `
import sys

MOD = 1000000007

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    s, t = lines[0], lines[1]
    
    n, m = len(s), len(t)
    if m > n:
        print(0)
        return
        
    dp = [0] * (m + 1)
    dp[0] = 1
    
    for c_s in s:
        for j in range(m, 0, -1):
            if c_s == t[j - 1]:
                dp[j] = (dp[j] + dp[j - 1]) % MOD
                
    print(dp[m])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: '1D space-optimized DP updating backwards: dp[j] = (dp[j] + dp[j - 1]) % MOD whenever s[i] == t[j].',
      timeComplexity: 'O(|S| * |T|)',
      spaceComplexity: 'O(|T|)',
    },
  },

  // --------------------------------------------------------------------------
  // cv186: DP - Coin Change Total Combinations (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv186',
    slug: 'coin-change-total-combinations',
    title: 'The Mint Coin Change Combination Ways',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.
Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return 0.
You may assume that you have an infinite number of each kind of coin.`,
    inputFormat: 'First line: Two integers N and Amount.\nSecond line: N space-separated coin values.',
    outputFormat: 'Print the total number of combinations.',
    constraints: '1 <= N <= 300\n0 <= Amount <= 5000\n1 <= Coin_i <= 5000',
    sampleCases: [
      { input: '3 5\n1 2 5', expectedOutput: '4', explanation: '5=5, 5=2+2+1, 5=2+1+1+1, 5=1+1+1+1+1 (4 ways).' },
      { input: '1 3\n2', expectedOutput: '0', explanation: 'Cannot make 3 using only 2s.' },
    ],
    hiddenCases: [
      { input: '1 0\n1' },
      { input: '1 10\n10' },
      { input: '4 10\n1 2 5 10' },
      { input: '2 7\n2 4' },
      { input: '3 100\n1 5 10' },
      { input: '4 50\n5 10 20 25' },
      { input: '5 30\n1 2 3 4 5' },
      { input: '3 15\n3 6 9' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    amount = int(data[1])
    coins = [int(x) for x in data[2:2+n]]
    
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for c in coins:
        for j in range(c, amount + 1):
            dp[j] += dp[j - c]
            
    print(dp[amount])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Unbounded knapsack combinations: outer loop iterates through coin types to ensure combinations are order-independent.',
      timeComplexity: 'O(N * Amount)',
      spaceComplexity: 'O(Amount)',
    },
  },

  // --------------------------------------------------------------------------
  // cv187: DP - Burst Balloons Maximum Coins (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv187',
    slug: 'burst-balloons-maximum-coins',
    title: 'The Festival Balloon Burst Reward Optimization',
    difficulty: 'HARD',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are given N balloons, indexed from 0 to N - 1. Each balloon is painted with a number on it represented by an array nums.
You are asked to burst all the balloons.
If you burst the i-th balloon, you will get nums[i - 1] * nums[i] * nums[i + 1] coins.
If i - 1 or i + 1 goes out of bounds of the array, treat it as if there is a balloon with a 1 painted on it.

Return the maximum coins you can collect by bursting the balloons wisely.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the maximum coins obtainable.',
    constraints: '1 <= N <= 300\n0 <= nums[i] <= 100',
    sampleCases: [
      { input: '4\n3 1 5 8', expectedOutput: '167', explanation: 'Burst 1 -> 3*1*5=15; burst 5 -> 3*5*8=120; burst 3 -> 1*3*8=24; burst 8 -> 1*8*1=8. Total = 167.' },
      { input: '2\n1 5', expectedOutput: '10', explanation: '1*5*1 + 1*1*5 = 10.' },
    ],
    hiddenCases: [
      { input: '1\n9' },
      { input: '3\n1 2 3' },
      { input: '5\n1 5 3 2 4' },
      { input: '4\n2 3 7 9' },
      { input: '3\n8 2 6' },
      { input: '6\n3 1 5 8 2 4' },
      { input: '4\n1 1 1 1' },
      { input: '5\n7 9 8 0 7' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [1] + [int(x) for x in data[1:1+n]] + [1]
    
    m = len(nums)
    dp = [[0] * m for _ in range(m)]
    
    for length in range(2, m):
        for left in range(m - length):
            right = left + length
            max_coins = 0
            for i in range(left + 1, right):
                coins = nums[left] * nums[i] * nums[right] + dp[left][i] + dp[i][right]
                if coins > max_coins:
                    max_coins = coins
            dp[left][right] = max_coins
            
    print(dp[0][m - 1])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Interval DP: think backwards — consider balloon i as the LAST balloon burst in subproblem (left, right).',
      timeComplexity: 'O(N^3)',
      spaceComplexity: 'O(N^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv188: Graphs - Bellman-Ford Negative Cycle (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv188',
    slug: 'bellman-ford-negative-cycle',
    title: 'The Arbitrage Negative Weight Cycle Investigator',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A currency trader monitors V currencies numbered 0 to V - 1 and E directional exchange rates with logarithmic transaction weights (which may be negative).
A negative weight cycle in this graph corresponds to an infinite arbitrage loop.

Determine whether there exists any negative weight cycle reachable from capital node 0 using the Bellman-Ford algorithm.
Print YES if a negative cycle exists, otherwise print NO.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Three integers u, v, w (directed edge u -> v with weight w).',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= V <= 1000\n0 <= E <= 5000\n-10000 <= w <= 10000',
    sampleCases: [
      { input: '3 3\n0 1 1\n1 2 -2\n2 0 -1', expectedOutput: 'YES', explanation: 'Cycle: 0->1->2->0 has total weight 1 - 2 - 1 = -2 < 0.' },
      { input: '3 2\n0 1 1\n1 2 2', expectedOutput: 'NO', explanation: 'DAG without cycles.' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '2 2\n0 1 -1\n1 0 -1' },
      { input: '3 3\n0 1 10\n1 2 20\n2 0 30' },
      { input: '4 4\n0 1 1\n1 2 -5\n2 3 2\n3 1 1' },
      { input: '4 3\n0 1 5\n1 2 -3\n2 3 2' },
      { input: '3 2\n0 1 -10\n1 2 -20' },
      { input: '5 5\n0 1 1\n1 2 1\n2 3 1\n3 4 1\n4 0 -10' },
      { input: '4 4\n0 1 2\n1 2 3\n2 3 4\n3 0 1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    edges = []
    idx = 2
    for _ in range(e):
        u = int(data[idx])
        nxt = int(data[idx+1])
        w = int(data[idx+2])
        edges.append((u, nxt, w))
        idx += 3
        
    dist = [float('inf')] * v
    dist[0] = 0
    
    # Relax V - 1 times
    for _ in range(v - 1):
        for u, nxt, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[nxt]:
                dist[nxt] = dist[u] + w
                
    # Check for V-th relaxation
    has_negative_cycle = False
    for u, nxt, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[nxt]:
            has_negative_cycle = True
            break
            
    print("YES" if has_negative_cycle else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Bellman-Ford algorithm: relax all E edges V-1 times; a further relaxation on step V proves the presence of a negative cycle.',
      timeComplexity: 'O(V * E)',
      spaceComplexity: 'O(V)',
    },
  },

  // --------------------------------------------------------------------------
  // cv189: Graphs - Prim Minimum Spanning Tree (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv189',
    slug: 'prim-minimum-spanning-tree',
    title: 'The Sacred Monolith Fiber Optic Tree',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given a connected undirected weighted graph of V vertices labeled 0 to V - 1 and E edges, compute the total weight of its Minimum Spanning Tree (MST) using Prim's algorithm.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Three integers u, v, and w.',
    outputFormat: 'Print the total MST weight.',
    constraints: '1 <= V <= 5000\n0 <= E <= 20000\n0 <= w <= 100000',
    sampleCases: [
      { input: '3 3\n0 1 5\n1 2 10\n0 2 1', expectedOutput: '6', explanation: 'Edges (0,2: 1) and (0,1: 5) form MST with weight 6.' },
      { input: '2 1\n0 1 100', expectedOutput: '100', explanation: 'Single edge.' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '4 5\n0 1 1\n1 2 2\n2 3 3\n3 0 4\n0 2 5' },
      { input: '4 4\n0 1 1\n1 2 2\n2 3 3\n3 0 4' },
      { input: '5 7\n0 1 2\n0 3 6\n1 2 3\n1 3 8\n1 4 5\n2 4 7\n3 4 9' },
      { input: '3 3\n0 1 2\n1 2 2\n0 2 2' },
      { input: '5 4\n0 1 10\n1 2 20\n2 3 30\n3 4 40' },
      { input: '6 8\n0 1 4\n0 2 2\n1 2 1\n1 3 5\n2 3 8\n2 4 10\n3 5 6\n4 5 3' },
      { input: '4 6\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4\n1 2 8' },
    ],
    solutionCode: `
import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    
    if v <= 1:
        print(0)
        return
        
    adj = [[] for _ in range(v)]
    idx = 2
    for _ in range(e):
        u = int(data[idx])
        nxt = int(data[idx+1])
        w = int(data[idx+2])
        adj[u].append((nxt, w))
        adj[nxt].append((u, w))
        idx += 3
        
    visited = [False] * v
    pq = [(0, 0)] # (weight, node)
    total_weight = 0
    nodes_visited = 0
    
    while pq and nodes_visited < v:
        w, u = heapq.heappop(pq)
        if visited[u]:
            continue
        visited[u] = True
        total_weight += w
        nodes_visited += 1
        
        for nxt, edge_w in adj[u]:
            if not visited[nxt]:
                heapq.heappush(pq, (edge_w, nxt))
                
    print(total_weight)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Prim's algorithm using priority queue min-heap to greedily expand the cut.",
      timeComplexity: 'O(E log V)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv190: Graphs - Network Delay Time Dijkstra (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv190',
    slug: 'network-delay-time-dijkstra',
    title: 'The Interstellar Transmission Delay',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are given a network of N nodes, labeled from 1 to N. You are also given times, a list of travel times as directed edges times[i] = [u, v, w], where u is the source node, v is the target node, and w is the time it takes for a signal to travel from source to target.

We will send a signal from a given node K. Return the minimum time it takes for all the N nodes to receive the signal. If it is impossible for all the N nodes to receive the signal, return -1.`,
    inputFormat: 'First line: Three integers N, E, and K.\nNext E lines: Three integers u, v, w.',
    outputFormat: 'Print the network delay time or -1.',
    constraints: '1 <= N <= 1000\n0 <= E <= 5000\n1 <= K <= N\n1 <= w <= 100',
    sampleCases: [
      { input: '4 3 2\n2 1 1\n2 3 1\n3 4 1', expectedOutput: '2', explanation: 'Node 4 receives signal at time 2.' },
      { input: '2 1 1\n1 2 1', expectedOutput: '1', explanation: 'Time 1.' },
    ],
    hiddenCases: [
      { input: '2 1 2\n1 2 1' },
      { input: '3 2 1\n1 2 1\n2 3 2' },
      { input: '4 4 1\n1 2 1\n2 3 2\n3 4 1\n1 4 5' },
      { input: '1 0 1' },
      { input: '5 6 1\n1 2 2\n1 3 4\n2 3 1\n2 4 7\n3 5 3\n4 5 1' },
      { input: '3 1 1\n1 2 1' },
      { input: '4 3 1\n1 2 1\n2 3 1\n3 4 1' },
      { input: '4 4 2\n2 1 5\n2 3 2\n3 4 1\n4 1 1' },
    ],
    solutionCode: `
import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    e = int(data[1])
    k = int(data[2])
    
    adj = [[] for _ in range(n + 1)]
    idx = 3
    for _ in range(e):
        u = int(data[idx])
        v = int(data[idx+1])
        w = int(data[idx+2])
        adj[u].append((v, w))
        idx += 3
        
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    pq = [(0, k)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for nxt, weight in adj[u]:
            if dist[u] + weight < dist[nxt]:
                dist[nxt] = dist[u] + weight
                heapq.heappush(pq, (dist[nxt], nxt))
                
    max_time = max(dist[1:n+1])
    print(max_time if max_time != float('inf') else -1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Single-source shortest path using Dijkstra's algorithm. Total time to reach all nodes is max(dist).",
      timeComplexity: 'O(E log V)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv191: Graphs - Reconstruct Itinerary Eulerian (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv191',
    slug: 'reconstruct-itinerary-eulerian-path',
    title: 'The Diplomatic Envoy Eulerian Route',
    difficulty: 'HARD',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are given a list of airline tickets where tickets[i] = [from_i, to_i] represent the departure and arrival airports of one flight.
Reconstruct the itinerary in order and return it.
All tickets belong to a man who departs from "JFK". Thus, the itinerary must begin with "JFK".
If there are multiple valid itineraries, you should return the itinerary that has the smallest lexical order when read as a single string.
You must use all the tickets once and only once.`,
    inputFormat: 'First line: Integer N (number of tickets).\nNext N lines: Two space-separated 3-letter uppercase airport codes (From To).',
    outputFormat: 'Print the complete itinerary airport codes separated by spaces.',
    constraints: '1 <= N <= 1000\nAirport codes consist of 3 uppercase letters.',
    sampleCases: [
      { input: '4\nMUC LHR\nJFK MUC\nSFO SJC\nLHR SFO', expectedOutput: 'JFK MUC LHR SFO SJC', explanation: 'JFK -> MUC -> LHR -> SFO -> SJC.' },
      { input: '5\nJFK SFO\nJFK ATL\nSFO ATL\nATL JFK\nATL SFO', expectedOutput: 'JFK ATL JFK SFO ATL SFO', explanation: 'Lexicographically earliest valid complete itinerary.' },
    ],
    hiddenCases: [
      { input: '1\nJFK ORD' },
      { input: '2\nJFK KUL\nKUL JFK' },
      { input: '3\nJFK A\nA B\nB JFK' },
      { input: '3\nJFK B\nJFK A\nA JFK' },
      { input: '4\nJFK B\nB C\nC JFK\nJFK A' },
      { input: '4\nJFK D\nD E\nE JFK\nJFK C' },
      { input: '2\nJFK SFO\nSFO LAX' },
      { input: '5\nJFK A\nA JFK\nJFK B\nB JFK\nJFK C' },
    ],
    solutionCode: `
import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    adj = defaultdict(list)
    idx = 1
    for _ in range(n):
        u = data[idx]
        v = data[idx+1]
        adj[u].append(v)
        idx += 2
        
    for u in adj:
        adj[u].sort(reverse=True)
        
    route = []
    
    # Hierholzer's algorithm
    def dfs(curr):
        while adj[curr]:
            nxt = adj[curr].pop()
            dfs(nxt)
        route.append(curr)
        
    dfs('JFK')
    print(' '.join(reversed(route)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Hierholzer's algorithm for finding Eulerian Path in directed multigraph, popping sorted adjacency list in post-order.",
      timeComplexity: 'O(E log E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv192: Graphs - Critical Connections Bridges Tarjan (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv192',
    slug: 'critical-connections-bridges-tarjan',
    title: 'The Critical Communication Bridge Vulnerability',
    difficulty: 'HARD',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `There are V servers numbered 0 to V - 1 and E bidirectional server connections.
A critical connection (bridge) is a connection that, if removed, will make some servers unable to communicate with each other.

Return the total count of critical connections in the network using Tarjan's bridge-finding algorithm.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Two integers u and v indicating a bidirectional connection.',
    outputFormat: 'Print the count of critical connections.',
    constraints: '2 <= V <= 5000\nV - 1 <= E <= 20000',
    sampleCases: [
      { input: '4 4\n0 1\n1 2\n2 0\n1 3', expectedOutput: '1', explanation: 'Only edge (1, 3) is a bridge.' },
      { input: '2 1\n0 1', expectedOutput: '1', explanation: 'Single connection is critical.' },
    ],
    hiddenCases: [
      { input: '3 3\n0 1\n1 2\n2 0' },
      { input: '4 3\n0 1\n1 2\n2 3' },
      { input: '5 5\n0 1\n1 2\n2 0\n1 3\n3 4' },
      { input: '5 6\n0 1\n1 2\n2 0\n1 3\n3 4\n4 1' },
      { input: '6 7\n0 1\n1 2\n2 0\n1 3\n3 4\n4 5\n5 3' },
      { input: '4 5\n0 1\n1 2\n2 3\n3 0\n0 2' },
      { input: '5 4\n0 1\n0 2\n0 3\n0 4' },
      { input: '6 6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 0' },
    ],
    solutionCode: `
import sys

# Increase recursion limit
sys.setrecursionlimit(50000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    
    adj = [[] for _ in range(v)]
    idx = 2
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        adj[w].append(u)
        idx += 2
        
    tin = [-1] * v
    low = [-1] * v
    timer = 0
    bridges = 0
    
    def dfs(node, parent):
        nonlocal timer, bridges
        tin[node] = low[node] = timer
        timer += 1
        
        for neighbor in adj[node]:
            if neighbor == parent:
                continue
            if tin[neighbor] != -1:
                low[node] = min(low[node], tin[neighbor])
            else:
                dfs(neighbor, node)
                low[node] = min(low[node], low[neighbor])
                if low[neighbor] > tin[node]:
                    bridges += 1
                    
    for i in range(v):
        if tin[i] == -1:
            dfs(i, -1)
            
    print(bridges)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Tarjan's bridge-finding algorithm using discovery time tin and lowest reachable time low. Bridge condition: low[neighbor] > tin[node].",
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv193: Graphs - Find Eventual Safe States (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv193',
    slug: 'find-eventual-safe-states',
    title: 'The Terminal Sanctuary Safe Nodes',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `There is a directed graph of V vertices with each node labeled from 0 to V - 1.
A terminal node is a node that has no outgoing edges.
A node is an eventual safe node if every possible path starting from that node leads to a terminal node (or another safe node).
Return all the safe nodes of the graph sorted in ascending order. If no node is safe, print NONE.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Two integers u and v indicating a directed edge u -> v.',
    outputFormat: 'Print space-separated safe nodes in ascending order, or NONE.',
    constraints: '1 <= V <= 5000\n0 <= E <= 10000\n0 <= u, v < V',
    sampleCases: [
      { input: '7 7\n0 1\n0 2\n1 2\n1 3\n2 5\n3 0\n4 5', expectedOutput: '2 4 5 6', explanation: 'Nodes 2, 4, 5, 6 are safe.' },
      { input: '3 3\n0 1\n1 2\n2 0', expectedOutput: 'NONE', explanation: 'All nodes are part of a cycle.' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '2 1\n0 1' },
      { input: '3 2\n0 1\n1 2' },
      { input: '4 4\n0 1\n1 2\n2 3\n3 1' },
      { input: '5 4\n0 1\n2 1\n3 1\n4 1' },
      { input: '4 0' },
      { input: '5 5\n0 1\n1 2\n2 0\n3 4\n4 3' },
      { input: '4 3\n0 1\n1 2\n3 2' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    
    # Reverse graph and in-degree on reverse graph (out-degree on original)
    rev_adj = [[] for _ in range(v)]
    out_degree = [0] * v
    idx = 2
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        rev_adj[w].append(u)
        out_degree[u] += 1
        idx += 2
        
    q = deque([i for i in range(v) if out_degree[i] == 0])
    safe = []
    
    while q:
        node = q.popleft()
        safe.append(node)
        for parent in rev_adj[node]:
            out_degree[parent] -= 1
            if out_degree[parent] == 0:
                q.append(parent)
                
    if safe:
        safe.sort()
        print(' '.join(map(str, safe)))
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Reverse graph topological sort (Kahn's): start from terminal nodes (out-degree 0) and propagate safety backwards.",
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv194: Graphs - Word Ladder Shortest Transformation (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv194',
    slug: 'word-ladder-shortest-transformation',
    title: 'The Alchemical Word Ladder Transformation',
    difficulty: 'HARD',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s_1 -> s_2 -> ... -> s_k such that:
- Every adjacent pair of words differs by exactly one letter.
- Every s_i for 1 <= i <= k is in wordList. Note that beginWord does not need to be in wordList.
- s_k == endWord.

Given beginWord, endWord, and wordList of size K, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.`,
    inputFormat: 'First line: beginWord.\nSecond line: endWord.\nThird line: Integer K.\nFourth line: K space-separated dictionary words.',
    outputFormat: 'Print the length of the shortest transformation sequence (including beginWord and endWord), or 0.',
    constraints: '1 <= len(beginWord) <= 10\n1 <= K <= 5000\nAll words have the same length.',
    sampleCases: [
      { input: 'hit\ncog\n6\nhot dot dog lot log cog', expectedOutput: '5', explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog" has length 5.' },
      { input: 'hit\ncog\n5\nhot dot dog lot log', expectedOutput: '0', explanation: 'endWord "cog" is not in wordList; return 0.' },
    ],
    hiddenCases: [
      { input: 'a\nc\n3\na b c' },
      { input: 'hot\ndog\n3\nhot dog cog' },
      { input: 'game\ntame\n2\ntame lame' },
      { input: 'red\ntax\n5\nted tex red tax tad' },
      { input: 'lost\ncost\n3\nmost cost lost' },
      { input: 'lead\ngold\n4\nload goad gold lead' },
      { input: 'cat\ndog\n2\ncat cot' },
      { input: 'code\nvita\n2\ncode vita' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if len(data) < 4:
        return
    begin_word = data[0]
    end_word = data[1]
    k = int(data[2])
    word_set = set(data[3:3+k])
    
    if end_word not in word_set:
        print(0)
        return
        
    q = deque([(begin_word, 1)])
    visited = {begin_word}
    
    alpha = 'abcdefghijklmnopqrstuvwxyz'
    L = len(begin_word)
    
    while q:
        curr, steps = q.popleft()
        if curr == end_word:
            print(steps)
            return
            
        for i in range(L):
            orig_char = curr[i]
            for c in alpha:
                if c == orig_char:
                    continue
                nxt = curr[:i] + c + curr[i+1:]
                if nxt in word_set and nxt not in visited:
                    visited.add(nxt)
                    q.append((nxt, steps + 1))
                    
    print(0)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Breadth-First Search over word mutation graph: replace each letter with all 26 alphabets in O(26 * L) per state.',
      timeComplexity: 'O(K * L * 26)',
      spaceComplexity: 'O(K * L)',
    },
  },

  // --------------------------------------------------------------------------
  // cv195: Graphs - Course Schedule Order Two (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv195',
    slug: 'course-schedule-order-two',
    title: 'The University Graduation Path Resolver',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.
You are given an array prerequisites where prerequisites[i] = [a_i, b_i] indicates that you must take course b_i first if you want to take course a_i.
Return the ordering of courses you should take to finish all courses.
If there are multiple valid orders, return the one that is lexicographically smallest.
If it is impossible to finish all courses, return IMPOSSIBLE.`,
    inputFormat: 'First line: Two integers numCourses and E.\nNext E lines: Two integers a and b (b is prerequisite of a).',
    outputFormat: 'Print the space-separated course order, or IMPOSSIBLE.',
    constraints: '1 <= numCourses <= 2000\n0 <= E <= 5000',
    sampleCases: [
      { input: '2 1\n1 0', expectedOutput: '0 1', explanation: 'Course 0 must be taken before course 1.' },
      { input: '4 4\n1 0\n2 0\n3 1\n3 2', expectedOutput: '0 1 2 3', explanation: 'Order: 0, 1, 2, 3.' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '2 2\n0 1\n1 0' },
      { input: '3 2\n1 0\n2 1' },
      { input: '4 0' },
      { input: '3 3\n0 1\n1 2\n2 0' },
      { input: '5 4\n1 0\n2 0\n3 0\n4 0' },
      { input: '4 3\n3 0\n2 0\n1 0' },
      { input: '5 5\n1 0\n2 1\n3 2\n4 3\n0 4' },
    ],
    solutionCode: `
import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    e = int(data[1])
    
    adj = [[] for _ in range(n)]
    in_degree = [0] * n
    idx = 2
    for _ in range(e):
        a = int(data[idx])
        b = int(data[idx+1])
        adj[b].append(a)
        in_degree[a] += 1
        idx += 2
        
    pq = [i for i in range(n) if in_degree[i] == 0]
    heapq.heapify(pq)
    
    order = []
    while pq:
        curr = heapq.heappop(pq)
        order.append(curr)
        for nxt in adj[curr]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0:
                heapq.heappush(pq, nxt)
                
    if len(order) == n:
        print(' '.join(map(str, order)))
    else:
        print("IMPOSSIBLE")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Kahn's algorithm using priority queue to guarantee lexicographical order and detect topological cycles.",
      timeComplexity: 'O(V log V + E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv196: Graphs - Redundant Connection Union-Find (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv196',
    slug: 'redundant-connection-union-find',
    title: 'The Redundant Span Bridge Disconnection',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `In this problem, a tree is an undirected graph that is connected and has no cycles.
You are given a graph that started as a tree with N nodes labeled from 1 to N, with one additional edge added.
The added edge has two different vertices chosen from 1 to N, and was not an edge that already existed.
The resulting graph is given as an array of edges of length N.

Return an edge that can be removed so that the resulting graph is a tree of N nodes.
If there are multiple answers, return the edge that occurs last in the input.`,
    inputFormat: 'First line: Integer N.\nNext N lines: Two space-separated integers u and v.',
    outputFormat: 'Print the redundant edge as: u v.',
    constraints: '3 <= N <= 1000\n1 <= u, v <= N',
    sampleCases: [
      { input: '3\n1 2\n1 3\n2 3', expectedOutput: '2 3', explanation: 'Removing (2, 3) restores the tree.' },
      { input: '5\n1 2\n2 3\n3 4\n1 4\n1 5', expectedOutput: '1 4', explanation: 'Edge (1, 4) creates cycle in first 4 edges.' },
    ],
    hiddenCases: [
      { input: '4\n1 2\n2 3\n3 4\n4 1' },
      { input: '4\n1 2\n1 3\n1 4\n2 3' },
      { input: '5\n1 2\n1 3\n2 4\n3 5\n4 5' },
      { input: '6\n1 2\n2 3\n3 4\n4 5\n5 6\n1 6' },
      { input: '3\n1 2\n2 3\n1 3' },
      { input: '5\n2 3\n3 4\n4 5\n1 2\n1 5' },
      { input: '4\n1 2\n2 3\n2 4\n3 4' },
      { input: '6\n1 2\n1 3\n1 4\n1 5\n1 6\n5 6' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    parent = list(range(n + 1))
    def find(i):
        path = []
        while parent[i] != i:
            path.append(i)
            i = parent[i]
        for node in path:
            parent[node] = i
        return i
        
    idx = 1
    redundant = None
    for _ in range(n):
        u = int(data[idx])
        v = int(data[idx+1])
        idx += 2
        
        root_u = find(u)
        root_v = find(v)
        if root_u == root_v:
            redundant = (u, v)
        else:
            parent[root_u] = root_v
            
    print(f"{redundant[0]} {redundant[1]}")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Disjoint Set Union (Union-Find): the edge whose endpoints already belong to the same connected component creates the cycle.',
      timeComplexity: 'O(N * alpha(N))',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv197: Graphs - Tree Maximum Path Sum (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv197',
    slug: 'binary-tree-maximum-path-sum',
    title: 'The Ancestral Tree Maximum Energy Path',
    difficulty: 'HARD',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A path in a tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. A node can only appear in the sequence at most once.
The path sum of a path is the sum of the node's values in the path.

You are given an undirected tree with V nodes numbered 1 to V, where the i-th node has an integer value Val_i.
Find the maximum path sum of any non-empty path in the tree.`,
    inputFormat: 'First line: Integer V.\nSecond line: V space-separated integers representing node values Val_1 to Val_V.\nNext V - 1 lines: Two integers u and v indicating an edge.',
    outputFormat: 'Print the maximum path sum.',
    constraints: '1 <= V <= 30000\n-1000 <= Val_i <= 1000',
    sampleCases: [
      { input: '3\n1 2 3\n1 2\n1 3', expectedOutput: '6', explanation: 'Path 2 -> 1 -> 3 has sum 2 + 1 + 3 = 6.' },
      { input: '5\n-10 9 20 15 7\n1 2\n1 3\n3 4\n3 5', expectedOutput: '42', explanation: 'Path 4 -> 3 -> 5 has sum 15 + 20 + 7 = 42.' },
    ],
    hiddenCases: [
      { input: '1\n-5' },
      { input: '2\n-1 -2\n1 2' },
      { input: '3\n-2 1 -1\n1 2\n2 3' },
      { input: '4\n1 2 3 4\n1 2\n2 3\n3 4' },
      { input: '5\n5 4 3 2 1\n1 2\n1 3\n1 4\n1 5' },
      { input: '6\n10 -5 20 -10 30 5\n1 2\n1 3\n2 4\n3 5\n5 6' },
      { input: '3\n10 20 30\n1 2\n2 3' },
      { input: '4\n-10 -20 -30 -40\n1 2\n2 3\n3 4' },
    ],
    solutionCode: `
import sys

sys.setrecursionlimit(50000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    vals = [0] + [int(x) for x in data[1:1+v]]
    
    if v == 1:
        print(vals[1])
        return
        
    adj = [[] for _ in range(v + 1)]
    idx = 1 + v
    for _ in range(v - 1):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        adj[w].append(u)
        idx += 2
        
    max_global = float('-inf')
    
    def dfs(node, parent):
        nonlocal max_global
        max_branch_1, max_branch_2 = 0, 0
        
        for neighbor in adj[node]:
            if neighbor != parent:
                gain = dfs(neighbor, node)
                if gain > max_branch_1:
                    max_branch_2 = max_branch_1
                    max_branch_1 = gain
                elif gain > max_branch_2:
                    max_branch_2 = gain
                    
        # Path passing through node turning at node
        local_max = vals[node] + max_branch_1 + max_branch_2
        if local_max > max_global:
            max_global = local_max
            
        # Gain contributed upward
        return max(0, vals[node] + max_branch_1)
        
    dfs(1, 0)
    print(max_global)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Tree Dynamic Programming: at each node, compute maximum single branch gain to pass upward, while checking path turning through node.',
      timeComplexity: 'O(V)',
      spaceComplexity: 'O(V)',
    },
  },

  // --------------------------------------------------------------------------
  // cv198: Graphs - Tree Graph Validator (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv198',
    slug: 'is-graph-tree-validator',
    title: 'The Connected Acyclic Tree Structural Check',
    difficulty: 'EASY',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an undirected graph of V vertices labeled 0 to V - 1 and E edges, determine whether the graph forms a valid tree.
An undirected graph is a tree if and only if:
1. It is fully connected (all V vertices in a single connected component).
2. It has no cycles (which implies E == V - 1).

Print YES if the graph is a valid tree, otherwise print NO.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Two integers u and v indicating an undirected edge.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= V <= 5000\n0 <= E <= 10000\n0 <= u, v < V',
    sampleCases: [
      { input: '5 4\n0 1\n0 2\n0 3\n1 4', expectedOutput: 'YES', explanation: 'Graph is connected and has no cycles.' },
      { input: '5 5\n0 1\n1 2\n2 3\n1 3\n1 4', expectedOutput: 'NO', explanation: 'Contains a cycle (1-2-3-1).' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '2 1\n0 1' },
      { input: '4 2\n0 1\n2 3' },
      { input: '4 4\n0 1\n1 2\n2 3\n3 0' },
      { input: '3 2\n0 1\n1 2' },
      { input: '6 5\n0 1\n1 2\n2 3\n3 4\n4 5' },
      { input: '5 3\n0 1\n0 2\n0 3' },
      { input: '4 3\n0 1\n1 2\n0 2' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    
    if e != v - 1:
        print("NO")
        return
        
    parent = list(range(v))
    def find(i):
        path = []
        while parent[i] != i:
            path.append(i)
            i = parent[i]
        for node in path:
            parent[node] = i
        return i
        
    idx = 2
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        idx += 2
        
        root_u = find(u)
        root_w = find(w)
        if root_u == root_w:
            print("NO") # Cycle found
            return
        parent[root_u] = root_w
        
    print("YES")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Graph property: an undirected graph is a tree iff E == V - 1 and it contains no cycles (verified via Disjoint Set Union).',
      timeComplexity: 'O(V + E * alpha(V))',
      spaceComplexity: 'O(V)',
    },
  },
];

console.log(`Writing Batch 9 (${problems.length} problems)...`);
problems.forEach((p) => {
  console.log(`Generating: ${p.id}`);
  createProblem(p);
});
console.log('✅ Batch 9 written successfully!');
