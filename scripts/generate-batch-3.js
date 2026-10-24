const { createProblem } = require('./problem-helper');

const batch3 = [
  // --------------------------------------------------------------------------
  // cv045: Backtracking - Subset Sum Target (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv045',
    slug: 'treasure-chest-subset-sum',
    title: 'The Vault Subset Sum Target',
    difficulty: 'EASY',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An explorer has an inventory of N gem weights. The explorer needs to determine if there exists any subset of gems whose total weight sums exactly to Target.

Given N integers and Target, print "YES" if such a subset exists, or "NO" otherwise.`,
    inputFormat: 'First line: Two integers N and Target.\nSecond line: N space-separated integers.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= N <= 20, 1 <= Target <= 10^5, 1 <= A[i] <= 10^4',
    sampleCases: [
      { input: '4 9\n3 34 4 12', expectedOutput: 'NO', explanation: 'No subset sums to 9.' },
      { input: '5 10\n1 2 7 4 5', expectedOutput: 'YES', explanation: 'Subset [1, 2, 7] or [1, 4, 5] sums to 10.' },
    ],
    hiddenCases: [
      { input: '1 5\n5', expectedOutput: 'YES' },
      { input: '1 5\n4', expectedOutput: 'NO' },
      { input: '6 30\n5 10 12 13 15 18', expectedOutput: 'YES' },
      { input: '5 100\n10 20 30 40 5', expectedOutput: 'NO' },
      { input: '8 25\n2 3 5 7 11 13 17 19', expectedOutput: 'YES' },
      { input: '4 0\n1 2 3 4', expectedOutput: 'YES' },
      { input: '7 50\n7 14 21 28 35 42 49', expectedOutput: 'NO' },
      { input: '6 15\n1 2 4 8 16 32', expectedOutput: 'YES' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    
    if target == 0:
        print("YES")
        return
        
    found = False
    def backtrack(idx, current_sum):
        nonlocal found
        if found:
            return
        if current_sum == target:
            found = True
            return
        if idx == n or current_sum > target:
            return
            
        # Include arr[idx]
        backtrack(idx + 1, current_sum + arr[idx])
        # Exclude arr[idx]
        backtrack(idx + 1, current_sum)

    backtrack(0, 0)
    print("YES" if found else "NO")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Recursive backtracking: at each index, branch into including or excluding arr[idx]. Prune branches exceeding Target.',
      timeComplexity: 'O(2^N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv046: Backtracking - N-Queens Solutions Count (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv046',
    slug: 'n-queens-configuration-count',
    title: 'The Royal Sovereign N-Queens Guard',
    difficulty: 'HARD',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `The N-Queens puzzle is the problem of placing N chess queens on an N x N chessboard such that no two queens attack each other (no two queens share the same row, column, or diagonal).

Given an integer N, return the total number of distinct solutions.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the count of valid N-Queens configurations.',
    constraints: '1 <= N <= 12',
    sampleCases: [
      { input: '4', expectedOutput: '2', explanation: 'For 4x4, exactly 2 distinct configurations exist.' },
      { input: '1', expectedOutput: '1', explanation: 'Single 1x1 board.' },
    ],
    hiddenCases: [
      { input: '2', expectedOutput: '0' },
      { input: '3', expectedOutput: '0' },
      { input: '5', expectedOutput: '10' },
      { input: '6', expectedOutput: '4' },
      { input: '7', expectedOutput: '40' },
      { input: '8', expectedOutput: '92' },
      { input: '9', expectedOutput: '352' },
      { input: '10', expectedOutput: '724' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    count = 0
    cols = set()
    diag1 = set()  # r - c
    diag2 = set()  # r + c
    
    def backtrack(r):
        nonlocal count
        if r == n:
            count += 1
            return
            
        for c in range(n):
            if c in cols or (r - c) in diag1 or (r + c) in diag2:
                continue
                
            cols.add(c)
            diag1.add(r - c)
            diag2.add(r + c)
            
            backtrack(r + 1)
            
            cols.remove(c)
            diag1.remove(r - c)
            diag2.remove(r + c)

    backtrack(0)
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Backtracking row by row: place queen at column c if c is not in cols set, and diagonals r - c and r + c are clear.',
      timeComplexity: 'O(N!)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv047: Backtracking - Permutations Generator Count (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv047',
    slug: 'lexicographical-permutations',
    title: 'The Rune Permutation Lexicon',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an array of distinct integers, print all unique permutations of the numbers in lexicographical order, with each permutation on a new line.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print each permutation as N space-separated integers per line.',
    constraints: '1 <= N <= 7, all integers distinct',
    sampleCases: [
      { input: '3\n1 2 3', expectedOutput: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', explanation: 'All 6 permutations of [1, 2, 3] in sorted order.' },
      { input: '2\n2 1', expectedOutput: '1 2\n2 1', explanation: 'Sorted order starts with 1 2.' },
    ],
    hiddenCases: [
      { input: '1\n99', expectedOutput: '99' },
      { input: '3\n3 1 2', expectedOutput: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1' },
      { input: '2\n5 10', expectedOutput: '5 10\n10 5' },
      { input: '3\n0 5 1', expectedOutput: '0 1 5\n0 5 1\n1 0 5\n1 5 0\n5 0 1\n5 1 0' },
      { input: '2\n-1 1', expectedOutput: '-1 1\n1 -1' },
      { input: '3\n-2 0 2', expectedOutput: '-2 0 2\n-2 2 0\n0 -2 2\n0 2 -2\n2 -2 0\n2 0 -2' },
      { input: '1\n0', expectedOutput: '0' },
      { input: '2\n20 10', expectedOutput: '10 20\n20 10' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = sorted([int(x) for x in data[1:n+1]])
    
    used = [False] * n
    curr = []
    
    def backtrack():
        if len(curr) == n:
            print(' '.join(map(str, curr)))
            return
        for i in range(n):
            if not used[i]:
                used[i] = True
                curr.append(nums[i])
                backtrack()
                curr.pop()
                used[i] = False

    backtrack()

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort the array first to guarantee lexicographical order. Use backtracking with a boolean used array to generate all permutations.',
      timeComplexity: 'O(N! * N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv048: Backtracking - Sudoku Validator (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv048',
    slug: 'sudoku-grid-validator',
    title: 'The Nine Chambers Sudoku Validator',
    difficulty: 'HARD',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:
1. Each row must contain the digits 1-9 without repetition.
2. Each column must contain the digits 1-9 without repetition.
3. Each of the nine 3 x 3 sub-boxes must contain the digits 1-9 without repetition.

Empty cells are denoted by '.'. Print "VALID" or "INVALID".`,
    inputFormat: '9 lines representing the board, each line containing 9 space-separated characters.',
    outputFormat: 'Print "VALID" or "INVALID".',
    constraints: 'Board size is exactly 9 x 9, cells contain \'1\'-\'9\' or \'.\'',
    sampleCases: [
      { input: '5 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9', expectedOutput: 'VALID', explanation: 'All placed numbers satisfy Sudoku rules.' },
      { input: '8 3 . . 7 . . . .\n6 . . 1 9 5 . . .\n. 9 8 . . . . 6 .\n8 . . . 6 . . . 3\n4 . . 8 . 3 . . 1\n7 . . . 2 . . . 6\n. 6 . . . . 2 8 .\n. . . 4 1 9 . . 5\n. . . . 8 . . 7 9', expectedOutput: 'INVALID', explanation: 'Two 8s in column 0.' },
    ],
    hiddenCases: [
      { input: '. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .', expectedOutput: 'VALID' },
      { input: '1 2 3 4 5 6 7 8 9\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .', expectedOutput: 'VALID' },
      { input: '1 1 . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .', expectedOutput: 'INVALID' },
      { input: '1 . . . . . . . .\n1 . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .', expectedOutput: 'INVALID' },
      { input: '1 . . . . . . . .\n. 1 . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .\n. . . . . . . . .', expectedOutput: 'INVALID' },
      { input: '5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9', expectedOutput: 'VALID' },
      { input: '. . 4 . . . 6 3 .\n. . . . . . . . .\n5 . . . . . . 9 .\n. . . 5 6 . . . .\n4 . 3 . . . . . 1\n. . . 7 . . . . .\n. . . 5 . . . . .\n. . . . . . . . .\n. . . . . . . . .', expectedOutput: 'INVALID' },
      { input: '1 . . . . . . . 2\n. 3 . . . . . 4 .\n. . 5 . . . 6 . .\n. . . 7 . 8 . . .\n. . . . 9 . . . .\n. . . 8 . 7 . . .\n. . 6 . . . 5 . .\n. 4 . . . . . 3 .\n2 . . . . . . . 1', expectedOutput: 'VALID' },
    ],
    solutionCode: `
import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
        
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    
    for r in range(9):
        for c in range(9):
            val = lines[r * 9 + c]
            if val != '.':
                b = (r // 3) * 3 + (c // 3)
                if val in rows[r] or val in cols[c] or val in boxes[b]:
                    print("INVALID")
                    return
                rows[r].add(val)
                cols[c].add(val)
                boxes[b].add(val)
                
    print("VALID")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Track seen numbers for each row, column, and 3x3 box using hash sets. If any digit repeats in its row, column, or box, return INVALID.',
      timeComplexity: 'O(1) fixed 9x9 board',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv049: Backtracking - Combination Sum (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv049',
    slug: 'combination-coin-combinations',
    title: 'The Coin Minting Combinations',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A royal treasury mints coins of N distinct positive denominations. You are asked to count the number of unique combinations that sum up to Target. The same denomination may be chosen an unlimited number of times.

Two combinations are unique if the frequency of at least one of the chosen numbers is different.`,
    inputFormat: 'First line: Two integers N and Target.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the count of unique coin combinations.',
    constraints: '1 <= N <= 30, 1 <= Target <= 500, 1 <= Coin[i] <= 50',
    sampleCases: [
      { input: '4 7\n2 3 6 7', expectedOutput: '2', explanation: 'Combinations: [2, 2, 3] and [7].' },
      { input: '3 8\n2 3 5', expectedOutput: '3', explanation: '[2,2,2,2], [2,3,3], [3,5].' },
    ],
    hiddenCases: [
      { input: '1 2\n2', expectedOutput: '1' },
      { input: '1 3\n2', expectedOutput: '0' },
      { input: '3 4\n1 2 3', expectedOutput: '4' },
      { input: '4 10\n2 4 6 8', expectedOutput: '3' },
      { input: '5 15\n3 5 7 9 11', expectedOutput: '4' },
      { input: '2 10\n3 7', expectedOutput: '1' },
      { input: '3 20\n4 6 8', expectedOutput: '4' },
      { input: '3 0\n1 2 3', expectedOutput: '1' },
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
    
    dp = [0] * (target + 1)
    dp[0] = 1
    for coin in coins:
        for x in range(coin, target + 1):
            dp[x] += dp[x - coin]
            
    print(dp[target])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Unbounded knapsack combination counting: dp[x] represents the number of ways to make sum x. Outer loop over coins ensures combinations (not permutations) are counted.',
      timeComplexity: 'O(N * Target)',
      spaceComplexity: 'O(Target)',
    },
  },

  // --------------------------------------------------------------------------
  // cv050: Backtracking - Letter Combinations of Phone Number (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv050',
    slug: 'phone-keypad-mnemonics',
    title: 'The Rotary Dial Cryptogram',
    difficulty: 'EASY',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent according to telephone keypad mappings:
2: abc, 3: def, 4: ghi, 5: jkl, 6: mno, 7: pqrs, 8: tuv, 9: wxyz.

Print the combinations in lexicographical order separated by spaces. If the input is empty, print "-1".`,
    inputFormat: 'A string of digits from 2-9.',
    outputFormat: 'Print space-separated letter combinations.',
    constraints: '0 <= |Digits| <= 4',
    sampleCases: [
      { input: '23', expectedOutput: 'ad ae af bd be bf cd ce cf', explanation: 'All combinations of {a,b,c} with {d,e,f}.' },
      { input: '2', expectedOutput: 'a b c', explanation: '3 combinations.' },
    ],
    hiddenCases: [
      { input: '7', expectedOutput: 'p q r s' },
      { input: '9', expectedOutput: 'w x y z' },
      { input: '24', expectedOutput: 'ag ah ai bg bh bi cg ch ci' },
      { input: '89', expectedOutput: 'tw tx ty tz uw ux uy uz vw vx vy vz' },
      { input: '33', expectedOutput: 'dd de df ed ee ef fd fe ff' },
      { input: '45', expectedOutput: 'gj gk gl hj hk hl ij ik il' },
      { input: '22', expectedOutput: 'aa ab ac ba bb bc ca cb cc' },
      { input: '234', expectedOutput: 'adg adh adi aeg aeh aei afg afh afi bdg bdh bdi beg beh bei bfg bfh bfi cdg cdh cdi ceg ceh cei cfg cfh cfi' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        print("-1")
        return
    digits = data[0]
    if not digits:
        print("-1")
        return
        
    mapping = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    
    results = []
    def backtrack(idx, current):
        if idx == len(digits):
            results.append(current)
            return
        for char in mapping[digits[idx]]:
            backtrack(idx + 1, current + char)

    backtrack(0, "")
    print(' '.join(results))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'DFS backtracking: at each digit position, iterate over its mapped characters, appending to current path and recursing.',
      timeComplexity: 'O(4^N * N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv051: Backtracking - Palindrome Partitioning (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv051',
    slug: 'palindrome-partition-count',
    title: 'The Palindromic Verse Dissection',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a string S, partition S such that every substring of the partition is a palindrome.

Return the total number of valid palindrome partitions of S.`,
    inputFormat: 'A single string S.',
    outputFormat: 'Print the count of valid palindrome partitions.',
    constraints: '1 <= |S| <= 16',
    sampleCases: [
      { input: 'aab', expectedOutput: '2', explanation: 'Partitions: ["a","a","b"] and ["aa","b"].' },
      { input: 'a', expectedOutput: '1', explanation: '["a"].' },
    ],
    hiddenCases: [
      { input: 'aaa', expectedOutput: '4' },
      { input: 'aba', expectedOutput: '2' },
      { input: 'abcd', expectedOutput: '1' },
      { input: 'racecar', expectedOutput: '5' },
      { input: 'noon', expectedOutput: '3' },
      { input: 'abba', expectedOutput: '3' },
      { input: 'aaaa', expectedOutput: '8' },
      { input: 'abcba', expectedOutput: '4' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    n = len(s)
    
    # Precompute palindrome substrings
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n):
        is_pal[i][i] = True
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                is_pal[i][j] = (length == 2) or is_pal[i + 1][j - 1]

    count = 0
    def backtrack(start):
        nonlocal count
        if start == n:
            count += 1
            return
        for end in range(start, n):
            if is_pal[start][end]:
                backtrack(end + 1)

    backtrack(0)
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Precompute 2D DP table is_pal[i][j] for O(1) palindrome checks. Use recursive backtracking to count all valid partitionings.',
      timeComplexity: 'O(N * 2^N)',
      spaceComplexity: 'O(N^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv052: Backtracking - Knight Reachability on Chessboard (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv052',
    slug: 'knight-shortest-moves',
    title: 'The Cavalier Knight Chessboard Quest',
    difficulty: 'HARD',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A knight is placed on an N x N chessboard at starting position (StartX, StartY). The knight moves in L-shapes (2 cells in one direction, 1 in the perpendicular direction).

Find the minimum number of knight moves required to reach target square (TargetX, TargetY). If the target is unreachable, print -1.`,
    inputFormat: 'First line: Integer N.\nSecond line: Four space-separated integers StartX, StartY, TargetX, TargetY (0-based).',
    outputFormat: 'Print the minimum moves integer.',
    constraints: '1 <= N <= 300, 0 <= StartX, StartY, TargetX, TargetY < N',
    sampleCases: [
      { input: '8\n0 0 7 7', expectedOutput: '6', explanation: 'A knight requires 6 moves from (0,0) to (7,7).' },
      { input: '8\n0 0 1 2', expectedOutput: '1', explanation: 'Direct knight leap.' },
    ],
    hiddenCases: [
      { input: '3\n0 0 0 0', expectedOutput: '0' },
      { input: '3\n0 0 1 1', expectedOutput: '-1' },
      { input: '4\n0 0 3 3', expectedOutput: '2' },
      { input: '8\n0 0 2 1', expectedOutput: '1' },
      { input: '10\n0 0 9 9', expectedOutput: '6' },
      { input: '100\n0 0 99 99', expectedOutput: '66' },
      { input: '8\n3 3 3 4', expectedOutput: '3' },
      { input: '5\n0 0 4 4', expectedOutput: '4' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    sx, sy, tx, ty = int(data[1]), int(data[2]), int(data[3]), int(data[4])
    
    if sx == tx and sy == ty:
        print(0)
        return
        
    moves = [(-2, -1), (-2, 1), (-1, -2), (-1, 2), (1, -2), (1, 2), (2, -1), (2, 1)]
    visited = [[False] * n for _ in range(n)]
    visited[sx][sy] = True
    queue = deque([(sx, sy, 0)])
    
    while queue:
        x, y, dist = queue.popleft()
        if x == tx and y == ty:
            print(dist)
            return
            
        for dx, dy in moves:
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < n and not visited[nx][ny]:
                visited[nx][ny] = True
                queue.append((nx, ny, dist + 1))
                
    print(-1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Breadth-First Search (BFS) explores shortest path in an unweighted state space. The 8 L-shaped moves guarantee minimum step discovery.',
      timeComplexity: 'O(N^2)',
      spaceComplexity: 'O(N^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv053: Backtracking - Generate Parentheses (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv053',
    slug: 'well-formed-parentheses',
    title: 'The Well-Balanced Spell Invocation',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given N pairs of parentheses, write a program to generate all combinations of well-formed parentheses in lexicographical order (where '(' comes before ')').

Print each valid combination on a new line.`,
    inputFormat: 'A single integer N.',
    outputFormat: 'Print each valid combination on a separate line.',
    constraints: '1 <= N <= 8',
    sampleCases: [
      { input: '3', expectedOutput: '((()))\n(()())\n(())()\n()(())\n()()()', explanation: 'All 5 valid combinations for N=3.' },
      { input: '1', expectedOutput: '()', explanation: 'Single valid pair.' },
    ],
    hiddenCases: [
      { input: '2', expectedOutput: '(())\n()()' },
      { input: '4', expectedOutput: '(((())))\n((()()))\n((())())\n((()))()\n(()(()))\n(()()())\n(()())()\n(())(())\n(())()()\n()((()))\n()(()())\n()(())()\n()()(())\n()()()()' },
      { input: '1', expectedOutput: '()' },
      { input: '2', expectedOutput: '(())\n()()' },
      { input: '3', expectedOutput: '((()))\n(()())\n(())()\n()(())\n()()()' },
      { input: '2', expectedOutput: '(())\n()()' },
      { input: '1', expectedOutput: '()' },
      { input: '3', expectedOutput: '((()))\n(()())\n(())()\n()(())\n()()()' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    results = []
    def backtrack(curr, open_count, close_count):
        if len(curr) == 2 * n:
            results.append(curr)
            return
        if open_count < n:
            backtrack(curr + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(curr + ')', open_count, close_count + 1)

    backtrack('', 0, 0)
    print('\\n'.join(results))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Backtracking with parenthesis balance invariants: can add \'(\' if open_count < N, and can add \')\' if close_count < open_count.',
      timeComplexity: 'O(4^N / sqrt(N)) Catalan number',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv054: Backtracking - Tug of War Minimum Difference (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv054',
    slug: 'tug-of-war-partition',
    title: 'The Tug of War Team Balance',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A competition consists of N athletes with given strength values. The athletes must be divided into two teams of equal size (if N is even, each team has N/2 members; if N is odd, one team has (N-1)/2 and the other (N+1)/2 members).

Find the minimum absolute difference between the total strengths of the two teams.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated positive integers.',
    outputFormat: 'Print the minimum absolute difference.',
    constraints: '2 <= N <= 20, 1 <= Strength[i] <= 1000',
    sampleCases: [
      { input: '4\n1 2 3 4', expectedOutput: '0', explanation: 'Team 1: [1, 4] (sum=5), Team 2: [2, 3] (sum=5). Diff = 0.' },
      { input: '5\n3 4 5 -3 100', expectedOutput: '94', explanation: 'Partition minimizing difference.' },
    ],
    hiddenCases: [
      { input: '2\n10 20', expectedOutput: '10' },
      { input: '6\n23 45 -34 12 0 98', expectedOutput: '4' },
      { input: '3\n1 2 3', expectedOutput: '0' },
      { input: '4\n10 10 10 10', expectedOutput: '0' },
      { input: '5\n1 2 3 4 5', expectedOutput: '1' },
      { input: '6\n1 2 3 4 5 6', expectedOutput: '1' },
      { input: '4\n100 1 1 100', expectedOutput: '0' },
      { input: '6\n10 20 30 40 50 60', expectedOutput: '10' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    total_sum = sum(arr)
    target_count = n // 2
    
    min_diff = float('inf')
    def backtrack(idx, count, curr_sum):
        nonlocal min_diff
        if count == target_count:
            diff = abs(total_sum - 2 * curr_sum)
            min_diff = min(min_diff, diff)
            return
        if idx == n or (n - idx) < (target_count - count):
            return
            
        # Include arr[idx]
        backtrack(idx + 1, count + 1, curr_sum + arr[idx])
        # Exclude arr[idx]
        backtrack(idx + 1, count, curr_sum)

    backtrack(0, 0, 0)
    print(min_diff)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Backtracking combination search: select N // 2 elements from the array to form Team 1. Prune branches where remaining elements cannot fulfill target size.',
      timeComplexity: 'O(C(N, N/2))',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv055: Backtracking - Rat in a Maze Path Counter (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv055',
    slug: 'labyrinth-rat-paths',
    title: 'The Labyrinth Mouse Path Counter',
    difficulty: 'MEDIUM',
    topics: ['Recursion & Backtracking'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A mouse is trapped in an N x N maze starting at top-left (0, 0) and must reach destination (N - 1, N - 1). The maze consists of 1s (open paths) and 0s (blocked walls).

The mouse can move in 4 directions: Up, Down, Left, Right, but cannot visit any cell more than once on the same path.

Print the total number of distinct paths from (0, 0) to (N - 1, N - 1).`,
    inputFormat: 'First line: Integer N.\nNext N lines: N space-separated 0s or 1s.',
    outputFormat: 'Print the total count of valid paths.',
    constraints: '1 <= N <= 7',
    sampleCases: [
      { input: '4\n1 0 0 0\n1 1 0 1\n1 1 0 0\n0 1 1 1', expectedOutput: '2', explanation: 'Exactly 2 distinct paths reach the destination.' },
      { input: '2\n1 0\n1 1', expectedOutput: '1', explanation: 'Path: Down, Right.' },
    ],
    hiddenCases: [
      { input: '1\n1', expectedOutput: '1' },
      { input: '1\n0', expectedOutput: '0' },
      { input: '2\n0 1\n1 1', expectedOutput: '0' },
      { input: '3\n1 1 1\n1 1 1\n1 1 1', expectedOutput: '12' },
      { input: '3\n1 0 1\n1 1 1\n0 1 1', expectedOutput: '4' },
      { input: '4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1', expectedOutput: '184' },
      { input: '2\n1 1\n1 1', expectedOutput: '2' },
      { input: '3\n1 0 0\n0 1 0\n0 0 1', expectedOutput: '0' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    maze = []
    for _ in range(n):
        maze.append([int(x) for x in data[idx:idx+n]])
        idx += n
        
    if maze[0][0] == 0 or maze[n - 1][n - 1] == 0:
        print(0)
        return
        
    visited = [[False] * n for _ in range(n)]
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    count = 0
    
    def dfs(r, c):
        nonlocal count
        if r == n - 1 and c == n - 1:
            count += 1
            return
            
        visited[r][c] = True
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc] and maze[nr][nc] == 1:
                dfs(nr, nc)
        visited[r][c] = False

    dfs(0, 0)
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'DFS backtracking with visited tracking: mark current cell visited, explore all 4 adjacent cells with 1, and unmark visited upon backtrack.',
      timeComplexity: 'O(4^(N^2)) worst case, bounded by small N <= 7',
      spaceComplexity: 'O(N^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv056: Greedy - Activity Selection (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv056',
    slug: 'activity-selection-scheduler',
    title: 'The Council Chamber Scheduler',
    difficulty: 'EASY',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given N meeting requests in a single council chamber. Meeting i starts at Start[i] and finishes at Finish[i]. Two meetings can be held if the second meeting starts at or after the first finishes (Start[j] >= Finish[i]).

Find the maximum number of meetings that can be accommodated in the chamber.`,
    inputFormat: 'First line: Integer N.\nNext N lines: Two integers Start[i] and Finish[i].',
    outputFormat: 'Print the maximum number of non-overlapping meetings.',
    constraints: '1 <= N <= 10^5, 0 <= Start[i] < Finish[i] <= 10^9',
    sampleCases: [
      { input: '3\n10 20\n12 25\n20 30', expectedOutput: '2', explanation: 'Meetings [10, 20] and [20, 30] can be held.' },
      { input: '4\n1 2\n3 4\n0 6\n5 7', expectedOutput: '3', explanation: '[1, 2], [3, 4], and [5, 7] can be scheduled.' },
    ],
    hiddenCases: [
      { input: '1\n5 10', expectedOutput: '1' },
      { input: '3\n1 10\n2 3\n4 5', expectedOutput: '2' },
      { input: '5\n1 3\n2 4\n3 5\n0 6\n5 7', expectedOutput: '3' },
      { input: '4\n1 4\n2 5\n3 6\n4 7', expectedOutput: '2' },
      { input: '6\n0 1\n1 2\n2 3\n3 4\n4 5\n5 6', expectedOutput: '6' },
      { input: '3\n1 5\n2 6\n3 7', expectedOutput: '1' },
      { input: '5\n10 12\n11 13\n12 14\n13 15\n14 16', expectedOutput: '3' },
      { input: '4\n7 9\n0 10\n4 5\n8 9', expectedOutput: '2' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    meetings = []
    for _ in range(n):
        s = int(data[idx])
        f = int(data[idx+1])
        meetings.append((s, f))
        idx += 2
        
    # Greedy: sort by finish time
    meetings.sort(key=lambda m: m[1])
    
    count = 0
    last_finish = -1
    for s, f in meetings:
        if s >= last_finish:
            count += 1
            last_finish = f
            
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy activity selection: sort meetings by finish time in ascending order. Always pick the meeting that finishes earliest and is compatible with the previous.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv057: Greedy - Fractional Knapsack (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv057',
    slug: 'fractional-knapsack-spices',
    title: 'The Spice Merchant Fractional Knapsack',
    difficulty: 'EASY',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A spice merchant has a knapsack with maximum weight capacity W. There are N types of precious spices, where spice i has total value V[i] and total weight Wt[i]. Spices can be divided into fractions.

Calculate the maximum total value of spices the merchant can carry. Print the result rounded to two decimal places.`,
    inputFormat: 'First line: Two integers N and W.\nNext N lines: Two integers V[i] and Wt[i].',
    outputFormat: 'Print the maximum value rounded to 2 decimal places (e.g. 240.00).',
    constraints: '1 <= N <= 10^5, 1 <= W <= 10^9, 1 <= V[i], Wt[i] <= 10^5',
    sampleCases: [
      { input: '3 50\n60 10\n100 20\n120 30', expectedOutput: '240.00', explanation: 'Take item 1 (val 60, wt 10), item 2 (val 100, wt 20), and 2/3 of item 3 (val 80, wt 20). Total = 240.' },
      { input: '2 50\n60 10\n100 20', expectedOutput: '160.00', explanation: 'All items fit: 60 + 100 = 160.00.' },
    ],
    hiddenCases: [
      { input: '1 10\n50 5', expectedOutput: '50.00' },
      { input: '1 10\n50 20', expectedOutput: '25.00' },
      { input: '3 15\n10 2\n5 3\n15 5', expectedOutput: '30.00' },
      { input: '4 10\n100 20\n60 10\n120 30\n20 5', expectedOutput: '60.00' },
      { input: '2 100\n500 50\n400 50', expectedOutput: '900.00' },
      { input: '3 20\n25 10\n24 10\n15 10', expectedOutput: '49.00' },
      { input: '2 1\n100 2\n50 2', expectedOutput: '50.00' },
      { input: '3 60\n100 20\n120 30\n60 10', expectedOutput: '280.00' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    w = int(data[1])
    idx = 2
    items = []
    for _ in range(n):
        v = int(data[idx])
        wt = int(data[idx+1])
        items.append((v, wt, v / wt))
        idx += 2
        
    # Sort descending by value-to-weight ratio
    items.sort(key=lambda x: x[2], reverse=True)
    
    total_val = 0.0
    rem_cap = w
    for v, wt, ratio in items:
        if rem_cap <= 0:
            break
        if wt <= rem_cap:
            total_val += v
            rem_cap -= wt
        else:
            total_val += ratio * rem_cap
            rem_cap = 0
            
    print(f"{total_val:.2f}")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy value-per-weight density: sort items descending by V[i] / Wt[i]. Take full items while capacity allows; take the fractional remainder of the last item.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv058: Greedy - Jump Game Minimum Steps (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv058',
    slug: 'jump-game-minimum-steps',
    title: 'The Stepping Stone River Crossing',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An array A of non-negative integers represents river stepping stones. When standing at index i, you can jump at most A[i] steps forward.

Find the minimum number of jumps to reach the last index (N - 1) starting from index 0. If it is impossible to reach the end, print -1.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the minimum jumps, or -1.',
    constraints: '1 <= N <= 10^5, 0 <= A[i] <= 10^5',
    sampleCases: [
      { input: '5\n2 3 1 1 4', expectedOutput: '2', explanation: 'Jump 1 step from 0 to 1, then 3 steps to the last index.' },
      { input: '5\n2 3 0 1 4', expectedOutput: '2', explanation: 'Jump from 0 to 1, then from 1 to 4.' },
    ],
    hiddenCases: [
      { input: '1\n0', expectedOutput: '0' },
      { input: '3\n0 2 3', expectedOutput: '-1' },
      { input: '5\n1 1 1 1 1', expectedOutput: '4' },
      { input: '6\n3 2 1 0 4 5', expectedOutput: '-1' },
      { input: '4\n1 2 3 4', expectedOutput: '2' },
      { input: '7\n2 3 1 1 2 4 2', expectedOutput: '3' },
      { input: '2\n1 0', expectedOutput: '1' },
      { input: '2\n0 1', expectedOutput: '-1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    if n <= 1:
        print(0)
        return
    if arr[0] == 0:
        print(-1)
        return
        
    jumps = 0
    curr_end = 0
    farthest = 0
    
    for i in range(n - 1):
        farthest = max(farthest, i + arr[i])
        if i == curr_end:
            jumps += 1
            curr_end = farthest
            if curr_end >= n - 1:
                break
        if i >= farthest:
            print(-1)
            return
            
    print(jumps if curr_end >= n - 1 else -1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy interval BFS: track farthest index reachable. When index i reaches curr_end, increment jumps and update curr_end to farthest.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv059: Greedy - Gas Station Circular Tour (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv059',
    slug: 'gas-station-circuit',
    title: 'The Great Desert Circular Rally',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `There are N gas stations along a circular route. Station i provides Gas[i] fuel and costs Cost[i] fuel to travel to station (i + 1). You begin with an empty tank.

Find the starting gas station index (0-based) from which you can travel around the complete circuit once in a clockwise direction. If no such station exists, print -1.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated Gas[i] values.\nThird line: N space-separated Cost[i] values.',
    outputFormat: 'Print the starting station index, or -1.',
    constraints: '1 <= N <= 10^5, 0 <= Gas[i], Cost[i] <= 10^4',
    sampleCases: [
      { input: '5\n1 2 3 4 5\n3 4 5 1 2', expectedOutput: '3', explanation: 'Start at index 3 (Gas=4, Cost=1). Tank remains >= 0 throughout the cycle.' },
      { input: '3\n2 3 4\n3 4 3', expectedOutput: '-1', explanation: 'Total gas 9 < total cost 10.' },
    ],
    hiddenCases: [
      { input: '1\n5\n4', expectedOutput: '0' },
      { input: '1\n4\n5', expectedOutput: '-1' },
      { input: '4\n5 1 2 3\n4 4 1 2', expectedOutput: '2' },
      { input: '2\n2 2\n2 2', expectedOutput: '0' },
      { input: '3\n3 1 1\n1 2 2', expectedOutput: '0' },
      { input: '4\n1 1 1 1\n2 2 2 2', expectedOutput: '-1' },
      { input: '5\n3 3 4 1 5\n4 3 2 4 1', expectedOutput: '4' },
      { input: '2\n5 8\n6 7', expectedOutput: '1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    gas = [int(x) for x in data[1:1+n]]
    cost = [int(x) for x in data[1+n:1+2*n]]
    
    total_tank = 0
    curr_tank = 0
    start_station = 0
    
    for i in range(n):
        diff = gas[i] - cost[i]
        total_tank += diff
        curr_tank += diff
        if curr_tank < 0:
            start_station = i + 1
            curr_tank = 0
            
    print(start_station if total_tank >= 0 else -1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy one-pass: if total_gas < total_cost, impossible (-1). If curr_tank dips below 0 at station i, the valid start must be after i.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv060: Greedy - Minimum Platforms Required (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv060',
    slug: 'railway-platform-allocation',
    title: 'The Central Terminal Platforms',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given the arrival and departure times of N trains at a railway station, find the minimum number of platforms required so that no train has to wait for a platform.

Arrival and departure times are given as integers in 24-hour military format (e.g. 900 for 09:00, 1530 for 15:30).`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated arrival times.\nThird line: N space-separated departure times.',
    outputFormat: 'Print the minimum number of platforms.',
    constraints: '1 <= N <= 50000, 0 <= Time <= 2359',
    sampleCases: [
      { input: '6\n900 940 950 1100 1500 1800\n910 1200 1120 1130 1900 2000', expectedOutput: '3', explanation: 'At 11:00, 3 trains overlap on the station.' },
      { input: '3\n900 1100 1235\n1000 1200 1240', expectedOutput: '1', explanation: 'No overlapping train times.' },
    ],
    hiddenCases: [
      { input: '1\n1000\n1100', expectedOutput: '1' },
      { input: '2\n1000 1000\n1100 1100', expectedOutput: '2' },
      { input: '3\n900 900 900\n1000 1000 1000', expectedOutput: '3' },
      { input: '4\n100 200 300 400\n150 250 350 450', expectedOutput: '1' },
      { input: '4\n100 105 110 115\n120 125 130 135', expectedOutput: '4' },
      { input: '3\n1000 1030 1100\n1045 1115 1130', expectedOutput: '2' },
      { input: '5\n800 830 900 930 1000\n845 915 945 1015 1045', expectedOutput: '2' },
      { input: '2\n900 1000\n1000 1100', expectedOutput: '1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = sorted([int(x) for x in data[1:1+n]])
    dep = sorted([int(x) for x in data[1+n:1+2*n]])
    
    platforms = 0
    max_platforms = 0
    i = 0
    j = 0
    
    while i < n and j < n:
        if arr[i] < dep[j]:
            platforms += 1
            max_platforms = max(max_platforms, platforms)
            i += 1
        else:
            platforms -= 1
            j += 1
            
    print(max_platforms)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort arrival times and departure times independently. Two pointers simulate time: when next event is arrival, increment platforms; when departure, decrement platforms.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv061: Greedy - Non-Overlapping Intervals (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv061',
    slug: 'interval-culling-minimum-removals',
    title: 'The Astronomical Window Collision',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `An array of N intervals [Start, End] is observed. Find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

Two intervals [1, 2] and [2, 3] do NOT overlap (touching at a point is allowed).`,
    inputFormat: 'First line: Integer N.\nNext N lines: Two integers Start and End.',
    outputFormat: 'Print the minimum removal count.',
    constraints: '1 <= N <= 10^5, -10^9 <= Start < End <= 10^9',
    sampleCases: [
      { input: '4\n1 2\n2 3\n3 4\n1 3', expectedOutput: '1', explanation: 'Remove [1, 3] so remaining [1,2], [2,3], [3,4] do not overlap.' },
      { input: '3\n1 2\n1 2\n1 2', expectedOutput: '2', explanation: 'Remove 2 duplicate intervals.' },
    ],
    hiddenCases: [
      { input: '1\n1 10', expectedOutput: '0' },
      { input: '3\n1 2\n2 3\n3 4', expectedOutput: '0' },
      { input: '4\n1 100\n11 22\n1 11\n2 12', expectedOutput: '2' },
      { input: '3\n1 10\n2 3\n3 4', expectedOutput: '1' },
      { input: '5\n1 4\n2 5\n3 6\n4 7\n5 8', expectedOutput: '3' },
      { input: '2\n-10 0\n0 10', expectedOutput: '0' },
      { input: '4\n0 2\n1 3\n2 4\n3 5', expectedOutput: '2' },
      { input: '3\n1 5\n2 3\n3 4', expectedOutput: '1' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    intervals = []
    for _ in range(n):
        s = int(data[idx])
        e = int(data[idx+1])
        intervals.append((s, e))
        idx += 2
        
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    removals = 0
    last_end = float('-inf')
    
    for s, e in intervals:
        if s >= last_end:
            last_end = e
        else:
            removals += 1
            
    print(removals)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort intervals by end time. Greedily keep intervals that finish earliest to leave maximum room for future intervals. Count skipped/removed intervals.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv062: Greedy - Assign Cookies (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv062',
    slug: 'ration-cookie-satisfaction',
    title: 'The Orphanage Rations Distribution',
    difficulty: 'EASY',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You have N children and M cookies. Child i has a greed factor G[i], which is the minimum size of a cookie that will make the child content. Cookie j has size S[j].

Each child can be given at most one cookie, and a cookie can only satisfy child i if S[j] >= G[i]. Maximize the number of content children.`,
    inputFormat: 'First line: Two integers N and M.\nSecond line: N space-separated integers G[i].\nThird line: M space-separated integers S[j].',
    outputFormat: 'Print the maximum number of satisfied children.',
    constraints: '1 <= N, M <= 30000, 1 <= G[i], S[j] <= 10^9',
    sampleCases: [
      { input: '3 2\n1 2 3\n1 1', expectedOutput: '1', explanation: 'Only child with greed 1 can be satisfied.' },
      { input: '2 3\n1 2\n1 2 3', expectedOutput: '2', explanation: 'Both children satisfied.' },
    ],
    hiddenCases: [
      { input: '1 1\n5\n5', expectedOutput: '1' },
      { input: '1 1\n5\n4', expectedOutput: '0' },
      { input: '3 3\n3 2 1\n1 2 3', expectedOutput: '3' },
      { input: '4 2\n10 20 30 40\n15 25', expectedOutput: '2' },
      { input: '3 5\n10 10 10\n5 5 10 10 10', expectedOutput: '3' },
      { input: '2 1\n1 2\n3', expectedOutput: '1' },
      { input: '4 4\n5 6 7 8\n1 2 3 4', expectedOutput: '0' },
      { input: '3 4\n2 3 4\n1 2 3 4', expectedOutput: '3' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    g = sorted([int(x) for x in data[2:2+n]])
    s = sorted([int(x) for x in data[2+n:2+n+m]])
    
    child = 0
    cookie = 0
    while child < n and cookie < m:
        if s[cookie] >= g[child]:
            child += 1
        cookie += 1
        
    print(child)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sort greed factors and cookie sizes. Greedily satisfy the child with the smallest greed factor using the smallest suitable cookie.',
      timeComplexity: 'O(N log N + M log M)',
      spaceComplexity: 'O(N + M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv063: Greedy - Lemonade Change (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv063',
    slug: 'lemonade-change-till',
    title: 'The Fairground Lemonade Cash Register',
    difficulty: 'EASY',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `At a lemonade stand, each lemonade costs $5. Customers stand in a queue and buy one lemonade at a time, paying with either a $5, $10, or $20 bill.

You must provide the correct change to each customer so that the net transaction is $5. You start with no money.

Print "YES" if you can provide every customer with correct change, or "NO" otherwise.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated bills (5, 10, or 20).',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= N <= 10^5, Bill[i] in {5, 10, 20}',
    sampleCases: [
      { input: '5\n5 5 5 10 20', expectedOutput: 'YES', explanation: 'We collect $5, $5, $5, give $5 change for $10, then give $10 + $5 for $20.' },
      { input: '5\n5 5 10 10 20', expectedOutput: 'NO', explanation: 'For the last $20, we need $15 change but only have $10 bills.' },
    ],
    hiddenCases: [
      { input: '1\n5', expectedOutput: 'YES' },
      { input: '1\n10', expectedOutput: 'NO' },
      { input: '2\n5 10', expectedOutput: 'YES' },
      { input: '3\n5 10 20', expectedOutput: 'NO' },
      { input: '4\n5 5 5 20', expectedOutput: 'YES' },
      { input: '4\n5 5 10 20', expectedOutput: 'YES' },
      { input: '6\n5 5 5 10 10 20', expectedOutput: 'NO' },
      { input: '3\n5 5 5', expectedOutput: 'YES' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    bills = [int(x) for x in data[1:n+1]]
    
    five = 0
    ten = 0
    for b in bills:
        if b == 5:
            five += 1
        elif b == 10:
            if five == 0:
                print("NO")
                return
            five -= 1
            ten += 1
        else: # 20
            # Prefer giving 10 + 5 over 5 + 5 + 5
            if ten > 0 and five > 0:
                ten -= 1
                five -= 1
            elif five >= 3:
                five -= 3
            else:
                print("NO")
                return
    print("YES")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy change: maintain counts of $5 and $10 bills. When receiving $20, greedily give one $10 and one $5 first to preserve versatile $5 bills.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv064: Greedy - Candy Distribution (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv064',
    slug: 'monarch-candy-distribution',
    title: 'The Palace Honor Candy Distribution',
    difficulty: 'HARD',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `There are N children standing in a line, each assigned a rating value Rating[i]. You are distributing candies subject to:
1. Each child must have at least one candy.
2. Children with a higher rating than their immediate neighbors must get more candies than their neighbor.

Find the minimum total candies needed to satisfy both rules.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated non-negative integers.',
    outputFormat: 'Print the minimum candies total.',
    constraints: '1 <= N <= 10^5, 0 <= Rating[i] <= 10^5',
    sampleCases: [
      { input: '3\n1 0 2', expectedOutput: '5', explanation: 'Candies: [2, 1, 2]. Total = 5.' },
      { input: '3\n1 2 2', expectedOutput: '4', explanation: 'Candies: [1, 2, 1]. Total = 4.' },
    ],
    hiddenCases: [
      { input: '1\n10', expectedOutput: '1' },
      { input: '2\n1 2', expectedOutput: '3' },
      { input: '2\n2 1', expectedOutput: '3' },
      { input: '4\n1 2 3 4', expectedOutput: '10' },
      { input: '4\n4 3 2 1', expectedOutput: '10' },
      { input: '5\n1 3 2 2 1', expectedOutput: '7' },
      { input: '6\n1 2 87 87 87 2', expectedOutput: '9' },
      { input: '5\n1 0 0 0 1', expectedOutput: '7' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    ratings = [int(x) for x in data[1:n+1]]
    if n <= 1:
        print(n)
        return
        
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
      approach: 'Two-pass greedy algorithm: left-to-right pass ensures higher rating than left neighbor gets more. Right-to-left pass ensures higher rating than right neighbor gets more.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv065: Greedy - Job Sequencing with Deadlines (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv065',
    slug: 'job-sequencing-profit-deadlines',
    title: 'The Blacksmith Job Scheduling Profit',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A royal blacksmith has N job requests. Each job i has a Deadline D[i] (latest unit time slot it can finish) and a Profit P[i]. Each job takes exactly 1 unit of time to complete. Only one job can be scheduled at any time slot.

Find the maximum profit achievable by scheduling jobs within their deadlines.`,
    inputFormat: 'First line: Integer N.\nNext N lines: Two integers D[i] and P[i].',
    outputFormat: 'Print the maximum total profit.',
    constraints: '1 <= N <= 1000, 1 <= D[i] <= 1000, 1 <= P[i] <= 10^5',
    sampleCases: [
      { input: '4\n4 20\n1 10\n1 40\n1 30', expectedOutput: '60', explanation: 'Pick job 3 (prof 40, dead 1) and job 1 (prof 20, dead 4). Total = 60.' },
      { input: '5\n2 100\n1 19\n2 27\n1 25\n1 15', expectedOutput: '127', explanation: 'Schedule job with 100 at slot 2, job with 27 at slot 1.' },
    ],
    hiddenCases: [
      { input: '1\n1 50', expectedOutput: '50' },
      { input: '3\n1 10\n2 20\n3 30', expectedOutput: '60' },
      { input: '3\n1 10\n1 20\n1 30', expectedOutput: '30' },
      { input: '4\n2 50\n2 60\n3 20\n3 30', expectedOutput: '140' },
      { input: '5\n3 35\n4 30\n4 25\n2 20\n3 15', expectedOutput: '110' },
      { input: '2\n2 100\n2 200', expectedOutput: '300' },
      { input: '4\n1 1\n1 2\n1 3\n1 4', expectedOutput: '4' },
      { input: '3\n2 80\n2 90\n1 70', expectedOutput: '170' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    jobs = []
    max_deadline = 0
    for _ in range(n):
        d = int(data[idx])
        p = int(data[idx+1])
        jobs.append((d, p))
        max_deadline = max(max_deadline, d)
        idx += 2
        
    # Sort jobs descending by profit
    jobs.sort(key=lambda x: x[1], reverse=True)
    
    slots = [-1] * (max_deadline + 1)
    total_profit = 0
    
    for d, p in jobs:
        # Find latest available slot from d down to 1
        for t in range(d, 0, -1):
            if slots[t] == -1:
                slots[t] = p
                total_profit += p
                break
                
    print(total_profit)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Greedy scheduling: sort jobs by profit descending. Place each job in the latest possible empty slot <= its deadline.',
      timeComplexity: 'O(N * max(Deadline))',
      spaceComplexity: 'O(max(Deadline))',
    },
  },

  // --------------------------------------------------------------------------
  // cv066: Greedy - Largest Number from Array (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv066',
    slug: 'largest-concatenated-number',
    title: 'The Runemaster Number Formulation',
    difficulty: 'MEDIUM',
    topics: ['Greedy Algorithms'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a list of non-negative integers, arrange them such that they form the largest possible number when concatenated.

The result should be printed as a string.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the largest concatenated number string.',
    constraints: '1 <= N <= 10^4, 0 <= A[i] <= 10^9',
    sampleCases: [
      { input: '2\n10 2', expectedOutput: '210', explanation: '"210" > "102".' },
      { input: '5\n3 30 34 5 9', expectedOutput: '9534330', explanation: '9 + 5 + 34 + 3 + 30.' },
    ],
    hiddenCases: [
      { input: '1\n0', expectedOutput: '0' },
      { input: '3\n0 0 0', expectedOutput: '0' },
      { input: '2\n1 10', expectedOutput: '110' },
      { input: '4\n12 121 120 128', expectedOutput: '12812121120' },
      { input: '3\n4 45 40', expectedOutput: '45440' },
      { input: '2\n830 8308', expectedOutput: '8308830' },
      { input: '3\n8 89 88', expectedOutput: '89888' },
      { input: '4\n5 50 500 55', expectedOutput: '55550500' },
    ],
    solutionCode: `
import sys
from functools import cmp_to_key

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = data[1:n+1]
    
    # Custom comparator: a + b vs b + a
    def compare(x, y):
        if x + y > y + x:
            return -1
        elif x + y < y + x:
            return 1
        return 0

    nums.sort(key=cmp_to_key(compare))
    ans = ''.join(nums).lstrip('0')
    print(ans if ans else '0')

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Custom sorting comparator: for two string numbers A and B, place A before B if A+B > B+A. Strip leading zeros.',
      timeComplexity: 'O(N log N * L) where L is max digits',
      spaceComplexity: 'O(N)',
    },
  },
];

console.log(`Writing Batch 3 (${batch3.length} problems)...`);
batch3.forEach((p) => {
  console.log('Generating:', p.id);
  createProblem(p);
});
console.log('✅ Batch 3 written successfully!');
