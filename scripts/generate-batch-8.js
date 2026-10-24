const { createProblem } = require('./problem-helper');

const problems = [
  // --------------------------------------------------------------------------
  // cv155: Recursion - K-Sum Combinations Target (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv155',
    slug: 'k-sum-combinations-target',
    title: 'The Vault Pin K-Digit Combination',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Find all valid combinations of K numbers that sum up to target N such that only numbers from 1 to 9 are used and each combination uses each number at most once.

Print each combination on a new line with space-separated numbers in ascending order.
Combinations should be listed in lexicographical order. If no combination exists, print NONE.`,
    inputFormat: 'Two integers K and N.',
    outputFormat: 'Print each valid combination, or NONE.',
    constraints: '2 <= K <= 9\n1 <= N <= 60',
    sampleCases: [
      { input: '3 7', expectedOutput: '1 2 4', explanation: '1 + 2 + 4 = 7.' },
      { input: '3 9', expectedOutput: '1 2 6\n1 3 5\n2 3 4', explanation: 'Three combinations.' },
    ],
    hiddenCases: [
      { input: '4 1' },
      { input: '3 2' },
      { input: '9 45' },
      { input: '2 18' },
      { input: '2 17' },
      { input: '4 24' },
      { input: '5 15' },
      { input: '3 15' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    k = int(data[0])
    n = int(data[1])
    
    results = []
    
    def backtrack(start, curr_k, curr_sum, path):
        if curr_k == k:
            if curr_sum == n:
                results.append(path[:])
            return
        if curr_sum >= n:
            return
            
        for num in range(start, 10):
            if curr_sum + num > n:
                break
            path.append(num)
            backtrack(num + 1, curr_k + 1, curr_sum + num, path)
            path.pop()
            
    backtrack(1, 0, 0, [])
    
    if results:
        for r in results:
            print(' '.join(map(str, r)))
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Backtracking combination search over digits 1 to 9 with pruning on cumulative sum.',
      timeComplexity: 'O(C(9, K))',
      spaceComplexity: 'O(K)',
    },
  },

  // --------------------------------------------------------------------------
  // cv156: Backtracking - Word Search Path Grid (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv156',
    slug: 'word-search-path-grid',
    title: 'The Cartographic Runestone Word Finder',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an N x M grid of characters and a search word W, determine if W exists in the grid.
The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once in the word.

Print YES if the word exists, otherwise print NO.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated uppercase characters.\nLast line: String W.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= N, M <= 6\n1 <= len(W) <= 15',
    sampleCases: [
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED', expectedOutput: 'YES', explanation: 'Path: (0,0)->(0,1)->(0,2)->(1,2)->(2,2)->(2,1).' },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nSEE', expectedOutput: 'YES', explanation: 'Path: (1,3)->(2,3)->(2,2).' },
    ],
    hiddenCases: [
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCB' },
      { input: '1 1\nA\nA' },
      { input: '1 1\nA\nB' },
      { input: '2 2\nA B\nC D\nACDB' },
      { input: '2 2\nA B\nC D\nABCD' },
      { input: '3 3\nA B C\nD E F\nG H I\nABCFIHGDE' },
      { input: '4 4\nT C S C\nO D E V\nI T A H\nU B P R\nCODEVITA' },
      { input: '3 3\nA A A\nA A A\nA A A\nAAAAAAAAA' },
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
        grid.append(data[idx:idx+m])
        idx += m
    word = data[idx]
    
    def dfs(r, c, k):
        if k == len(word):
            return True
        if r < 0 or r >= n or c < 0 or c >= m or grid[r][c] != word[k]:
            return False
            
        temp = grid[r][c]
        grid[r][c] = '#'
        
        found = (dfs(r + 1, c, k + 1) or
                 dfs(r - 1, c, k + 1) or
                 dfs(r, c + 1, k + 1) or
                 dfs(r, c - 1, k + 1))
                 
        grid[r][c] = temp
        return found
        
    for r in range(n):
        for c in range(m):
            if dfs(r, c, 0):
                print("YES")
                return
                
    print("NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'DFS backtracking with in-place cell marking to prevent visiting cells multiple times.',
      timeComplexity: 'O(N * M * 4^len(W))',
      spaceComplexity: 'O(len(W))',
    },
  },

  // --------------------------------------------------------------------------
  // cv157: Recursion - Letter Case Permutation (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv157',
    slug: 'letter-case-permutation-generator',
    title: 'The Dual Case Orthography Permutations',
    difficulty: 'EASY',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a string S, transform every letter individually to be lowercase or uppercase to create another string.
Digits remain unchanged.

Return all possible case permutations sorted in lexicographical order, each on a new line.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print each permutation on a new line in sorted order.',
    constraints: '1 <= len(S) <= 12',
    sampleCases: [
      { input: 'a1b2', expectedOutput: 'A1B2\nA1b2\na1B2\na1b2', explanation: 'All 4 permutations in sorted order.' },
      { input: '3z4', expectedOutput: '3Z4\n3z4', explanation: 'Two permutations.' },
    ],
    hiddenCases: [
      { input: '123' },
      { input: 'a' },
      { input: 'ab' },
      { input: 'C' },
      { input: '0a1b' },
      { input: 'abc' },
      { input: '1a2b3c' },
      { input: 'xyz' },
    ],
    solutionCode: `
import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    res = []
    
    def backtrack(idx, curr):
        if idx == len(s):
            res.append(''.join(curr))
            return
        c = s[idx]
        if c.isalpha():
            curr.append(c.lower())
            backtrack(idx + 1, curr)
            curr.pop()
            
            curr.append(c.upper())
            backtrack(idx + 1, curr)
            curr.pop()
        else:
            curr.append(c)
            backtrack(idx + 1, curr)
            curr.pop()
            
    backtrack(0, [])
    res.sort()
    for item in res:
        print(item)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Binary decision tree backtracking branching on each alphabetic character.',
      timeComplexity: 'O(2^letters * N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv158: Backtracking - Subsets with Duplicates (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv158',
    slug: 'subsets-with-duplicates',
    title: 'The Duplicate Jewel Unique Power Sets',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an integer array nums that may contain duplicate elements, return all possible unique subsets (the power set).
The solution set must not contain duplicate subsets.
Sort each individual subset in non-decreasing order, and print subsets sorted in standard lexicographical order.
Print an empty subset as an empty line or "EMPTY".`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print each unique subset on a new line (use EMPTY for the empty set).',
    constraints: '1 <= N <= 10\n-10 <= nums[i] <= 10',
    sampleCases: [
      { input: '3\n1 2 2', expectedOutput: 'EMPTY\n1\n1 2\n1 2 2\n2\n2 2', explanation: 'Unique subsets of [1, 2, 2].' },
      { input: '1\n0', expectedOutput: 'EMPTY\n0', explanation: 'Two subsets.' },
    ],
    hiddenCases: [
      { input: '2\n1 1' },
      { input: '3\n4 4 4' },
      { input: '4\n1 2 3 4' },
      { input: '4\n1 2 2 3' },
      { input: '3\n-1 0 1' },
      { input: '4\n0 0 0 0' },
      { input: '3\n2 1 2' },
      { input: '5\n1 2 2 3 3' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = sorted([int(x) for x in data[1:1+n]])
    
    subsets = []
    
    def backtrack(start, path):
        subsets.append(path[:])
        for i in range(start, n):
            if i > start and nums[i] == nums[i - 1]:
                continue
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
            
    backtrack(0, [])
    
    subsets.sort()
    for s in subsets:
        if len(s) == 0:
            print("EMPTY")
        else:
            print(' '.join(map(str, s)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort array first, then skip duplicates at the same recursion depth (if i > start and nums[i] == nums[i-1]).',
      timeComplexity: 'O(2^N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv159: Recursion - Gray Code Sequence Generator (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv159',
    slug: 'gray-code-sequence-generator',
    title: 'The Reflected Binary Gray Code Ring',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An N-bit Gray code is a sequence of 2^N integers where:
- The first integer is 0.
- Every consecutive pair of integers in the sequence differs by exactly one bit in their binary representation.
- The first and last integers also differ by exactly one bit.

Given an integer N, generate and print the 2^N integers in the reflected Gray code sequence separated by spaces.`,
    inputFormat: 'A single positive integer N.',
    outputFormat: 'Print the space-separated sequence of 2^N integers.',
    constraints: '1 <= N <= 16',
    sampleCases: [
      { input: '2', expectedOutput: '0 1 3 2', explanation: 'Binary: 00, 01, 11, 10.' },
      { input: '1', expectedOutput: '0 1', explanation: 'Binary: 0, 1.' },
    ],
    hiddenCases: [
      { input: '3' },
      { input: '4' },
      { input: '5' },
      { input: '6' },
      { input: '7' },
      { input: '8' },
      { input: '9' },
      { input: '10' },
    ],
    solutionCode: `
import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    
    # Formula for i-th gray code: i ^ (i >> 1)
    total = 1 << n
    res = [i ^ (i >> 1) for i in range(total)]
    print(' '.join(map(str, res)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Reflected Gray Code direct closed form: G(i) = i ^ (i >> 1).',
      timeComplexity: 'O(2^N)',
      spaceComplexity: 'O(2^N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv160: Recursion - Restore Valid IP Addresses (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv160',
    slug: 'restore-valid-ip-addresses',
    title: 'The Legacy Packet IP Address Restorer',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a string S containing only digits, restore all possible valid IPv4 address combinations.
A valid IPv4 address consists of exactly 4 integers separated by single dots, each integer between 0 and 255 with no leading zeros (e.g. "0.1.2.201" is valid, but "0.01.2.201" and "256.1.1.1" are invalid).

Print all valid restored IP addresses in lexicographical order, each on a new line. If no valid address exists, print NONE.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print each valid IP address on a new line, or NONE.',
    constraints: '1 <= len(S) <= 20',
    sampleCases: [
      { input: '25525511135', expectedOutput: '255.255.11.135\n255.255.111.35', explanation: 'Two valid IP configurations.' },
      { input: '0000', expectedOutput: '0.0.0.0', explanation: 'Single valid zero configuration.' },
    ],
    hiddenCases: [
      { input: '101023' },
      { input: '1111' },
      { input: '010010' },
      { input: '256256256256' },
      { input: '19216811' },
      { input: '123' },
      { input: '1234567890123' },
      { input: '172162541' },
    ],
    solutionCode: `
import sys

def solve():
    s = sys.stdin.read().strip()
    if not s or len(s) < 4 or len(s) > 12:
        print("NONE")
        return
        
    res = []
    
    def backtrack(idx, parts):
        if len(parts) == 4:
            if idx == len(s):
                res.append('.'.join(parts))
            return
            
        for l in range(1, 4):
            if idx + l <= len(s):
                part = s[idx:idx+l]
                if (len(part) == 1 or part[0] != '0') and 0 <= int(part) <= 255:
                    parts.append(part)
                    backtrack(idx + l, parts)
                    parts.pop()
                    
    backtrack(0, [])
    
    if res:
        res.sort()
        for ip in res:
            print(ip)
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Backtracking 4 octet partitions of length 1 to 3 with leading zero and <= 255 validation checks.',
      timeComplexity: 'O(3^4) = O(1)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv161: Backtracking - Knight Tour Feasibility (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv161',
    slug: 'knight-tour-chessboard-moves',
    title: 'The Legendary Knight Tour of the Realm',
    difficulty: 'HARD',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A knight begins at coordinate (R, C) on an N x N chessboard.
Determine whether there exists an open Knight's Tour starting at (R, C) that visits every square on the board exactly once.

Print YES if a complete tour exists, otherwise print NO.`,
    inputFormat: 'Three integers N, R, and C (board size N, 0-based start row R, and start col C).',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= N <= 8\n0 <= R, C < N',
    sampleCases: [
      { input: '1 0 0', expectedOutput: 'YES', explanation: '1x1 board is trivially completed in 1 move.' },
      { input: '3 0 0', expectedOutput: 'NO', explanation: 'Knight cannot complete tour on 3x3 board.' },
    ],
    hiddenCases: [
      { input: '2 0 0' },
      { input: '4 0 0' },
      { input: '5 0 0' },
      { input: '5 2 2' },
      { input: '6 0 0' },
      { input: '6 3 3' },
      { input: '8 0 0' },
      { input: '3 1 1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    start_r = int(data[1])
    start_c = int(data[2])
    
    if n == 1:
        print("YES")
        return
    if n <= 4:
        print("NO")
        return
        
    # Warnsdorff's heuristic for knight's tour
    moves = [(-2,-1), (-2,1), (-1,-2), (-1,2), (1,-2), (1,2), (2,-1), (2,1)]
    visited = [[False] * n for _ in range(n)]
    
    def count_onward_moves(r, c):
        count = 0
        for dr, dc in moves:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                count += 1
        return count
        
    curr_r, curr_c = start_r, start_c
    visited[curr_r][curr_c] = True
    
    for step in range(1, n * n):
        candidates = []
        for dr, dc in moves:
            nr, nc = curr_r + dr, curr_c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                deg = count_onward_moves(nr, nc)
                candidates.append((deg, nr, nc))
                
        if not candidates:
            print("NO")
            return
            
        candidates.sort(key=lambda x: x[0])
        _, next_r, next_c = candidates[0]
        visited[next_r][next_c] = True
        curr_r, curr_c = next_r, next_c
        
    print("YES")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Warnsdorff's heuristic: always step to the neighbor square with the minimal number of onward unvisited moves.",
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv162: Backtracking - Combination Sum Unlimited (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv162',
    slug: 'combination-sum-unlimited-elements',
    title: 'The Perpetual Alchemical Crucible Sum',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an array of distinct integers Candidates and a target integer T, return a list of all unique combinations of Candidates where the chosen numbers sum to T.
You may return the combinations in any order, but each individual combination must be sorted in non-decreasing order.
The same number may be chosen from Candidates an unlimited number of times.

Print each combination on a new line. If no combination exists, print NONE.`,
    inputFormat: 'First line: Two integers N and T.\nSecond line: N space-separated distinct integers.',
    outputFormat: 'Print each combination, or NONE.',
    constraints: '1 <= N <= 30\n1 <= Candidates[i] <= 200\n1 <= T <= 500',
    sampleCases: [
      { input: '4 7\n2 3 6 7', expectedOutput: '2 2 3\n7', explanation: '2+2+3 = 7, and 7 = 7.' },
      { input: '3 8\n2 3 5', expectedOutput: '2 2 2 2\n2 3 3\n3 5', explanation: 'Three combinations.' },
    ],
    hiddenCases: [
      { input: '1 2\n3' },
      { input: '2 1\n1 2' },
      { input: '3 5\n1 2 5' },
      { input: '4 10\n2 4 6 8' },
      { input: '3 11\n3 5 7' },
      { input: '2 4\n2 3' },
      { input: '5 9\n2 3 4 5 7' },
      { input: '3 12\n4 6 8' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    candidates = sorted([int(x) for x in data[2:2+n]])
    
    results = []
    
    def backtrack(start, remain, path):
        if remain == 0:
            results.append(path[:])
            return
        for i in range(start, n):
            c = candidates[i]
            if c > remain:
                break
            path.append(c)
            backtrack(i, remain - c, path) # Allow reuse of candidate i
            path.pop()
            
    backtrack(0, target, [])
    
    if results:
        results.sort()
        for r in results:
            print(' '.join(map(str, r)))
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Backtracking with unlimited item reuse by keeping current index i eligible in recursive calls.',
      timeComplexity: 'O(N^(T/min_val))',
      spaceComplexity: 'O(T/min_val)',
    },
  },

  // --------------------------------------------------------------------------
  // cv163: Backtracking - Expression Add Operators (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv163',
    slug: 'expression-add-operators-target',
    title: 'The Rune Equation Operator Insertion',
    difficulty: 'HARD',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given a string num that contains only digits and an integer target, return all possibilities to insert the binary operators '+', '-', and/or '*' between the digits of num so that the resultant expression evaluates to the target value.
Operands cannot have leading zeros (e.g. "1 + 05" is invalid).

Print all valid expressions in lexicographical order, each on a new line. If none exist, print NONE.`,
    inputFormat: 'First line: String num.\nSecond line: Integer target.',
    outputFormat: 'Print each valid expression on a new line, or NONE.',
    constraints: '1 <= len(num) <= 10\n-2^31 <= target <= 2^31 - 1',
    sampleCases: [
      { input: '123\n6', expectedOutput: '1*2*3\n1+2+3', explanation: 'Both 1*2*3 and 1+2+3 evaluate to 6.' },
      { input: '232\n8', expectedOutput: '2*3+2\n2+3*2', explanation: 'Evaluates to 8.' },
    ],
    hiddenCases: [
      { input: '105\n5' },
      { input: '00\n0' },
      { input: '3456237490\n9191' },
      { input: '12\n12' },
      { input: '12\n3' },
      { input: '100\n100' },
      { input: '1234\n24' },
      { input: '999\n0' },
    ],
    solutionCode: `
import sys

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    num = lines[0]
    target = int(lines[1])
    
    res = []
    n = len(num)
    
    def backtrack(idx, expr, curr_val, last_op):
        if idx == n:
            if curr_val == target:
                res.append(expr)
            return
            
        for i in range(idx, n):
            if i > idx and num[idx] == '0':
                break
            part = num[idx:i+1]
            val = int(part)
            if idx == 0:
                backtrack(i + 1, part, val, val)
            else:
                backtrack(i + 1, expr + '+' + part, curr_val + val, val)
                backtrack(i + 1, expr + '-' + part, curr_val - val, -val)
                backtrack(i + 1, expr + '*' + part, curr_val - last_op + last_op * val, last_op * val)
                
    backtrack(0, "", 0, 0)
    
    if res:
        res.sort()
        for e in res:
            print(e)
    else:
        print("NONE")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Backtracking with multiplication precedence handling by tracking last_operand and adjusting (curr_val - last_op + last_op * val).',
      timeComplexity: 'O(4^N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv164: Recursion - Unique Binary Search Trees (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv164',
    slug: 'generate-unique-binary-search-trees',
    title: 'The Sacred Binary Search Tree Enumeration',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an integer N, return the number of structurally unique Binary Search Trees (BSTs) which have exactly N nodes of unique values from 1 to N.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the count of unique BSTs.',
    constraints: '1 <= N <= 19',
    sampleCases: [
      { input: '3', expectedOutput: '5', explanation: 'Catalan number C_3 = 5.' },
      { input: '1', expectedOutput: '1', explanation: 'Only 1 tree.' },
    ],
    hiddenCases: [
      { input: '2' },
      { input: '4' },
      { input: '5' },
      { input: '6' },
      { input: '7' },
      { input: '10' },
      { input: '15' },
      { input: '19' },
    ],
    solutionCode: `
import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1
    
    for i in range(2, n + 1):
        for j in range(1, i + 1):
            dp[i] += dp[j - 1] * dp[i - j]
            
    print(dp[n])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Catalan recurrence: dp[i] = sum(dp[j - 1] * dp[i - j]) for j in 1..i.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv165: Backtracking - Partition to K Equal Sum Subsets (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv165',
    slug: 'partition-to-k-equal-sum-subsets',
    title: 'The K-Partition Treasury Equilibrium',
    difficulty: 'HARD',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an integer array nums and an integer K, return YES if it is possible to divide this array into K non-empty subsets whose sums are all equal. Otherwise, return NO.`,
    inputFormat: 'First line: Two integers N and K.\nSecond line: N space-separated integers.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= K <= N <= 16\n1 <= nums[i] <= 10000',
    sampleCases: [
      { input: '7 4\n4 3 2 3 5 2 1', expectedOutput: 'YES', explanation: 'Can be divided into 4 subsets with equal sum 5: [5], [1, 4], [2, 3], [2, 3].' },
      { input: '4 3\n1 2 3 4', expectedOutput: 'NO', explanation: 'Total sum is 10, not divisible by 3.' },
    ],
    hiddenCases: [
      { input: '1 1\n5' },
      { input: '4 4\n2 2 2 2' },
      { input: '5 2\n1 1 1 1 2' },
      { input: '6 3\n2 2 2 2 2 2' },
      { input: '6 2\n10 10 10 7 7 6' },
      { input: '5 3\n2 2 2 2 3' },
      { input: '8 4\n1 1 1 1 2 2 2 2' },
      { input: '6 3\n4 4 4 4 4 4' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    nums = sorted([int(x) for x in data[2:2+n]], reverse=True)
    
    total = sum(nums)
    if total % k != 0 or nums[0] > total // k:
        print("NO")
        return
        
    target = total // k
    subset_sums = [0] * k
    
    def backtrack(idx):
        if idx == n:
            return True
        val = nums[idx]
        for i in range(k):
            if subset_sums[i] + val <= target:
                subset_sums[i] += val
                if backtrack(idx + 1):
                    return True
                subset_sums[i] -= val
            if subset_sums[i] == 0:
                break # Symmetry breaking optimization
        return False
        
    print("YES" if backtrack(0) else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Backtracking with reverse sorting and symmetry breaking pruning (if subset_sums[i] == 0 after backtrack, break loop).',
      timeComplexity: 'O(k^N)',
      spaceComplexity: 'O(k)',
    },
  },

  // --------------------------------------------------------------------------
  // cv166: Greedy - Huffman Encoding Prefix Cost (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv166',
    slug: 'huffman-encoding-prefix-cost',
    title: 'The Optimal Huffman Signal Compression',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are given the symbol frequencies of N distinct characters in an ancient text.
Construct an optimal prefix code using Huffman\'s algorithm, and calculate the total number of bits required to encode the entire text.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated positive integers representing character frequencies.',
    outputFormat: 'Print the total bit length of the compressed text.',
    constraints: '1 <= N <= 100000\n1 <= Freq_i <= 10^9',
    sampleCases: [
      { input: '4\n5 9 12 13', expectedOutput: '75', explanation: 'Huffman tree builds with optimal code lengths yielding 75 total bits.' },
      { input: '2\n10 20', expectedOutput: '30', explanation: 'Both symbols use 1 bit each: 10*1 + 20*1 = 30.' },
    ],
    hiddenCases: [
      { input: '1\n100' },
      { input: '3\n1 1 1' },
      { input: '5\n5 5 5 5 5' },
      { input: '6\n1 2 3 4 5 6' },
      { input: '7\n10 15 20 25 30 35 40' },
      { input: '4\n1 10 100 1000' },
      { input: '5\n2 3 5 7 11' },
      { input: '8\n8 7 6 5 4 3 2 1' },
    ],
    solutionCode: `
import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    freqs = [int(x) for x in data[1:1+n]]
    
    if n == 1:
        print(freqs[0]) # 1-bit per symbol
        return
        
    heapq.heapify(freqs)
    total_cost = 0
    
    while len(freqs) > 1:
        a = heapq.heappop(freqs)
        b = heapq.heappop(freqs)
        combined = a + b
        total_cost += combined
        heapq.heappush(freqs, combined)
        
    print(total_cost)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Huffman encoding using min-heap: the total bit length equals the sum of weights of all internal nodes in the Huffman tree.",
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv167: Greedy - Minimum Cost to Connect Ropes (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv167',
    slug: 'minimum-cost-connect-ropes',
    title: 'The Guild Cable Splice Minimum Effort',
    difficulty: 'EASY',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `There are N ropes of different lengths.
Connecting two ropes of length X and Y incurs a cost of X + Y.
Find the minimum total cost to connect all ropes into a single rope.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the minimum cost.',
    constraints: '1 <= N <= 100000\n1 <= Length_i <= 10^9',
    sampleCases: [
      { input: '4\n4 3 2 6', expectedOutput: '29', explanation: 'Connect 2+3=5 (cost 5), connect 4+5=9 (cost 9), connect 6+9=15 (cost 15). Total = 5+9+15 = 29.' },
      { input: '3\n1 2 3', expectedOutput: '9', explanation: '1+2=3 (cost 3), 3+3=6 (cost 6). Total = 9.' },
    ],
    hiddenCases: [
      { input: '1\n100' },
      { input: '2\n5 10' },
      { input: '5\n1 2 3 4 5' },
      { input: '6\n4 2 7 6 9 1' },
      { input: '4\n10 10 10 10' },
      { input: '5\n5 4 3 2 1' },
      { input: '7\n1 3 5 7 9 11 13' },
      { input: '8\n10 20 30 40 50 60 70 80' },
    ],
    solutionCode: `
import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    ropes = [int(x) for x in data[1:1+n]]
    
    if n <= 1:
        print(0)
        return
        
    heapq.heapify(ropes)
    total_cost = 0
    
    while len(ropes) > 1:
        first = heapq.heappop(ropes)
        second = heapq.heappop(ropes)
        cost = first + second
        total_cost += cost
        heapq.heappush(ropes, cost)
        
    print(total_cost)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy min-heap: always combine the two shortest available ropes to minimize cumulative sum.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv168: Greedy - Candy Distribution Ratings (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv168',
    slug: 'candy-distribution-ratings',
    title: 'The Academy Merit Ration Distribution',
    difficulty: 'HARD',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `There are N children standing in a line. Each child is assigned a rating value given in an integer array ratings.
You are giving candies to these children subjected to the following requirements:
- Each child must have at least one candy.
- Children with a higher rating get more candies than their immediate neighbors.

Return the minimum number of candies you need to distribute.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the minimum candies required.',
    constraints: '1 <= N <= 100000\n0 <= Rating_i <= 10^5',
    sampleCases: [
      { input: '3\n1 0 2', expectedOutput: '5', explanation: 'Distribution: [2, 1, 2] -> sum 5.' },
      { input: '3\n1 2 2', expectedOutput: '4', explanation: 'Distribution: [1, 2, 1] -> sum 4.' },
    ],
    hiddenCases: [
      { input: '1\n10' },
      { input: '4\n1 2 3 4' },
      { input: '4\n4 3 2 1' },
      { input: '5\n1 3 2 2 1' },
      { input: '6\n1 2 87 87 87 2' },
      { input: '5\n1 3 4 5 2' },
      { input: '7\n1 6 10 8 7 3 2' },
      { input: '5\n0 0 0 0 0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    ratings = [int(x) for x in data[1:1+n]]
    
    candies = [1] * n
    
    # Left to right pass
    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            candies[i] = candies[i - 1] + 1
            
    # Right to left pass
    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            candies[i] = max(candies[i], candies[i + 1] + 1)
            
    print(sum(candies))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Two-pass greedy algorithm: left-to-right satisfies left neighbor condition; right-to-left satisfies right neighbor condition using max().',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv169: Greedy - Non-Overlapping Intervals Erase (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv169',
    slug: 'non-overlapping-intervals-erase',
    title: 'The Astronomical Telescope Schedule Cull',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an array of intervals intervals where intervals[i] = [start_i, end_i], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.`,
    inputFormat: 'First line: Integer N.\nNext N lines: Two space-separated integers start and end.',
    outputFormat: 'Print the minimum removals.',
    constraints: '1 <= N <= 100000\n-50000 <= start < end <= 50000',
    sampleCases: [
      { input: '4\n1 2\n2 3\n3 4\n1 3', expectedOutput: '1', explanation: 'Remove [1, 3] to make the rest non-overlapping.' },
      { input: '3\n1 2\n1 2\n1 2', expectedOutput: '2', explanation: 'Remove 2 duplicate intervals.' },
    ],
    hiddenCases: [
      { input: '1\n1 2' },
      { input: '3\n1 2\n2 3\n3 4' },
      { input: '4\n1 100\n11 22\n1 11\n2 12' },
      { input: '5\n1 4\n2 3\n3 5\n4 6\n5 7' },
      { input: '4\n0 2\n1 3\n2 4\n3 5' },
      { input: '6\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4' },
      { input: '2\n-5 5\n-4 4' },
      { input: '5\n10 20\n20 30\n30 40\n15 25\n25 35' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    intervals = []
    idx = 1
    for _ in range(n):
        s = int(data[idx])
        e = int(data[idx+1])
        intervals.append((s, e))
        idx += 2
        
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    non_overlap_count = 0
    last_end = float('-inf')
    
    for s, e in intervals:
        if s >= last_end:
            non_overlap_count += 1
            last_end = e
            
    print(n - non_overlap_count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy activity selection: sort intervals by end time and select maximum non-overlapping intervals. Removals = N - kept.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv170: Greedy - Minimum Arrows to Burst Balloons (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv170',
    slug: 'minimum-arrows-burst-balloons',
    title: 'The Ballistics Crossbow Volley Optimizer',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `There are spherical balloons taped to a flat wall. The coordinates of the balloons are given as 2D integer array points where points[i] = [X_start, X_end].
An arrow shot vertically up at coordinate x bursts all balloons with X_start <= x <= X_end.

Given N balloons, return the minimum number of arrows that must be shot to burst all balloons.`,
    inputFormat: 'First line: Integer N.\nNext N lines: Two space-separated integers X_start and X_end.',
    outputFormat: 'Print the minimum arrows required.',
    constraints: '1 <= N <= 100000\n-2^31 <= X_start < X_end <= 2^31 - 1',
    sampleCases: [
      { input: '4\n10 16\n2 8\n1 6\n7 12', expectedOutput: '2', explanation: 'Arrows at x=6 and x=11.' },
      { input: '4\n1 2\n3 4\n5 6\n7 8', expectedOutput: '4', explanation: 'No overlap; 4 arrows needed.' },
    ],
    hiddenCases: [
      { input: '1\n1 2' },
      { input: '4\n1 2\n2 3\n3 4\n4 5' },
      { input: '3\n1 5\n2 4\n3 6' },
      { input: '5\n1 10\n2 3\n4 5\n6 7\n8 9' },
      { input: '4\n-10 -5\n-8 -3\n-4 0\n2 5' },
      { input: '2\n-2147483648 2147483647\n-2147483648 2147483647' },
      { input: '6\n1 3\n2 4\n3 5\n6 8\n7 9\n8 10' },
      { input: '3\n1 10\n1 10\n1 10' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    points = []
    idx = 1
    for _ in range(n):
        s = int(data[idx])
        e = int(data[idx+1])
        points.append((s, e))
        idx += 2
        
    points.sort(key=lambda x: x[1])
    
    arrows = 1
    last_pos = points[0][1]
    
    for s, e in points[1:]:
        if s > last_pos:
            arrows += 1
            last_pos = e
            
    print(arrows)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort by end coordinate and greedily shoot arrows at the rightmost possible position of each cluster.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv171: Greedy - Reconstruct Queue by Height (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv171',
    slug: 'reconstruct-queue-by-height',
    title: 'The Processional Queue Height Ordering',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given an array of people, people, which are the attributes of some people in a queue (not necessarily in order). Each people[i] = [h_i, k_i] represents the i-th person of height h_i with exactly k_i other people in front who have a height greater than or equal to h_i.

Reconstruct and print the queue that is represented by the input.
Print each person as "h k" on a new line.`,
    inputFormat: 'First line: Integer N.\nNext N lines: Two integers h and k.',
    outputFormat: 'Print the reconstructed queue line by line.',
    constraints: '1 <= N <= 2000\n0 <= h <= 10^6\n0 <= k < N',
    sampleCases: [
      { input: '6\n7 0\n4 4\n7 1\n5 0\n6 1\n5 2', expectedOutput: '5 0\n7 0\n5 2\n6 1\n4 4\n7 1', explanation: 'Standard reconstructed order.' },
      { input: '2\n6 0\n5 0', expectedOutput: '5 0\n6 0', explanation: 'Shorter person inserted at index 0.' },
    ],
    hiddenCases: [
      { input: '1\n100 0' },
      { input: '3\n1 0\n2 0\n3 0' },
      { input: '3\n3 0\n2 1\n1 2' },
      { input: '5\n10 0\n10 1\n10 2\n10 3\n10 4' },
      { input: '4\n2 0\n1 1\n4 0\n3 1' },
      { input: '6\n9 0\n7 0\n1 0\n5 0\n3 0\n2 0' },
      { input: '5\n6 0\n5 0\n4 0\n3 2\n2 2' },
      { input: '4\n5 0\n5 1\n4 2\n6 0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    people = []
    idx = 1
    for _ in range(n):
        h = int(data[idx])
        k = int(data[idx+1])
        people.append((h, k))
        idx += 2
        
    # Sort: descending height, ascending k
    people.sort(key=lambda x: (-x[0], x[1]))
    
    queue = []
    for p in people:
        queue.insert(p[1], p)
        
    for h, k in queue:
        print(f"{h} {k}")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort descending by height (break ties by ascending k), then insert each person at index k.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv172: Greedy - Maximum Units on Truck (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv172',
    slug: 'maximum-units-on-truck',
    title: 'The Cargo Freight Maximum Payload',
    difficulty: 'EASY',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are assigned to put some amount of boxes onto one truck. You are given a 2D array boxTypes, where boxTypes[i] = [numberOfBoxes_i, numberOfUnitsPerBox_i].
You are also given truckSize, which is the maximum number of boxes that can be put on the truck. You can choose any boxes to put on the truck as long as the total number of boxes does not exceed truckSize.

Return the maximum total number of units that can be put on the truck.`,
    inputFormat: 'First line: Two integers N and truckSize.\nNext N lines: Two space-separated integers numberOfBoxes and numberOfUnitsPerBox.',
    outputFormat: 'Print the maximum total units.',
    constraints: '1 <= N <= 1000\n1 <= numberOfBoxes, numberOfUnitsPerBox <= 1000\n1 <= truckSize <= 10^6',
    sampleCases: [
      { input: '3 4\n1 3\n2 2\n3 1', expectedOutput: '8', explanation: 'Take 1 box of 3 units + 2 boxes of 2 units + 1 box of 1 unit -> total units = 8.' },
      { input: '4 10\n5 10\n2 5\n4 7\n3 9', expectedOutput: '91', explanation: 'Maximized units.' },
    ],
    hiddenCases: [
      { input: '1 5\n10 20' },
      { input: '1 20\n10 20' },
      { input: '3 5\n2 10\n3 20\n4 30' },
      { input: '4 1\n1 100\n2 200\n3 50\n4 20' },
      { input: '5 50\n10 5\n10 5\n10 5\n10 5\n10 5' },
      { input: '3 100\n1 1\n1 2\n1 3' },
      { input: '4 15\n5 8\n5 6\n5 4\n5 2' },
      { input: '2 10\n10 1\n5 2' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    truck_size = int(data[1])
    
    boxes = []
    idx = 2
    for _ in range(n):
        num = int(data[idx])
        units = int(data[idx+1])
        boxes.append((units, num))
        idx += 2
        
    boxes.sort(reverse=True)
    
    total_units = 0
    remaining_capacity = truck_size
    
    for units, num in boxes:
        take = min(num, remaining_capacity)
        total_units += take * units
        remaining_capacity -= take
        if remaining_capacity == 0:
            break
            
    print(total_units)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy fractional knapsack variant: sort boxes descending by units per box and take as many as fit.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv173: Greedy - Task Scheduler Cooldown CPU (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv173',
    slug: 'task-scheduler-cooldown-cpu',
    title: 'The Real-Time CPU Task Pipeline',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a characters array tasks, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.
However, there is a non-negative integer n that represents the cooldown period between two same tasks (the same letter in the array), that is that there must be at least n units of time between any two same tasks.

Return the least number of units of times that the CPU will take to finish all the given tasks.`,
    inputFormat: 'First line: String tasks.\nSecond line: Integer n (cooldown).',
    outputFormat: 'Print the minimum time units.',
    constraints: '1 <= len(tasks) <= 10000\n0 <= n <= 100\nContains only uppercase English letters.',
    sampleCases: [
      { input: 'AAABBB\n2', expectedOutput: '8', explanation: 'A -> B -> idle -> A -> B -> idle -> A -> B (8 time units).' },
      { input: 'AAABBB\n0', expectedOutput: '6', explanation: 'No cooldown; 6 time units.' },
    ],
    hiddenCases: [
      { input: 'A\n2' },
      { input: 'AAAAA\n2' },
      { input: 'AAAAA\n0' },
      { input: 'AAAAA\n5' },
      { input: 'ABCDEF\n2' },
      { input: 'AABBBCCCDDD\n2' },
      { input: 'AAABBBCCC\n3' },
      { input: 'AABBCCDDEE\n1' },
    ],
    solutionCode: `
import sys
from collections import Counter

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    tasks = lines[0]
    n = int(lines[1])
    
    counts = Counter(tasks)
    max_freq = max(counts.values())
    max_count_elements = sum(1 for c in counts.values() if c == max_freq)
    
    time_needed = (max_freq - 1) * (n + 1) + max_count_elements
    print(max(len(tasks), time_needed))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy slot allocation: (max_freq - 1) * (n + 1) + num_max_tasks, bounded below by total number of tasks.',
      timeComplexity: 'O(len(tasks))',
      spaceComplexity: 'O(26)',
    },
  },

  // --------------------------------------------------------------------------
  // cv174: Greedy - Consecutive Subsequences Partition (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv174',
    slug: 'partition-array-consecutive-subsequences',
    title: 'The Ascending Runic Chain Partition',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are given an integer array nums sorted in non-decreasing order.
Determine if it is possible to split nums into one or more subsequences such that each subsequence consists of consecutive increasing integers and has a length of at least 3.

Print YES if possible, otherwise print NO.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers in non-decreasing order.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= N <= 100000\n-1000 <= nums[i] <= 1000',
    sampleCases: [
      { input: '6\n1 2 3 3 4 5', expectedOutput: 'YES', explanation: 'Can be split into [1, 2, 3] and [3, 4, 5].' },
      { input: '6\n1 2 3 4 4 5', expectedOutput: 'NO', explanation: 'Cannot form valid partition.' },
    ],
    hiddenCases: [
      { input: '3\n1 2 3' },
      { input: '2\n1 2' },
      { input: '7\n1 2 3 4 5 6 7' },
      { input: '8\n1 2 3 3 4 4 5 5' },
      { input: '4\n1 2 3 4' },
      { input: '5\n1 2 3 5 6' },
      { input: '6\n1 2 3 6 7 8' },
      { input: '5\n1 2 2 3 4' },
    ],
    solutionCode: `
import sys
from collections import Counter, defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    count = Counter(nums)
    tails = defaultdict(int)
    
    for x in nums:
        if count[x] == 0:
            continue
            
        count[x] -= 1
        # Try appending to existing chain ending at x - 1
        if tails[x - 1] > 0:
            tails[x - 1] -= 1
            tails[x] += 1
        # Otherwise create new chain of length 3: x, x+1, x+2
        elif count[x + 1] > 0 and count[x + 2] > 0:
            count[x + 1] -= 1
            count[x + 2] -= 1
            tails[x + 2] += 1
        else:
            print("NO")
            return
            
    print("YES")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy choice: preferentially extend existing subsequences; if not possible, greedily form a new 3-element subsequence.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv175: Greedy - Jump Game Reachability (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv175',
    slug: 'jump-game-reachability-boolean',
    title: 'The Stepping Stones Chasm Leap',
    difficulty: 'EASY',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given an integer array nums. You are initially positioned at the array's first index (0), and each element in the array represents your maximum jump length at that position.

Print YES if you can reach the last index, or NO otherwise.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated non-negative integers.',
    outputFormat: 'Print YES or NO.',
    constraints: '1 <= N <= 100000\n0 <= nums[i] <= 10^5',
    sampleCases: [
      { input: '5\n2 3 1 1 4', expectedOutput: 'YES', explanation: 'Jump 1 step from 0 to 1, then 3 steps to the last index.' },
      { input: '5\n3 2 1 0 4', expectedOutput: 'NO', explanation: 'Always land at index 3 with jump length 0; cannot reach index 4.' },
    ],
    hiddenCases: [
      { input: '1\n0' },
      { input: '2\n1 0' },
      { input: '2\n0 1' },
      { input: '3\n2 0 0' },
      { input: '4\n1 1 1 1' },
      { input: '5\n0 1 2 3 4' },
      { input: '6\n2 5 0 0 0 0' },
      { input: '5\n1 2 0 1 0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            print("NO")
            return
        max_reach = max(max_reach, i + jump)
        if max_reach >= n - 1:
            print("YES")
            return
            
    print("YES" if max_reach >= n - 1 else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy single-pass tracking maximum reachable index.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv176: Greedy - Minimum Deletions Unique Frequencies (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv176',
    slug: 'minimum-deletions-unique-frequencies',
    title: 'The Rune Frequency Uniqueness Filter',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A string S is called good if there are no two different characters in S that have the same frequency.
Given a string S, return the minimum number of characters you need to delete to make S good.
The frequency of a character is the number of times it appears in the string.`,
    inputFormat: 'A single string S of lowercase English letters.',
    outputFormat: 'Print the minimum deletions.',
    constraints: '1 <= len(S) <= 100000',
    sampleCases: [
      { input: 'aab', expectedOutput: '0', explanation: '\'a\' appears 2 times, \'b\' appears 1 time; frequencies are unique.' },
      { input: 'aaabbbcc', expectedOutput: '2', explanation: 'Delete one \'b\' and two \'c\'s, or similar, to get distinct frequencies.' },
    ],
    hiddenCases: [
      { input: 'ceabaacb' },
      { input: 'abc' },
      { input: 'a' },
      { input: 'bbcebab' },
      { input: 'abcdefghijklmnopqrstuvwxyz' },
      { input: 'aaabbbcccddd' },
      { input: 'zzzzzzzz' },
      { input: 'aabbccddeeff' },
    ],
    solutionCode: `
import sys
from collections import Counter

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
        
    counts = Counter(s)
    seen_frequencies = set()
    deletions = 0
    
    for char, freq in counts.items():
        while freq > 0 and freq in seen_frequencies:
            freq -= 1
            deletions += 1
        if freq > 0:
            seen_frequencies.add(freq)
            
    print(deletions)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy frequency decrementing: keep a set of seen frequencies; decrement colliding frequencies until unique or 0.',
      timeComplexity: 'O(N + 26^2)',
      spaceComplexity: 'O(26)',
    },
  },
];

console.log(`Writing Batch 8 (${problems.length} problems)...`);
problems.forEach((p) => {
  console.log(`Generating: ${p.id}`);
  createProblem(p);
});
console.log('✅ Batch 8 written successfully!');
