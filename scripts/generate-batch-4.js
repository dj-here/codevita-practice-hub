const { createProblem } = require('./problem-helper');

const problems = [
  // --------------------------------------------------------------------------
  // cv067: DP - 0/1 Knapsack (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv067',
    slug: 'knapsack-treasure-vault',
    title: 'Knapsack of the Ancient Vault',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An explorer discovers an ancient vault containing N priceless relics. Each relic has a monetary value V_i and a weight W_i. The explorer carries a knapsack that can hold a maximum total weight of C.

Determine the maximum total monetary value the explorer can carry away without exceeding the knapsack's weight capacity. Each relic can either be taken completely or left behind (0/1 choice).`,
    inputFormat: 'First line: Two integers N and C (number of relics, max weight capacity).\nSecond line: N space-separated integers representing the values of relics.\nThird line: N space-separated integers representing the weights of relics.',
    outputFormat: 'Print a single integer: the maximum value obtainable.',
    constraints: '1 <= N <= 1000\n1 <= C <= 2000\n1 <= V_i <= 10000\n1 <= W_i <= 2000',
    sampleCases: [
      { input: '4 7\n1 4 5 7\n1 3 4 5', expectedOutput: '9', explanation: 'Select items with weight 3 and 4 (values 4 + 5 = 9, weight 7 <= 7).' },
      { input: '3 4\n1 2 3\n4 5 1', expectedOutput: '3', explanation: 'Select 3rd item with weight 1 (value 3).' },
    ],
    hiddenCases: [
      { input: '1 10\n100\n5' },
      { input: '1 4\n100\n5' },
      { input: '5 10\n10 20 30 40 50\n1 2 3 4 5' },
      { input: '6 15\n10 15 40 25 30 50\n2 3 5 4 6 7' },
      { input: '5 20\n12 10 20 15 35\n3 2 4 5 8' },
      { input: '4 5\n100 200 300 400\n6 7 8 9' },
      { input: '8 30\n5 10 15 20 25 30 35 40\n2 5 7 8 10 12 14 15' },
      { input: '10 50\n15 25 35 45 55 65 75 85 95 105\n5 10 12 15 18 20 22 25 28 30' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    c = int(data[1])
    values = [int(x) for x in data[2:2+n]]
    weights = [int(x) for x in data[2+n:2+2*n]]
    
    dp = [0] * (c + 1)
    for v, w in zip(values, weights):
        for j in range(c, w - 1, -1):
            if dp[j - w] + v > dp[j]:
                dp[j] = dp[j - w] + v
                
    print(dp[c])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Classic 0/1 knapsack using 1D space-optimized DP iterating capacities backwards from C down to weight.',
      timeComplexity: 'O(N * C)',
      spaceComplexity: 'O(C)',
    },
  },

  // --------------------------------------------------------------------------
  // cv068: DP - Coin Change Minimum (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv068',
    slug: 'coin-change-minimum-denominations',
    title: 'The Alchemist Coin Dispenser',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An alchemical automated bank dispenses coins of N distinct denominations. A customer requests an exact payout of Target coins.

You have an infinite supply of coins of each denomination. Determine the minimum number of coins needed to make up that amount. If that amount cannot be made up by any combination of the given coins, print -1.`,
    inputFormat: 'First line: Two integers N and Target.\nSecond line: N space-separated integers representing coin denominations.',
    outputFormat: 'Print the minimum coins required, or -1 if impossible.',
    constraints: '1 <= N <= 100\n1 <= Target <= 10000\n1 <= Coin value <= 5000',
    sampleCases: [
      { input: '3 11\n1 2 5', expectedOutput: '3', explanation: '11 = 5 + 5 + 1 (3 coins).' },
      { input: '1 2\n3', expectedOutput: '-1', explanation: 'Target 2 cannot be made with coins of denomination 3.' },
    ],
    hiddenCases: [
      { input: '1 0\n1' },
      { input: '4 6249\n186 419 83 408' },
      { input: '3 7\n2 4 6' },
      { input: '5 100\n1 5 10 25 50' },
      { input: '3 30\n1 15 25' },
      { input: '4 43\n5 10 25 50' },
      { input: '6 9999\n1 7 23 57 113 239' },
      { input: '2 1000\n3 7' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    coins = [int(x) for x in data[2:2+n]]
    
    if target == 0:
        print(0)
        return
        
    INF = float('inf')
    dp = [INF] * (target + 1)
    dp[0] = 0
    
    for c in coins:
        for i in range(c, target + 1):
            if dp[i - c] + 1 < dp[i]:
                dp[i] = dp[i - c] + 1
                
    ans = dp[target]
    print(ans if ans != INF else -1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Unbounded knapsack DP: dp[i] represents minimum coins to form value i, computed as min(dp[i], dp[i - coin] + 1).',
      timeComplexity: 'O(N * Target)',
      spaceComplexity: 'O(Target)',
    },
  },

  // --------------------------------------------------------------------------
  // cv069: DP - Longest Common Subsequence (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv069',
    slug: 'longest-common-scroll',
    title: 'Deciphering the Dual Scrolls',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Historians discover two ancient manuscript scrolls S1 and S2 containing sequences of uppercase alphabetic runes. To establish their genealogical connection, the historians need to find the length of the Longest Common Subsequence (LCS) shared by both manuscripts.

A subsequence is a sequence that can be derived from another sequence by deleting some or no runes without changing the order of the remaining runes.`,
    inputFormat: 'First line: String S1.\nSecond line: String S2.',
    outputFormat: 'Print a single integer: the length of the LCS.',
    constraints: '1 <= len(S1), len(S2) <= 1500\nStrings contain only uppercase English letters.',
    sampleCases: [
      { input: 'ABCDE\nACE', expectedOutput: '3', explanation: 'Common subsequence "ACE" has length 3.' },
      { input: 'ABC\nABC', expectedOutput: '3', explanation: 'Strings are identical.' },
    ],
    hiddenCases: [
      { input: 'ABC\nDEF' },
      { input: 'AGGTAB\nGXTXAYB' },
      { input: 'DYNAMICPROGRAMMING\nALGORITHMICDESIGN' },
      { input: 'CODEVITA\nCODEVITA2026' },
      { input: 'AAAA\nAA' },
      { input: 'BANANA\nATANA' },
      { input: 'PREQUALIFIERROUND\nQUALIFIERSTAGE' },
      { input: 'XYZW\nWZYX' },
    ],
    solutionCode: `
import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        print(0)
        return
    s1, s2 = lines[0], lines[1]
    n, m = len(s1), len(s2)
    
    prev = [0] * (m + 1)
    curr = [0] * (m + 1)
    
    for i in range(1, n + 1):
        c1 = s1[i - 1]
        for j in range(1, m + 1):
            if c1 == s2[j - 1]:
                curr[j] = prev[j - 1] + 1
            else:
                curr[j] = prev[j] if prev[j] > curr[j - 1] else curr[j - 1]
        prev, curr = curr, [0] * (m + 1)
        
    print(prev[m])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Standard 2D Dynamic Programming with 2-row rolling array optimization to achieve O(M) auxiliary space.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(min(N, M))',
    },
  },

  // --------------------------------------------------------------------------
  // cv070: DP - Longest Increasing Subsequence (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv070',
    slug: 'longest-increasing-watchtowers',
    title: 'The Fortress Watchtower Chain',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A fortress commander oversees a line of N watchtowers from west to east. Each watchtower has a registered elevation height H_i.

To establish an unobstructed optical beacon line, the commander must select a sequence of watchtowers from west to east such that each tower is strictly taller than the preceding selected tower.

Find the maximum number of watchtowers that can be included in such a strictly ascending beacon chain.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers representing tower heights.',
    outputFormat: 'Print the maximum length of a strictly increasing subsequence.',
    constraints: '1 <= N <= 20000\n-10^9 <= H_i <= 10^9',
    sampleCases: [
      { input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4', explanation: 'Subsequence [2, 3, 7, 101] or [2, 5, 7, 101] has length 4.' },
      { input: '6\n0 1 0 3 2 3', expectedOutput: '4', explanation: 'Subsequence [0, 1, 2, 3] has length 4.' },
    ],
    hiddenCases: [
      { input: '1\n42' },
      { input: '5\n5 4 3 2 1' },
      { input: '6\n1 2 3 4 5 6' },
      { input: '7\n7 7 7 7 7 7 7' },
      { input: '10\n3 1 4 1 5 9 2 6 5 3' },
      { input: '8\n10 22 9 33 21 50 41 60' },
      { input: '12\n100 9 10 20 5 6 7 8 2 3 4 50' },
      { input: '9\n1 3 6 7 9 4 10 5 6' },
    ],
    solutionCode: `
import sys
import bisect

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
            
    print(len(tails))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Patience sorting / binary search on tails array: maintain the smallest tail of all increasing subsequences of various lengths in O(N log N).',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv071: DP - Matrix Chain Multiplication (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv071',
    slug: 'matrix-chain-multiplication-cost',
    title: 'Optimal Matrix Computation Pipeline',
    difficulty: 'HARD',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A scientific computing cluster must compute the product of a chain of M matrices: A_1 * A_2 * ... * A_M.
Matrix A_i has dimension P_{i-1} x P_i.

Multiplication is associative, so parenthesization determines computational cost. Multiplying an (x by y) matrix by a (y by z) matrix requires x * y * z scalar multiplications.

Given the array of dimensions P of length N = M + 1, compute the minimum number of scalar multiplications required to multiply the entire chain.`,
    inputFormat: 'First line: Integer N (number of dimensions; M = N - 1 matrices).\nSecond line: N space-separated integers representing dimensions P_0, P_1, ..., P_{N-1}.',
    outputFormat: 'Print the minimum scalar multiplications.',
    constraints: '2 <= N <= 100\n1 <= P_i <= 100',
    sampleCases: [
      { input: '5\n10 20 30 40 30', expectedOutput: '30000', explanation: 'Optimal parenthesization: ((A1 * (A2 * A3)) * A4) or ((A1 * A2) * (A3 * A4)) gives 30000 scalar ops.' },
      { input: '4\n10 30 5 60', expectedOutput: '4500', explanation: '((A1 * A2) * A3) -> 10*30*5 + 10*5*60 = 1500 + 3000 = 4500.' },
    ],
    hiddenCases: [
      { input: '2\n10 20' },
      { input: '3\n10 20 30' },
      { input: '4\n40 20 30 10' },
      { input: '6\n30 35 15 5 10 20' },
      { input: '5\n5 10 3 12 5' },
      { input: '7\n1 2 3 4 5 6 7' },
      { input: '8\n10 5 2 20 12 4 60 10' },
      { input: '5\n50 20 1 10 100' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    p = [int(x) for x in data[1:1+n]]
    
    m = n - 1
    if m <= 1:
        print(0)
        return
        
    dp = [[0] * m for _ in range(m)]
    
    for length in range(2, m + 1):
        for i in range(m - length + 1):
            j = i + length - 1
            min_cost = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k+1][j] + p[i] * p[k+1] * p[j+1]
                if cost < min_cost:
                    min_cost = cost
            dp[i][j] = min_cost
            
    print(dp[0][m-1])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Interval Dynamic Programming: solve optimal splitting point k for chains of length 2 up to M, building bottom-up.',
      timeComplexity: 'O(M^3)',
      spaceComplexity: 'O(M^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv072: DP - Cutting Rod Profit (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv072',
    slug: 'timber-rod-cutting-maximizer',
    title: 'The Royal Carpenter Rod Optimizer',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A royal carpenter possesses a long timber rod of length N inches. A trade catalog specifies the selling price P_i for a rod of length i inches (for 1 <= i <= N).

The carpenter can cut the rod into any number of integer-length pieces. Determine the maximum revenue obtainable by cutting up the rod and selling the pieces.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers where the i-th integer is the price P_i of a rod of length i.',
    outputFormat: 'Print the maximum obtainable total price.',
    constraints: '1 <= N <= 1000\n1 <= P_i <= 10000',
    sampleCases: [
      { input: '8\n1 5 8 9 10 17 17 20', expectedOutput: '22', explanation: 'Cut into two pieces of lengths 2 and 6 for price 5 + 17 = 22.' },
      { input: '4\n1 5 8 9', expectedOutput: '10', explanation: 'Cut into two pieces of length 2 each for 5 + 5 = 10.' },
    ],
    hiddenCases: [
      { input: '1\n10' },
      { input: '2\n3 5' },
      { input: '3\n2 5 7' },
      { input: '5\n2 5 7 8 10' },
      { input: '6\n3 5 8 9 10 17' },
      { input: '7\n1 5 8 9 10 17 17' },
      { input: '10\n1 5 8 9 10 17 17 20 24 30' },
      { input: '9\n3 7 11 15 19 23 27 31 35' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    prices = [int(x) for x in data[1:1+n]]
    
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        max_val = -1
        for j in range(1, i + 1):
            val = prices[j - 1] + dp[i - j]
            if val > max_val:
                max_val = val
        dp[i] = max_val
        
    print(dp[n])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Unbounded knapsack / rod-cutting DP: dp[i] = max over j in 1..i of (price[j] + dp[i - j]).',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv073: DP - Spell Parchment Edit Distance (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv073',
    slug: 'spell-parchment-edit-distance',
    title: 'Scribe Edit Distance Correction',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An apprentice scribe copies an ancient incantation string S1, but inadvertently introduces transcription errors, yielding string S2.

To restore the incantation, the head scribe can perform three atomic operations:
1. Insert a character.
2. Delete a character.
3. Replace a character with another.

Calculate the minimum number of edit operations required to transform S1 into S2.`,
    inputFormat: 'First line: String S1.\nSecond line: String S2.',
    outputFormat: 'Print the minimum edit distance.',
    constraints: '1 <= len(S1), len(S2) <= 1000\nStrings contain lowercase English letters.',
    sampleCases: [
      { input: 'horse\nros', expectedOutput: '3', explanation: 'horse -> rorse (replace h with r) -> rose (remove r) -> ros (remove e).' },
      { input: 'intention\nexecution', expectedOutput: '5', explanation: '5 edit operations required.' },
    ],
    hiddenCases: [
      { input: 'a\na' },
      { input: 'cat\nhat' },
      { input: 'kitten\nsitting' },
      { input: 'sunday\nsaturday' },
      { input: 'algorithm\nalgorithmic' },
      { input: 'codevita\ncodevita' },
      { input: 'zoologico\nzoologico' },
      { input: 'abcdef\nazced' },
    ],
    solutionCode: `
import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        if len(lines) == 1:
            print(len(lines[0]))
        else:
            print(0)
        return
    s1, s2 = lines[0], lines[1]
    n, m = len(s1), len(s2)
    
    prev = list(range(m + 1))
    curr = [0] * (m + 1)
    
    for i in range(1, n + 1):
        curr[0] = i
        c1 = s1[i - 1]
        for j in range(1, m + 1):
            if c1 == s2[j - 1]:
                curr[j] = prev[j - 1]
            else:
                curr[j] = 1 + min(prev[j - 1], prev[j], curr[j - 1])
        prev = curr[:]
        
    print(prev[m])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Levenshtein Edit Distance dynamic programming with space-optimized rolling arrays.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv074: DP - Maximum Subarray Product (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv074',
    slug: 'maximum-subarray-multiplication-product',
    title: 'The Maximum Energy Pulse Product',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A particle accelerator generates a sequential beam of N energy pulses. Each pulse has an integer multiplier P_i (which can be positive, negative, or zero).

Find the contiguous non-empty subarray of pulses that produces the maximum product of multipliers. Print that maximum product.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the maximum product of any contiguous subarray.',
    constraints: '1 <= N <= 20000\n-10 <= P_i <= 10\nThe answer will fit in a standard 64-bit signed integer.',
    sampleCases: [
      { input: '4\n2 3 -2 4', expectedOutput: '6', explanation: 'Subarray [2, 3] gives product 6.' },
      { input: '3\n-2 0 -1', expectedOutput: '0', explanation: 'Subarray [0] gives max product 0.' },
    ],
    hiddenCases: [
      { input: '1\n-5' },
      { input: '2\n-2 3' },
      { input: '4\n-2 -3 -4 -5' },
      { input: '5\n-1 -2 -3 0 5' },
      { input: '6\n2 -5 3 1 -4 0' },
      { input: '5\n0 0 0 0 0' },
      { input: '7\n-2 1 -3 4 -1 2 1' },
      { input: '5\n6 -3 -10 0 2' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    max_so_far = nums[0]
    min_so_far = nums[0]
    result = nums[0]
    
    for i in range(1, n):
        curr = nums[i]
        candidates = (curr, max_so_far * curr, min_so_far * curr)
        max_so_far = max(candidates)
        min_so_far = min(candidates)
        result = max(result, max_so_far)
        
    print(result)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Kadane variant tracking both max_prod and min_prod at each position since a negative number times min_prod can yield a new maximum.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv075: DP - Equal Partition Treasury Balance (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv075',
    slug: 'equal-partition-treasury-balance',
    title: 'Partitioning the Imperial Treasury',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Two provincial governors must divide N treasure chests among themselves. The i-th chest contains gold coins valued at A_i.

Determine whether the chests can be divided into two disjoint subsets such that the total value of gold in both subsets is strictly equal.

Print YES if such a balanced division is possible, otherwise print NO.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated positive integers.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= N <= 200\n1 <= A_i <= 100',
    sampleCases: [
      { input: '4\n1 5 11 5', expectedOutput: 'YES', explanation: 'Can be partitioned into [1, 5, 5] and [11], both summing to 11.' },
      { input: '4\n1 2 3 5', expectedOutput: 'NO', explanation: 'Total sum is 11 (odd), cannot be split equally.' },
    ],
    hiddenCases: [
      { input: '2\n5 5' },
      { input: '2\n3 5' },
      { input: '6\n1 2 3 4 5 5' },
      { input: '5\n2 2 2 2 4' },
      { input: '6\n1 2 5 6 7 9' },
      { input: '8\n3 1 1 2 2 1 1 2' },
      { input: '5\n10 20 30 40 100' },
      { input: '7\n1 3 4 7 8 9 10' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    total = sum(nums)
    if total % 2 != 0:
        print("NO")
        return
        
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for x in nums:
        for j in range(target, x - 1, -1):
            if dp[j - x]:
                dp[j] = True
                
    print("YES" if dp[target] else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Reduction to 0/1 Knapsack / Subset Sum: check if any subset sums to total / 2.',
      timeComplexity: 'O(N * sum(A) / 2)',
      spaceComplexity: 'O(sum(A) / 2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv076: DP - Citadel Night Patrol Robber (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv076',
    slug: 'citadel-night-patrol-robber',
    title: 'The Silent Infiltration Planner',
    difficulty: 'EASY',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A phantom thief plans to infiltrate houses along a straight street. There are N houses numbered 1 to N, each containing loot valued at L_i.

However, all adjacent houses are equipped with connected security alarms. If two directly adjacent houses are both raided on the same night, the central garrison is alerted immediately.

Determine the maximum total loot value the thief can collect without triggering the alarm.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the maximum total loot value.',
    constraints: '1 <= N <= 10000\n0 <= L_i <= 10000',
    sampleCases: [
      { input: '4\n1 2 3 1', expectedOutput: '4', explanation: 'Loot house 1 (1) and house 3 (3) -> total 4.' },
      { input: '5\n2 7 9 3 1', expectedOutput: '12', explanation: 'Loot house 1 (2), house 3 (9), house 5 (1) -> total 12.' },
    ],
    hiddenCases: [
      { input: '1\n100' },
      { input: '2\n50 60' },
      { input: '3\n10 1 10' },
      { input: '6\n5 3 4 11 2 7' },
      { input: '7\n9 1 1 9 1 1 9' },
      { input: '5\n0 0 0 0 0' },
      { input: '8\n2 1 4 9 1 3 8 2' },
      { input: '6\n10 20 30 40 50 60' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    if n == 1:
        print(nums[0])
        return
        
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
    
    for i in range(2, n):
        curr = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = curr
        
    print(prev1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'House Robber dynamic programming with two state variables: rob[i] = max(rob[i-1], rob[i-2] + nums[i]).',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv077: DP - Hieroglyph Word Break (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv077',
    slug: 'hieroglyph-word-break',
    title: 'The Hieroglyphic Parchment Segmenter',
    difficulty: 'MEDIUM',
    topics: ['Dynamic Programming'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An epigrapher is translating an unspaced string S of length L. A known dictionary of K valid ancient words is provided.

Determine whether the string S can be segmented into a space-separated sequence of one or more dictionary words. The same word in the dictionary may be reused multiple times.

Print YES if valid segmentation is possible, otherwise print NO.`,
    inputFormat: 'First line: String S.\nSecond line: Integer K.\nThird line: K space-separated dictionary words.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= len(S) <= 1000\n1 <= K <= 1000\n1 <= len(word) <= 50\nAll words contain lowercase letters.',
    sampleCases: [
      { input: 'leetcode\n2\nleet code', expectedOutput: 'YES', explanation: '"leetcode" can be segmented as "leet code".' },
      { input: 'applepenapple\n2\napple pen', expectedOutput: 'YES', explanation: '"applepenapple" can be segmented as "apple pen apple".' },
    ],
    hiddenCases: [
      { input: 'catsandog\n5\ncats dog sand and cat' },
      { input: 'codevita\n3\ncode vita hub' },
      { input: 'a\n1\na' },
      { input: 'b\n1\na' },
      { input: 'cars\n2\ncar ca' },
      { input: 'programmers\n3\npro gram mers' },
      { input: 'abcdef\n3\nab cd ef' },
      { input: 'aaaaaaa\n2\naaa aaaa' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    k = int(data[1])
    words = set(data[2:2+k])
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    # Store unique lengths of words to optimize inner loop
    word_lens = sorted(list(set(len(w) for w in words)))
    
    for i in range(1, n + 1):
        for l in word_lens:
            if l > i:
                break
            if dp[i - l] and s[i - l:i] in words:
                dp[i] = True
                break
                
    print("YES" if dp[n] else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Dynamic programming: dp[i] is true if prefix of length i can be segmented. Iterate over distinct dictionary word lengths.',
      timeComplexity: 'O(L * K_lens)',
      spaceComplexity: 'O(L)',
    },
  },

  // --------------------------------------------------------------------------
  // cv078: Graphs - Breadth-First Shortest Hops (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv078',
    slug: 'metro-breadth-first-shortest-hops',
    title: 'Metro Network Shortest Connection',
    difficulty: 'EASY',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A metropolitan transit system features V stations numbered 0 to V - 1 and E bidirectional tracks connecting pairs of stations. Each track represents a single hop.

Given a start station S and an end station D, determine the minimum number of hops (edges) required to travel from S to D. If station D cannot be reached from S, print -1.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Two integers u and v indicating an undirected track between u and v.\nLast line: Two integers S and D.',
    outputFormat: 'Print the minimum number of hops, or -1 if unreachable.',
    constraints: '1 <= V <= 5000\n0 <= E <= 10000\n0 <= u, v, S, D < V',
    sampleCases: [
      { input: '5 5\n0 1\n0 2\n1 3\n2 3\n3 4\n0 4', expectedOutput: '3', explanation: 'Path 0 -> 1 -> 3 -> 4 (3 hops).' },
      { input: '4 1\n0 1\n2 3', expectedOutput: '-1', explanation: 'Stations 2 and 3 are in a disconnected component.' },
    ],
    hiddenCases: [
      { input: '3 2\n0 1\n1 2\n0 0' },
      { input: '3 2\n0 1\n1 2\n0 2' },
      { input: '6 6\n0 1\n1 2\n2 3\n3 4\n4 5\n0 5\n0 3' },
      { input: '4 3\n0 1\n1 2\n2 3\n0 3' },
      { input: '5 4\n0 1\n0 2\n0 3\n0 4\n1 4' },
      { input: '1 0\n0 0' },
      { input: '6 4\n0 1\n1 2\n3 4\n4 5\n0 5' },
      { input: '7 7\n0 1\n1 2\n2 3\n3 4\n4 5\n5 6\n6 0\n1 5' },
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
    idx = 2
    adj = [[] for _ in range(v)]
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        adj[w].append(u)
        idx += 2
        
    s = int(data[idx])
    d = int(data[idx+1])
    
    if s == d:
        print(0)
        return
        
    dist = [-1] * v
    dist[s] = 0
    q = deque([s])
    
    while q:
        curr = q.popleft()
        if curr == d:
            print(dist[d])
            return
        for neighbor in adj[curr]:
            if dist[neighbor] == -1:
                dist[neighbor] = dist[curr] + 1
                q.append(neighbor)
                
    print(dist[d])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Breadth-First Search (BFS) computes the shortest path in unweighted graphs in O(V + E) time.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv079: Graphs - Depth-First Search Reachability (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv079',
    slug: 'subterranean-cave-dfs-reachability',
    title: 'Cave System Reachable Chambers',
    difficulty: 'EASY',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Speleologists explore a subterranean cave network with V chambers labeled 0 to V - 1 and E one-way passages.
A passage from chamber u to v allows travel only in that direction (directed edge u -> v).

Starting at an entrance chamber S, determine the total number of chambers (including chamber S itself) that are reachable.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Two integers u and v indicating a directed passage u -> v.\nLast line: Single integer S (start chamber).',
    outputFormat: 'Print the count of reachable chambers.',
    constraints: '1 <= V <= 5000\n0 <= E <= 10000\n0 <= u, v, S < V',
    sampleCases: [
      { input: '4 3\n0 1\n1 2\n2 3\n0', expectedOutput: '4', explanation: 'All chambers 0, 1, 2, 3 are reachable from 0.' },
      { input: '4 2\n0 1\n2 3\n0', expectedOutput: '2', explanation: 'Only chambers 0 and 1 are reachable.' },
    ],
    hiddenCases: [
      { input: '1 0\n0' },
      { input: '3 2\n1 0\n2 1\n0' },
      { input: '5 4\n0 1\n0 2\n1 3\n2 4\n0' },
      { input: '5 4\n0 1\n0 2\n1 3\n2 4\n1' },
      { input: '4 4\n0 1\n1 2\n2 0\n3 0\n0' },
      { input: '6 5\n0 1\n1 2\n2 3\n3 4\n4 5\n3' },
      { input: '4 0\n2' },
      { input: '5 6\n0 1\n1 2\n2 3\n3 0\n1 4\n4 2\n0' },
    ],
    solutionCode: `
import sys

# Increase recursion depth for deep graphs
sys.setrecursionlimit(20000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    idx = 2
    adj = [[] for _ in range(v)]
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        idx += 2
        
    s = int(data[idx])
    
    visited = [False] * v
    count = 0
    
    stack = [s]
    visited[s] = True
    while stack:
        node = stack.pop()
        count += 1
        for nxt in adj[node]:
            if not visited[nxt]:
                visited[nxt] = True
                stack.append(nxt)
                
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Iterative DFS traversal starting from S, recording all visited nodes.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv080: Graphs - Dijkstra Shortest Path (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv080',
    slug: 'dijkstra-courier-fastest-route',
    title: 'The Royal Courier Shortest Highway',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A royal courier must deliver an urgent dispatch from capital city S to fortress city D.
The kingdom has V cities numbered 0 to V - 1 and E bidirectional highways. Highway i connects cities u and v with transit travel time w.

Find the minimum total travel time required to travel from S to D. If fortress city D is unreachable from S, print -1.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Three integers u, v, w (highway endpoints and positive weight).\nLast line: Two integers S and D.',
    outputFormat: 'Print the minimum travel time or -1.',
    constraints: '1 <= V <= 5000\n0 <= E <= 20000\n1 <= w <= 100000\n0 <= u, v, S, D < V',
    sampleCases: [
      { input: '4 4\n0 1 2\n1 2 3\n0 2 6\n2 3 1\n0 3', expectedOutput: '6', explanation: 'Path 0 -> 1 -> 2 -> 3 has cost 2 + 3 + 1 = 6.' },
      { input: '3 1\n0 1 5\n0 2', expectedOutput: '-1', explanation: 'City 2 cannot be reached.' },
    ],
    hiddenCases: [
      { input: '2 1\n0 1 10\n0 0' },
      { input: '5 6\n0 1 2\n0 2 4\n1 2 1\n1 3 7\n2 4 3\n3 4 1\n0 4' },
      { input: '3 3\n0 1 1\n1 2 2\n0 2 4\n0 2' },
      { input: '4 3\n0 1 10\n1 2 20\n2 3 30\n0 3' },
      { input: '6 8\n0 1 4\n0 2 2\n1 2 1\n1 3 5\n2 3 8\n2 4 10\n3 5 6\n4 5 3\n0 5' },
      { input: '1 0\n0 0' },
      { input: '4 2\n0 1 10\n2 3 5\n1 2' },
      { input: '5 5\n0 1 1\n1 2 1\n2 3 1\n3 4 1\n0 4 10\n0 4' },
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
    idx = 2
    adj = [[] for _ in range(v)]
    for _ in range(e):
        u = int(data[idx])
        nxt = int(data[idx+1])
        w = int(data[idx+2])
        adj[u].append((nxt, w))
        adj[nxt].append((u, w))
        idx += 3
        
    s = int(data[idx])
    d = int(data[idx+1])
    
    if s == d:
        print(0)
        return
        
    dist = [float('inf')] * v
    dist[s] = 0
    pq = [(0, s)]
    
    while pq:
        d_curr, u = heapq.heappop(pq)
        if d_curr > dist[u]:
            continue
        if u == d:
            print(d_curr)
            return
            
        for nxt, weight in adj[u]:
            if dist[u] + weight < dist[nxt]:
                dist[nxt] = dist[u] + weight
                heapq.heappush(pq, (dist[nxt], nxt))
                
    ans = dist[d]
    print(ans if ans != float('inf') else -1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Dijkstra's shortest path algorithm using a min-heap priority queue.",
      timeComplexity: 'O(E log V)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv081: Graphs - Academic Prerequisite Topological Sort (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv081',
    slug: 'academic-prerequisite-topological-sort',
    title: 'Academy Syllabus Dependency Scheduler',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An academy curriculum has V courses labeled 0 to V - 1 and E prerequisite constraints.
A directed constraint u -> v means course u must be taken before course v.

Find a valid sequence in which a student can take all V courses.
If there are multiple valid sequences, choose the lexicographically smallest sequence (always pick the available course with the lowest label first).
If no valid schedule is possible due to circular dependencies, print IMPOSSIBLE.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Two integers u and v indicating prerequisite u -> v.',
    outputFormat: 'Print the space-separated course sequence, or IMPOSSIBLE.',
    constraints: '1 <= V <= 5000\n0 <= E <= 10000\n0 <= u, v < V',
    sampleCases: [
      { input: '4 4\n0 1\n0 2\n1 3\n2 3', expectedOutput: '0 1 2 3', explanation: 'Course 0 comes first, then 1, then 2, then 3.' },
      { input: '2 2\n0 1\n1 0', expectedOutput: 'IMPOSSIBLE', explanation: 'Circular prerequisite dependency.' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '3 2\n2 1\n1 0' },
      { input: '5 4\n0 1\n0 2\n0 3\n0 4' },
      { input: '3 3\n0 1\n1 2\n2 0' },
      { input: '6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1' },
      { input: '4 0' },
      { input: '5 5\n0 2\n1 2\n2 3\n2 4\n3 4' },
      { input: '4 3\n3 2\n2 1\n1 0' },
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
    idx = 2
    adj = [[] for _ in range(v)]
    in_degree = [0] * v
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        in_degree[w] += 1
        idx += 2
        
    pq = [i for i in range(v) if in_degree[i] == 0]
    heapq.heapify(pq)
    
    order = []
    while pq:
        curr = heapq.heappop(pq)
        order.append(curr)
        for nxt in adj[curr]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0:
                heapq.heappush(pq, nxt)
                
    if len(order) == v:
        print(' '.join(map(str, order)))
    else:
        print("IMPOSSIBLE")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Kahn's algorithm using a min-heap to guarantee the lexicographically earliest topological ordering and detect cycles.",
      timeComplexity: 'O(V log V + E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv082: Graphs - Archipelago Component Counter (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv082',
    slug: 'archipelago-network-component-counter',
    title: 'Disjoint Clan Cluster Counter',
    difficulty: 'EASY',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An isolated valley is populated by V settlements numbered 1 to V. There are E bidirectional trade routes connecting certain pairs of settlements.

Two settlements belong to the same cluster if there exists a route (direct or through other settlements) connecting them.

Determine the total number of disconnected settlement clusters (connected components) in the valley.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Two integers u and v indicating a bidirectional trade route between settlement u and v.',
    outputFormat: 'Print the total number of connected components.',
    constraints: '1 <= V <= 5000\n0 <= E <= 10000\n1 <= u, v <= V',
    sampleCases: [
      { input: '5 3\n1 2\n2 3\n4 5', expectedOutput: '2', explanation: 'Cluster 1: {1, 2, 3}. Cluster 2: {4, 5}.' },
      { input: '4 0', expectedOutput: '4', explanation: 'No routes; each settlement is its own cluster.' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '3 3\n1 2\n2 3\n1 3' },
      { input: '6 4\n1 2\n2 3\n4 5\n5 6' },
      { input: '5 4\n1 2\n1 3\n1 4\n1 5' },
      { input: '7 5\n1 2\n2 3\n3 1\n4 5\n6 7' },
      { input: '6 2\n1 2\n3 4' },
      { input: '8 6\n1 2\n2 3\n3 4\n5 6\n6 7\n7 8' },
      { input: '10 5\n1 2\n3 4\n5 6\n7 8\n9 10' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    idx = 2
    adj = [[] for _ in range(v + 1)]
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        adj[w].append(u)
        idx += 2
        
    visited = [False] * (v + 1)
    components = 0
    
    for i in range(1, v + 1):
        if not visited[i]:
            components += 1
            visited[i] = True
            stack = [i]
            while stack:
                node = stack.pop()
                for neighbor in adj[node]:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        stack.append(neighbor)
                        
    print(components)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Breadth-First or Depth-First Search over all unvisited vertices to count connected components.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv083: Graphs - Bipartite Realm Alliance Split (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv083',
    slug: 'bipartite-realm-alliance-split',
    title: 'The Two-Guild Peace Partition',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A grand council seeks to divide V envoys numbered 0 to V - 1 into two separate peace committees (Guild A and Guild B).
There are E rivalry constraints: envoys u and v have historical disputes and cannot be placed in the same committee.

Determine whether it is possible to partition all V envoys into two groups such that no two rival envoys end up in the same committee.

Print YES if such a partition is possible, otherwise print NO.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Two integers u and v indicating a rivalry between envoy u and v.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= V <= 5000\n0 <= E <= 10000\n0 <= u, v < V',
    sampleCases: [
      { input: '4 4\n0 1\n1 2\n2 3\n3 0', expectedOutput: 'YES', explanation: 'Even cycle of 4 vertices is 2-colorable (bipartite).' },
      { input: '3 3\n0 1\n1 2\n2 0', expectedOutput: 'NO', explanation: 'Odd cycle of 3 vertices is not 2-colorable.' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '2 1\n0 1' },
      { input: '5 5\n0 1\n1 2\n2 3\n3 4\n4 0' },
      { input: '6 6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 0' },
      { input: '4 5\n0 1\n1 2\n2 3\n3 0\n0 2' },
      { input: '6 4\n0 1\n2 3\n4 5\n1 2' },
      { input: '5 4\n0 1\n0 2\n0 3\n0 4' },
      { input: '7 6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 6' },
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
    idx = 2
    adj = [[] for _ in range(v)]
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        adj[w].append(u)
        idx += 2
        
    color = [-1] * v
    
    for i in range(v):
        if color[i] == -1:
            color[i] = 0
            q = deque([i])
            while q:
                u = q.popleft()
                for neighbor in adj[u]:
                    if color[neighbor] == -1:
                        color[neighbor] = 1 - color[u]
                        q.append(neighbor)
                    elif color[neighbor] == color[u]:
                        print("NO")
                        return
                        
    print("YES")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Two-coloring algorithm using BFS. A graph is bipartite if and only if it contains no odd-length cycle.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv084: Graphs - Directed Cycle Detector (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv084',
    slug: 'directed-dependency-cycle-detector',
    title: 'The Circular Dependency Investigator',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A software build system compiles V modules numbered 0 to V - 1 with E compilation dependencies.
A dependency u -> v means module u requires module v.

Determine whether there exists any circular dependency chain in the project (i.e., a directed cycle).
Print YES if a cycle exists, otherwise print NO.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Two integers u and v indicating a directed edge u -> v.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= V <= 5000\n0 <= E <= 10000\n0 <= u, v < V',
    sampleCases: [
      { input: '3 3\n0 1\n1 2\n2 0', expectedOutput: 'YES', explanation: 'Cycle: 0 -> 1 -> 2 -> 0.' },
      { input: '3 2\n0 1\n1 2', expectedOutput: 'NO', explanation: 'Linear dependency chain, no cycle.' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '2 1\n0 1' },
      { input: '2 2\n0 1\n1 0' },
      { input: '4 4\n0 1\n1 2\n2 3\n3 1' },
      { input: '5 4\n0 1\n0 2\n1 3\n2 4' },
      { input: '4 4\n0 1\n0 2\n1 3\n2 3' },
      { input: '5 5\n0 1\n1 2\n2 3\n3 4\n4 2' },
      { input: '6 5\n0 1\n1 2\n2 3\n3 4\n4 5' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    idx = 2
    adj = [[] for _ in range(v)]
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        idx += 2
        
    # State: 0 = unvisited, 1 = visiting, 2 = visited
    state = [0] * v
    
    def has_cycle():
        for start in range(v):
            if state[start] != 0:
                continue
            stack = [(start, 0)]
            while stack:
                node, edge_idx = stack.pop()
                if edge_idx == 0:
                    state[node] = 1
                
                advanced = False
                for i in range(edge_idx, len(adj[node])):
                    neighbor = adj[node][i]
                    if state[neighbor] == 1:
                        return True
                    if state[neighbor] == 0:
                        stack.append((node, i + 1))
                        stack.append((neighbor, 0))
                        advanced = True
                        break
                        
                if not advanced:
                    state[node] = 2
        return False
        
    print("YES" if has_cycle() else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: '3-color DFS state traversal (White, Gray, Black) using an explicit stack to detect back-edges in directed graphs.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv085: Graphs - Undirected Bridge Cycle Detector (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv085',
    slug: 'undirected-bridge-cycle-detector',
    title: 'The Stone Bridge Loop Detector',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An architectural engineer surveys V stone pillars numbered 0 to V - 1 connected by E bidirectional bridge spans.

Determine whether the structure contains any closed topological loop (undirected cycle).
Print YES if at least one loop exists, otherwise print NO.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Two integers u and v indicating an undirected bridge between u and v.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= V <= 5000\n0 <= E <= 10000\n0 <= u, v < V',
    sampleCases: [
      { input: '3 3\n0 1\n1 2\n2 0', expectedOutput: 'YES', explanation: 'Triangle loop formed by pillars 0, 1, 2.' },
      { input: '3 2\n0 1\n1 2', expectedOutput: 'NO', explanation: 'Simple tree line, no loops.' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '2 1\n0 1' },
      { input: '4 4\n0 1\n1 2\n2 3\n3 0' },
      { input: '5 4\n0 1\n1 2\n2 3\n3 4' },
      { input: '4 3\n0 1\n0 2\n0 3' },
      { input: '5 5\n0 1\n1 2\n2 0\n3 4\n4 3' },
      { input: '6 5\n0 1\n1 2\n3 4\n4 5\n5 3' },
      { input: '6 4\n0 1\n1 2\n3 4\n4 5' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    idx = 2
    
    parent = list(range(v))
    def find(i):
        path = []
        while parent[i] != i:
            path.append(i)
            i = parent[i]
        for node in path:
            parent[node] = i
        return i
        
    has_cycle = False
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        idx += 2
        
        root_u = find(u)
        root_w = find(w)
        if root_u == root_w:
            has_cycle = True
        else:
            parent[root_u] = root_w
            
    print("YES" if has_cycle else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Disjoint Set Union (Union-Find) with path compression: adding an edge between two vertices already in the same connected component creates an undirected cycle.',
      timeComplexity: 'O(E * alpha(V))',
      spaceComplexity: 'O(V)',
    },
  },

  // --------------------------------------------------------------------------
  // cv086: Graphs - High-Voltage Kruskal MST (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv086',
    slug: 'high-voltage-power-grid-kruskal-mst',
    title: 'The High-Voltage Grid Electrification',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A regional energy board plans to link V power sub-stations numbered 0 to V - 1.
There are E proposed high-voltage transmission lines. Line i links sub-stations u and v with installation cost w.

Find the minimum total cost to install transmission lines such that all V sub-stations are interconnected in a single connected grid.
If it is impossible to interconnect all stations, print -1.`,
    inputFormat: 'First line: Two integers V and E.\nNext E lines: Three integers u, v, w (line endpoints and integer cost).',
    outputFormat: 'Print the minimum total cost, or -1.',
    constraints: '1 <= V <= 5000\n0 <= E <= 20000\n1 <= w <= 100000\n0 <= u, v < V',
    sampleCases: [
      { input: '4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4', expectedOutput: '19', explanation: 'Selected edges: (2,3: 4), (0,3: 5), (0,1: 10) -> total cost 19.' },
      { input: '3 1\n0 1 5', expectedOutput: '-1', explanation: 'Sub-station 2 cannot be connected.' },
    ],
    hiddenCases: [
      { input: '1 0' },
      { input: '2 1\n0 1 42' },
      { input: '3 3\n0 1 1\n1 2 2\n0 2 3' },
      { input: '5 7\n0 1 1\n0 2 7\n1 2 5\n1 3 4\n1 4 3\n2 4 6\n3 4 2' },
      { input: '4 2\n0 1 1\n2 3 2' },
      { input: '6 9\n0 1 3\n0 3 1\n1 2 1\n1 3 3\n2 3 1\n2 4 5\n2 5 4\n3 4 6\n4 5 2' },
      { input: '4 6\n0 1 1\n1 2 2\n2 3 3\n3 0 4\n0 2 5\n1 3 6' },
      { input: '5 4\n0 1 10\n1 2 20\n2 3 30\n3 4 40' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    idx = 2
    
    if v == 1:
        print(0)
        return
        
    edges = []
    for _ in range(e):
        u = int(data[idx])
        w_node = int(data[idx+1])
        weight = int(data[idx+2])
        edges.append((weight, u, w_node))
        idx += 3
        
    edges.sort()
    
    parent = list(range(v))
    def find(i):
        path = []
        while parent[i] != i:
            path.append(i)
            i = parent[i]
        for node in path:
            parent[node] = i
        return i
        
    total_cost = 0
    edges_count = 0
    
    for weight, u, w_node in edges:
        root_u = find(u)
        root_w = find(w_node)
        if root_u != root_w:
            parent[root_u] = root_w
            total_cost += weight
            edges_count += 1
            if edges_count == v - 1:
                break
                
    if edges_count == v - 1:
        print(total_cost)
    else:
        print(-1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Kruskal's algorithm with Disjoint Set Union (DSU) to find Minimum Spanning Tree cost.",
      timeComplexity: 'O(E log E)',
      spaceComplexity: 'O(V + E)',
    },
  },

  // --------------------------------------------------------------------------
  // cv087: Graphs - Telecom Tree Diameter (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv087',
    slug: 'telecom-network-tree-diameter',
    title: 'The Telecom Backbone Diameter',
    difficulty: 'HARD',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A national telecommunications provider deploys an unweighted tree network connecting V relay hubs numbered 1 to V via exactly V - 1 bidirectional fiber optic links.

The latency between any two hubs is directly proportional to the number of link hops between them.
The network diameter is defined as the maximum hop distance between any pair of hubs in the network.

Calculate the diameter of the tree network.`,
    inputFormat: 'First line: Integer V.\nNext V - 1 lines: Two integers u and v indicating a fiber optic link between hubs u and v.',
    outputFormat: 'Print the diameter of the tree.',
    constraints: '1 <= V <= 50000\n1 <= u, v <= V',
    sampleCases: [
      { input: '5\n1 2\n1 3\n2 4\n2 5', expectedOutput: '3', explanation: 'Longest path is between hub 4 (or 5) and hub 3: 4 -> 2 -> 1 -> 3 (3 hops).' },
      { input: '3\n1 2\n2 3', expectedOutput: '2', explanation: 'Path 1 -> 2 -> 3 has length 2.' },
    ],
    hiddenCases: [
      { input: '1' },
      { input: '2\n1 2' },
      { input: '4\n1 2\n1 3\n1 4' },
      { input: '6\n1 2\n2 3\n3 4\n4 5\n5 6' },
      { input: '7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7' },
      { input: '5\n1 2\n2 3\n3 4\n4 5' },
      { input: '8\n1 2\n2 3\n3 4\n4 5\n5 6\n6 7\n7 8' },
      { input: '6\n1 2\n2 3\n2 4\n4 5\n5 6' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    if v <= 1:
        print(0)
        return
        
    adj = [[] for _ in range(v + 1)]
    idx = 1
    for _ in range(v - 1):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        adj[w].append(u)
        idx += 2
        
    def bfs_farthest(start):
        dist = [-1] * (v + 1)
        dist[start] = 0
        q = deque([start])
        farthest_node = start
        max_dist = 0
        
        while q:
            curr = q.popleft()
            curr_dist = dist[curr]
            if curr_dist > max_dist:
                max_dist = curr_dist
                farthest_node = curr
            for neighbor in adj[curr]:
                if dist[neighbor] == -1:
                    dist[neighbor] = curr_dist + 1
                    q.append(neighbor)
                    
        return farthest_node, max_dist
        
    # First BFS from arbitrary node 1 to find one end of diameter
    node_a, _ = bfs_farthest(1)
    # Second BFS from node_a to find true diameter
    _, diameter = bfs_farthest(node_a)
    
    print(diameter)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Two BFS passes: BFS from an arbitrary vertex finds one peripheral vertex of the diameter; a second BFS from that vertex finds the furthest vertex and maximum tree distance.',
      timeComplexity: 'O(V)',
      spaceComplexity: 'O(V)',
    },
  },

  // --------------------------------------------------------------------------
  // cv088: Graphs - Royal Lineage Lowest Common Ancestor (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv088',
    slug: 'royal-lineage-lowest-common-ancestor',
    title: 'Genealogy Lowest Common Ancestor',
    difficulty: 'MEDIUM',
    topics: ['Graphs & Trees'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An imperial genealogist records the dynasty tree of V members numbered 1 to V, rooted at the Founding Emperor (node 1).
The family tree has V - 1 parent-child relationships where p is the direct parent of c.

Given two family members U and V, determine their Lowest Common Ancestor (LCA) — the lowest (deepest) ancestor in the tree that has both U and V as descendants (where a member can be a descendant of itself).`,
    inputFormat: 'First line: Integer V.\nNext V - 1 lines: Two integers p and c indicating that p is parent of c.\nLast line: Two integers U and V.',
    outputFormat: 'Print the label of the Lowest Common Ancestor.',
    constraints: '1 <= V <= 50000\n1 <= p, c, U, V <= V',
    sampleCases: [
      { input: '5\n1 2\n1 3\n2 4\n2 5\n4 5', expectedOutput: '2', explanation: 'Common ancestor of 4 and 5 is 2.' },
      { input: '5\n1 2\n1 3\n2 4\n2 5\n4 3', expectedOutput: '1', explanation: 'Common ancestor of 4 and 3 is the root 1.' },
    ],
    hiddenCases: [
      { input: '1\n1 1' },
      { input: '3\n1 2\n2 3\n2 3' },
      { input: '4\n1 2\n1 3\n1 4\n3 4' },
      { input: '6\n1 2\n2 3\n3 4\n4 5\n5 6\n1 6' },
      { input: '7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7\n4 7' },
      { input: '5\n1 2\n2 3\n3 4\n4 5\n3 5' },
      { input: '6\n1 2\n2 4\n1 3\n3 5\n5 6\n4 6' },
      { input: '5\n1 2\n1 3\n3 4\n4 5\n2 2' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    if v == 1:
        print(1)
        return
        
    parent = [0] * (v + 1)
    depth = [0] * (v + 1)
    adj = [[] for _ in range(v + 1)]
    
    idx = 1
    for _ in range(v - 1):
        p = int(data[idx])
        c = int(data[idx+1])
        parent[c] = p
        adj[p].append(c)
        idx += 2
        
    u = int(data[idx])
    w = int(data[idx+1])
    
    # Compute depth using BFS/DFS
    stack = [1]
    depth[1] = 0
    while stack:
        curr = stack.pop()
        for child in adj[curr]:
            depth[child] = depth[curr] + 1
            stack.append(child)
            
    # Ascend to same depth
    while depth[u] > depth[w]:
        u = parent[u]
    while depth[w] > depth[u]:
        w = parent[w]
        
    # Ascend together
    while u != w:
        u = parent[u]
        w = parent[w]
        
    print(u)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Depth-equalization LCA ascent in tree of depth D.',
      timeComplexity: 'O(V)',
      spaceComplexity: 'O(V)',
    },
  },
];

console.log(`Writing Batch 4 (${problems.length} problems)...`);
problems.forEach((p) => {
  console.log(`Generating: ${p.id}`);
  createProblem(p);
});
console.log('✅ Batch 4 written successfully!');
