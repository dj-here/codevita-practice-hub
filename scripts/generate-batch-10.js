const { createProblem } = require('./problem-helper');

const problems = [
  // --------------------------------------------------------------------------
  // cv199: Simulation & Search - Sliding Puzzle Shortest Board (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv199',
    slug: 'sliding-puzzle-shortest-board',
    title: 'The 2x3 Sliding Rune Puzzle',
    difficulty: 'HARD',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `On a 2 x 3 board, there are five tiles represented by the integers 1 through 5, and an empty square represented by 0.
A move consists of 0 and 4-directionally adjacent number swapping places.
The state of the board is solved if and only if the board is [[1, 2, 3], [4, 5, 0]].

Given the puzzle board, return the least number of moves required so that the state of the board is solved. If it is impossible, return -1.`,
    inputFormat: '2 lines, each containing 3 space-separated integers.',
    outputFormat: 'Print the minimum moves or -1.',
    constraints: 'Board values are a permutation of [0, 1, 2, 3, 4, 5].',
    sampleCases: [
      { input: '1 2 3\n4 0 5', expectedOutput: '1', explanation: 'Swap 0 and 5 in 1 move.' },
      { input: '1 2 3\n5 4 0', expectedOutput: '-1', explanation: 'No sequence of moves can solve this parity.' },
    ],
    hiddenCases: [
      { input: '4 1 2\n5 0 3' },
      { input: '3 2 4\n1 5 0' },
      { input: '1 2 3\n4 5 0' },
      { input: '0 1 2\n4 5 3' },
      { input: '5 4 3\n2 1 0' },
      { input: '2 3 5\n1 4 0' },
      { input: '1 3 0\n4 2 5' },
      { input: '4 3 2\n1 0 5' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    board_str = ''.join(data)
    target = "123450"
    
    if board_str == target:
        print(0)
        return
        
    moves = {
        0: [1, 3],
        1: [0, 2, 4],
        2: [1, 5],
        3: [0, 4],
        4: [1, 3, 5],
        5: [2, 4]
    }
    
    q = deque([(board_str, 0)])
    visited = {board_str}
    
    while q:
        curr, steps = q.popleft()
        if curr == target:
            print(steps)
            return
            
        zero_idx = curr.index('0')
        for nxt_idx in moves[zero_idx]:
            curr_list = list(curr)
            curr_list[zero_idx], curr_list[nxt_idx] = curr_list[nxt_idx], curr_list[zero_idx]
            nxt_str = ''.join(curr_list)
            if nxt_str not in visited:
                visited.add(nxt_str)
                q.append((nxt_str, steps + 1))
                
    print(-1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Breadth-First Search over state space of 6! = 720 configurations.',
      timeComplexity: 'O(720) = O(1)',
      spaceComplexity: 'O(720) = O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv200: Simulation - Bulls and Cows Secret Code (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv200',
    slug: 'bulls-and-cows-secret-code',
    title: 'The Mastermind Cryptographic Code Match',
    difficulty: 'EASY',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are playing the Bulls and Cows game with an opponent.
Given a secret number string secret and your friend's guess string guess:
- "Bulls" are digits in the guess that are in the correct position.
- "Cows" are digits in the guess that are in your secret number, but are located in the wrong position.
Each matching digit in the secret can only count toward one bull or cow.

Return the secret hint formatted as "xAyB", where x is the number of bulls and y is the number of cows.`,
    inputFormat: 'First line: String secret.\nSecond line: String guess.',
    outputFormat: 'Print the hint as xAyB.',
    constraints: '1 <= len(secret), len(guess) <= 1000\nlen(secret) == len(guess)\nContains only digits.',
    sampleCases: [
      { input: '1807\n7810', expectedOutput: '1A3B', explanation: 'Bull: 8 (index 1). Cows: 0, 1, 7.' },
      { input: '1123\n0111', expectedOutput: '1A1B', explanation: 'Bull: 1 (index 1). Cow: 1.' },
    ],
    hiddenCases: [
      { input: '1\n0' },
      { input: '1\n1' },
      { input: '1122\n2211' },
      { input: '1234\n4321' },
      { input: '1234\n1234' },
      { input: '1111\n1111' },
      { input: '1111\n2222' },
      { input: '9876543210\n0123456789' },
    ],
    solutionCode: `
import sys
from collections import Counter

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    secret, guess = lines[0], lines[1]
    
    bulls = 0
    s_cows = Counter()
    g_cows = Counter()
    
    for s, g in zip(secret, guess):
        if s == g:
            bulls += 1
        else:
            s_cows[s] += 1
            g_cows[g] += 1
            
    cows = sum(min(s_cows[k], g_cows[k]) for k in s_cows)
    print(f"{bulls}A{cows}B")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Single-pass count exact matches (Bulls), then accumulate character frequencies for remaining mismatched digits to count Cows.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(10) = O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv201: Simulation - Battleships in Board Counter (EASY)
  // --------------------------------------------------------------------------
  {
    id: 'cv201',
    slug: 'battleships-in-a-board-counter',
    title: 'The Naval Armada Battleship Radar',
    difficulty: 'EASY',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an N x M matrix board where each cell is a battleship 'X' or empty '.', return the number of the battleships on board.
Battleships can only be placed horizontally or vertically. At least one horizontal or vertical cell separates between any two battleships (no adjacent battleships).`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated characters (\'X\' or \'.\').',
    outputFormat: 'Print the count of battleships.',
    constraints: '1 <= N, M <= 200',
    sampleCases: [
      { input: '3 4\nX . . X\n. . . X\n. . . X', expectedOutput: '2', explanation: 'One 1x1 battleship at top-left, one 3x1 battleship at right column.' },
      { input: '1 1\n.', expectedOutput: '0', explanation: 'No battleships.' },
    ],
    hiddenCases: [
      { input: '1 1\nX' },
      { input: '3 3\nX X X\n. . .\nX X X' },
      { input: '4 4\nX . . .\n. X . .\n. . X .\n. . . X' },
      { input: '3 3\n. . .\n. . .\n. . .' },
      { input: '4 1\nX\nX\n.\nX' },
      { input: '1 4\nX X . X' },
      { input: '3 4\nX . X .\n. . . .\nX . X .' },
      { input: '2 2\nX .\n. X' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    board = []
    idx = 2
    for _ in range(n):
        board.append(data[idx:idx+m])
        idx += m
        
    count = 0
    for r in range(n):
        for c in range(m):
            if board[r][c] == 'X':
                # Check if it's the head of a battleship (top and left must not be X)
                if (r == 0 or board[r - 1][c] != 'X') and (c == 0 or board[r][c - 1] != 'X'):
                    count += 1
                    
    print(count)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Count battleship heads: an \'X\' cell represents the start of a ship iff neither its upper cell nor its left cell is \'X\'.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv202: Simulation - Minesweeper Click Reveal (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv202',
    slug: 'minesweeper-click-board-reveal',
    title: 'The Demining Sapper Field Revealer',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given an N x M 2D char array board representing the game board and an integer array click representing the next click position [click_r, click_c]:
- 'M' represents an unrevealed mine.
- 'E' represents an unrevealed empty square.
- 'B' represents a revealed blank square that has no adjacent mines.
- Digits '1' to '8' represent how many mines are adjacent to this revealed square.
- 'X' represents a revealed mine.

Rules:
1. If a mine 'M' is clicked, change it to 'X'. Game over.
2. If an empty square 'E' with adjacent mines is clicked, change it to a digit ('1' to '8') representing the mine count.
3. If an empty square 'E' with no adjacent mines is clicked, change it to 'B' and recursively reveal all unrevealed adjacent squares.

Return the updated board after the click.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated characters.\nLast line: Two integers click_r and click_c.',
    outputFormat: 'Print the updated N x M board, each row on a new line with space-separated characters.',
    constraints: '1 <= N, M <= 50\n0 <= click_r < N, 0 <= click_c < M',
    sampleCases: [
      { input: '4 5\nE E E E E\nE E M E E\nE E E E E\nE E E E E\n3 0', expectedOutput: 'B 1 E 1 B\nB 1 M 1 B\nB 1 1 1 B\nB B B B B', explanation: 'Recursive blank square reveal.' },
      { input: '1 2\nE M\n0 1', expectedOutput: 'E X', explanation: 'Direct mine hit.' },
    ],
    hiddenCases: [
      { input: '1 1\nE\n0 0' },
      { input: '2 2\nM E\nE E\n0 1' },
      { input: '3 3\nE E E\nE M E\nE E E\n0 0' },
      { input: '3 3\nM M M\nM E M\nM M M\n1 1' },
      { input: '3 3\nE E E\nE E E\nE E E\n1 1' },
      { input: '2 2\nM M\nM M\n0 0' },
      { input: '3 4\nE M E E\nE E E E\nE E E M\n0 0' },
      { input: '4 4\nE E E E\nE M M E\nE M M E\nE E E E\n0 0' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    board = []
    idx = 2
    for _ in range(n):
        board.append(data[idx:idx+m])
        idx += m
        
    cr = int(data[idx])
    cc = int(data[idx+1])
    
    if board[cr][cc] == 'M':
        board[cr][cc] = 'X'
    else:
        dirs = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
        q = deque([(cr, cc)])
        
        while q:
            r, c = q.popleft()
            if board[r][c] != 'E':
                continue
                
            mines = 0
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < m and board[nr][nc] == 'M':
                    mines += 1
                    
            if mines > 0:
                board[r][c] = str(mines)
            else:
                board[r][c] = 'B'
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < m and board[nr][nc] == 'E':
                        q.append((nr, nc))
                        
    for row in board:
        print(' '.join(row))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Breadth-First Search flood reveal: check 8-neighbor mine count; if 0, mark \'B\' and expand, else assign digit count.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv203: Simulation - Candy Crush Gravity Board (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv203',
    slug: 'candy-crush-board-gravity',
    title: 'The Grid Crystal Collapse Mechanics',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an N x M board of integers representing candy colors, simulate a single collapse cycle of the candy crush game:
1. Mark all horizontal or vertical lines of three or more adjacent cells with the same color value (greater than 0).
2. Crush all marked cells simultaneously by setting their values to 0.
3. Drop all non-zero candies vertically downward due to gravity so that all 0s float to the top of each column.

Print the resulting N x M board after one complete collapse step.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated integers.',
    outputFormat: 'Print the N x M board after collapse.',
    constraints: '3 <= N, M <= 50\n0 <= val <= 2000',
    sampleCases: [
      { input: '4 4\n1 1 1 2\n2 3 4 2\n3 3 3 2\n4 5 6 7', expectedOutput: '0 0 0 0\n0 0 0 2\n2 0 4 2\n4 5 6 7', explanation: 'Rows 0 and 2 and col 3 collapse and drop by gravity.' },
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '1 2 3\n4 5 6\n7 8 9', explanation: 'No 3-in-a-row match.' },
    ],
    hiddenCases: [
      { input: '3 3\n1 1 1\n2 2 2\n3 3 3' },
      { input: '4 3\n1 2 3\n1 4 5\n1 6 7\n8 9 0' },
      { input: '3 5\n1 1 1 1 1\n2 3 4 5 6\n7 8 9 0 1' },
      { input: '4 4\n0 0 0 0\n0 1 0 0\n0 1 0 0\n0 1 0 0' },
      { input: '5 5\n1 2 3 4 5\n1 2 3 4 5\n1 2 3 4 5\n6 7 8 9 0\n6 7 8 9 0' },
      { input: '3 3\n5 5 5\n5 5 5\n5 5 5' },
      { input: '4 4\n1 2 3 4\n2 2 2 4\n3 4 5 4\n5 6 7 8' },
      { input: '3 4\n1 1 2 2\n1 2 2 2\n1 1 3 3' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    board = []
    idx = 2
    for _ in range(n):
        board.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    crush = [[False] * m for _ in range(n)]
    
    # Check horizontal
    for r in range(n):
        for c in range(m - 2):
            val = abs(board[r][c])
            if val != 0 and abs(board[r][c+1]) == val and abs(board[r][c+2]) == val:
                crush[r][c] = crush[r][c+1] = crush[r][c+2] = True
                
    # Check vertical
    for c in range(m):
        for r in range(n - 2):
            val = abs(board[r][c])
            if val != 0 and abs(board[r+1][c]) == val and abs(board[r+2][c]) == val:
                crush[r][c] = crush[r+1][c] = crush[r+2][c] = True
                
    # Crush to 0
    for r in range(n):
        for c in range(m):
            if crush[r][c]:
                board[r][c] = 0
                
    # Gravity drop
    for c in range(m):
        write_r = n - 1
        for r in range(n - 1, -1, -1):
            if board[r][c] != 0:
                board[write_r][c] = board[r][c]
                write_r -= 1
        for r in range(write_r, -1, -1):
            board[r][c] = 0
            
    for row in board:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Tag 3-in-a-row candies across horizontal and vertical sweeps, zero out, and collapse columns downwards using two-pointer write index.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv204: Simulation - Pour Water Terrain Physics (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv204',
    slug: 'pour-water-terrain-physics',
    title: 'The Reservoir Terrain Pouring Simulation',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `You are given an elevation map heights and you pour V units of water onto index K.
Each water droplet moves according to these rules:
1. First, it tries to move left downhill. It continues moving left as long as it does not move uphill. If it reaches a strictly lower level than where it started, it rests at the lowest leftmost point.
2. If it cannot rest to the left, it tries to move right downhill following the same principle.
3. If it cannot rest to the right, it rests at index K.

Simulate the pouring of all V droplets and return the final heights array.`,
    inputFormat: 'First line: Three integers N, V, and K.\nSecond line: N space-separated integers representing heights.',
    outputFormat: 'Print the final space-separated heights.',
    constraints: '1 <= N <= 100\n0 <= V <= 2000\n0 <= K < N\n0 <= heights[i] <= 99',
    sampleCases: [
      { input: '7 4 3\n2 1 1 2 1 2 2', expectedOutput: '2 2 2 3 2 2 2', explanation: 'Water fills valleys to the left and right of index 3.' },
      { input: '5 1 2\n1 2 3 4 5', expectedOutput: '2 2 3 4 5', explanation: 'Droplet flows down left to index 0.' },
    ],
    hiddenCases: [
      { input: '3 1 1\n3 1 3' },
      { input: '3 2 1\n3 1 3' },
      { input: '4 3 2\n1 2 3 4' },
      { input: '5 5 2\n5 4 3 4 5' },
      { input: '1 5 0\n10' },
      { input: '6 4 3\n4 2 2 3 2 4' },
      { input: '5 0 2\n1 2 3 2 1' },
      { input: '7 6 3\n3 2 1 2 1 2 3' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    v = int(data[1])
    k = int(data[2])
    h = [int(x) for x in data[3:3+n]]
    
    for _ in range(v):
        best = k
        # Try left
        for i in range(k - 1, -1, -1):
            if h[i] > h[i + 1]:
                break
            if h[i] < h[best]:
                best = i
        if best != k:
            h[best] += 1
            continue
            
        # Try right
        for i in range(k + 1, n):
            if h[i] > h[i - 1]:
                break
            if h[i] < h[best]:
                best = i
        h[best] += 1
        
    print(' '.join(map(str, h)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Step-by-step fluid dynamics simulation: drop each water unit individually scanning left then right for strict local minima.',
      timeComplexity: 'O(V * N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv205: Simulation - Prison Cells After N Days (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv205',
    slug: 'prison-cells-after-n-days',
    title: 'The Cellular Automaton Prison Evolution',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `There are 8 prison cells in a row and each cell is either occupied (1) or vacant (0).
Each day, whether the cell is occupied or vacant changes according to the following rules:
- If a cell has two adjacent neighbors that are both occupied or both vacant, then the cell becomes occupied.
- Otherwise, it becomes vacant.
The two edge cells (index 0 and index 7) do not have two neighbors, so they always become 0 each day.

Given the initial state of the cells and an integer N, return the state of the prison after N days.`,
    inputFormat: 'First line: 8 space-separated integers (0 or 1).\nSecond line: Integer N.',
    outputFormat: 'Print 8 space-separated integers representing the final cell states.',
    constraints: 'N is up to 10^9\nInitial cells are 8 integers (0 or 1).',
    sampleCases: [
      { input: '0 1 0 1 1 0 0 1\n7', expectedOutput: '0 0 1 1 0 0 0 0', explanation: 'State after 7 days.' },
      { input: '1 0 0 1 0 0 1 0\n1000000000', expectedOutput: '0 0 1 1 1 1 1 0', explanation: 'Fast-forwarded via cycle detection.' },
    ],
    hiddenCases: [
      { input: '0 0 0 0 0 0 0 0\n1' },
      { input: '1 1 1 1 1 1 1 1\n1' },
      { input: '0 1 0 1 0 1 0 1\n14' },
      { input: '0 1 0 1 0 1 0 1\n15' },
      { input: '1 0 1 0 1 0 1 0\n20' },
      { input: '0 1 1 0 1 1 0 0\n100' },
      { input: '1 1 0 1 1 0 1 1\n500' },
      { input: '0 0 1 1 0 0 1 1\n1000' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    cells = [int(x) for x in data[:8]]
    n = int(data[8])
    
    seen = {}
    history = []
    
    for day in range(n):
        state = tuple(cells)
        if state in seen:
            cycle_len = day - seen[state]
            rem = (n - day) % cycle_len
            cells = list(history[seen[state] + rem])
            break
        seen[state] = day
        history.append(state)
        
        nxt = [0] * 8
        for i in range(1, 7):
            nxt[i] = 1 if cells[i - 1] == cells[i + 1] else 0
        cells = nxt
        
    print(' '.join(map(str, cells)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Cycle detection on finite state space (8 cells = 2^8 = 256 states; periodicity is at most 14 days). Fast forward N modulo cycle length.',
      timeComplexity: 'O(cycle_length) <= 14 operations',
      spaceComplexity: 'O(1)',
    },
  },

  // --------------------------------------------------------------------------
  // cv206: Simulation - Robot Room Cleaner (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv206',
    slug: 'robot-room-cleaner-spiral',
    title: 'The Automated Sanitizer Spiral Coverage',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `A sanitation robot cleans an N x M room represented by a grid where 1 is an open cleanable space and 0 is an obstacle wall.
The robot starts at (start_r, start_c) facing North ('N').
The robot explores using depth-first search: trying to advance forward; if blocked by wall or obstacle, it turns clockwise 90 degrees. It visits and cleans every reachable open space.

Print the total count of distinct tiles cleaned.`,
    inputFormat: 'First line: Two integers N and M.\nSecond line: Two integers start_r and start_c.\nNext N lines: M space-separated integers (0 or 1).',
    outputFormat: 'Print the count of cleaned tiles.',
    constraints: '1 <= N, M <= 50\nRoom[start_r][start_c] == 1',
    sampleCases: [
      { input: '3 3\n1 1\n1 1 1\n1 1 1\n1 1 1', expectedOutput: '9', explanation: 'All 9 tiles reachable.' },
      { input: '3 3\n0 0\n1 0 1\n0 1 0\n1 0 1', expectedOutput: '1', explanation: 'Trapped at (0, 0).' },
    ],
    hiddenCases: [
      { input: '1 1\n0 0\n1' },
      { input: '2 2\n0 0\n1 1\n1 0' },
      { input: '4 4\n0 0\n1 1 1 1\n1 0 0 1\n1 0 0 1\n1 1 1 1' },
      { input: '5 5\n2 2\n0 0 0 0 0\n0 1 1 1 0\n0 1 1 1 0\n0 1 1 1 0\n0 0 0 0 0' },
      { input: '3 3\n1 1\n1 0 1\n0 1 0\n1 0 1' },
      { input: '4 1\n0 0\n1\n1\n1\n1' },
      { input: '1 4\n0 0\n1 1 0 1' },
      { input: '3 3\n0 0\n1 1 1\n0 0 1\n1 1 1' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    sr = int(data[2])
    sc = int(data[3])
    
    grid = []
    idx = 4
    for _ in range(n):
        grid.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    visited = set()
    q = deque([(sr, sc)])
    visited.add((sr, sc))
    
    while q:
        r, c = q.popleft()
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and grid[nr][nc] == 1 and (nr, nc) not in visited:
                visited.add((nr, nc))
                q.append((nr, nc))
                
    print(len(visited))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Connected component reachability traversal from starting position in grid.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv207: Simulation - Tic-Tac-Toe Winner (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv207',
    slug: 'design-tic-tac-toe-winner',
    title: 'The General N-Grid Tic-Tac-Toe Arbiter',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Design a Tic-Tac-Toe game on an N x N grid played between two players (Player 1 placing 1, Player 2 placing 2).
You are given N, followed by M moves in chronological order. Each move specifies row r, col c, and player p.
A player wins when they successfully place N of their marks in any row, column, or diagonal. Once a player wins, the game ends immediately.

Print:
- "PLAYER 1 WINS at move X" if Player 1 wins on move X (1-based index).
- "PLAYER 2 WINS at move X" if Player 2 wins on move X.
- "DRAW" if all moves are played without any winner.`,
    inputFormat: 'First line: Two integers N and M.\nNext M lines: Three integers r, c, and p.',
    outputFormat: 'Print the winner string or DRAW.',
    constraints: '3 <= N <= 100\n1 <= M <= N^2\n0 <= r, c < N\np is 1 or 2',
    sampleCases: [
      { input: '3 5\n0 0 1\n0 1 2\n1 1 1\n0 2 2\n2 2 1', expectedOutput: 'PLAYER 1 WINS at move 5', explanation: 'Player 1 wins on main diagonal.' },
      { input: '3 4\n0 0 1\n1 1 2\n0 1 1\n2 2 2', expectedOutput: 'DRAW', explanation: 'No winner after 4 moves.' },
    ],
    hiddenCases: [
      { input: '3 5\n0 0 1\n1 0 2\n0 1 1\n1 1 2\n0 2 1' },
      { input: '3 6\n0 0 1\n1 0 2\n0 1 1\n1 1 2\n2 2 1\n1 2 2' },
      { input: '3 5\n0 2 1\n1 0 2\n1 1 1\n2 0 2\n2 0 1' },
      { input: '4 7\n0 0 1\n1 0 2\n0 1 1\n1 1 2\n0 2 1\n1 2 2\n0 3 1' },
      { input: '3 3\n0 0 1\n1 1 2\n2 2 1' },
      { input: '3 9\n0 0 1\n0 1 2\n0 2 1\n1 1 2\n1 0 1\n1 2 2\n2 1 1\n2 0 2\n2 2 1' },
      { input: '4 4\n0 0 1\n1 1 2\n2 2 1\n3 3 2' },
      { input: '3 6\n0 0 1\n2 0 2\n1 1 1\n2 1 2\n0 1 1\n2 2 2' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    rows = [0] * n
    cols = [0] * n
    diag = 0
    anti_diag = 0
    
    idx = 2
    for move_num in range(1, m + 1):
        r = int(data[idx])
        c = int(data[idx+1])
        p = int(data[idx+2])
        idx += 3
        
        delta = 1 if p == 1 else -1
        rows[r] += delta
        cols[c] += delta
        if r == c:
            diag += delta
        if r + c == n - 1:
            anti_diag += delta
            
        target = n if p == 1 else -n
        if rows[r] == target or cols[c] == target or diag == target or anti_diag == target:
            print(f"PLAYER {p} WINS at move {move_num}")
            return
            
    print("DRAW")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'O(1) per-move winner check tracking cumulative row, col, and diagonal tallies (+1 for Player 1, -1 for Player 2).',
      timeComplexity: 'O(M)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv208: Simulation - Count Atoms Chemical Formula (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv208',
    slug: 'count-atoms-chemical-formula',
    title: 'The Molecular Formula Chemical Lexer',
    difficulty: 'HARD',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Given a chemical formula formula, return the count of all atoms.
An atom element begins with an uppercase character, followed by zero or more lowercase characters.
One or more digits representing the count may follow if the count is greater than 1.
If the count is not present, the count will be 1.
Formulas can have nested parentheses like "K4(ON(SO3)2)2".

Return the result as a concatenated string of element names sorted lexicographically, each followed by its count (if greater than 1).`,
    inputFormat: 'A single string formula.',
    outputFormat: 'Print the formatted chemical count string.',
    constraints: '1 <= len(formula) <= 1000',
    sampleCases: [
      { input: 'H2O', expectedOutput: 'H2O', explanation: 'H: 2, O: 1.' },
      { input: 'Mg(OH)2', expectedOutput: 'H2MgO2', explanation: 'H: 2, Mg: 1, O: 2.' },
    ],
    hiddenCases: [
      { input: 'K4(ON(SO3)2)2' },
      { input: 'H' },
      { input: 'He' },
      { input: 'H11He49NO35B7N46Li20' },
      { input: '((N42)24(OB40)34)20' },
      { input: 'NaCl' },
      { input: 'C6H12O6' },
      { input: '(H)' },
    ],
    solutionCode: `
import sys
from collections import defaultdict

def solve():
    formula = sys.stdin.read().strip()
    if not formula:
        return
        
    stack = [defaultdict(int)]
    i = 0
    n = len(formula)
    
    while i < n:
        if formula[i] == '(':
            stack.append(defaultdict(int))
            i += 1
        elif formula[i] == ')':
            i += 1
            start = i
            while i < n and formula[i].isdigit():
                i += 1
            mult = int(formula[start:i]) if i > start else 1
            top = stack.pop()
            for elem, cnt in top.items():
                stack[-1][elem] += cnt * mult
        else:
            # Parse element name
            start = i
            i += 1
            while i < n and formula[i].islower():
                i += 1
            elem = formula[start:i]
            
            # Parse count
            start = i
            while i < n and formula[i].isdigit():
                i += 1
            cnt = int(formula[start:i]) if i > start else 1
            stack[-1][elem] += cnt
            
    res = []
    final_counts = stack[0]
    for elem in sorted(final_counts):
        res.append(elem)
        if final_counts[elem] > 1:
            res.append(str(final_counts[elem]))
            
    print(''.join(res))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Stack-based lexer evaluating nested scopes and multiplying internal frequency maps on closing parenthesis.',
      timeComplexity: 'O(N log(unique_atoms))',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv209: Simulation - Snake Game Food Eater (MEDIUM)
  // --------------------------------------------------------------------------
  {
    id: 'cv209',
    slug: 'snakes-game-food-eater',
    title: 'The Classic Serpent Grid Navigation',
    difficulty: 'MEDIUM',
    topics: ['Simulation & Bit Manipulation'],
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    statement: `Simulate a snake game on an N x M screen (rows 0..N-1, cols 0..M-1).
The snake begins at (0, 0) with initial length 1.
A food list provides food coordinates [r, c] that appear sequentially.
A command sequence of K direction letters ('U', 'D', 'L', 'R') is executed.
At each move:
- The snake advances its head 1 unit in that direction.
- If the head goes out of bounds or collides with its own body, game ends immediately; print -1.
- If the head reaches the current active food, the snake grows (tail is not removed) and score increases by 1.
- Otherwise, the snake advances forward (tail is removed).

Print the final score after all moves (or -1 if the snake died).`,
    inputFormat: 'First line: Three integers N, M, and F (screen dimensions and number of food items).\nNext F lines: Two integers food_r and food_c.\nNext line: Integer K.\nNext line: K space-separated characters (directions U, D, L, R).',
    outputFormat: 'Print final score or -1.',
    constraints: '2 <= N, M <= 20\n0 <= F <= 50\n1 <= K <= 200',
    sampleCases: [
      { input: '3 3 2\n1 2\n0 1\n5\nR D R U L', expectedOutput: '1', explanation: 'Eats first food at (1, 2); final score 1.' },
      { input: '2 2 1\n0 1\n2\nU U', expectedOutput: '-1', explanation: 'Moves out of top boundary.' },
    ],
    hiddenCases: [
      { input: '3 3 1\n0 1\n1\nR' },
      { input: '3 3 0\n2\nR D' },
      { input: '4 4 3\n0 1\n0 2\n0 3\n3\nR R R' },
      { input: '3 3 1\n1 0\n4\nD R U L' },
      { input: '2 2 1\n1 1\n4\nR D L U' },
      { input: '5 5 2\n0 1\n1 1\n3\nR D L' },
      { input: '3 3 2\n0 1\n0 2\n2\nR R' },
      { input: '2 2 0\n1\nL' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    f = int(data[2])
    
    foods = []
    idx = 3
    for _ in range(f):
        foods.append((int(data[idx]), int(data[idx+1])))
        idx += 2
        
    k = int(data[idx])
    idx += 1
    moves = data[idx:idx+k]
    
    dirs = {'U': (-1, 0), 'D': (1, 0), 'L': (0, -1), 'R': (0, 1)}
    
    snake = deque([(0, 0)])
    snake_set = {(0, 0)}
    score = 0
    food_idx = 0
    
    for move in moves:
        dr, dc = dirs[move]
        hr, hc = snake[0]
        nr, nc = hr + dr, hc + dc
        
        # Out of bounds
        if nr < 0 or nr >= n or nc < 0 or nc >= m:
            print(-1)
            return
            
        # Check if eating food
        if food_idx < f and foods[food_idx] == (nr, nc):
            score += 1
            food_idx += 1
            # Tail is not removed
        else:
            tail = snake.pop()
            snake_set.remove(tail)
            
        # Self collision
        if (nr, nc) in snake_set:
            print(-1)
            return
            
        snake.appendleft((nr, nc))
        snake_set.add((nr, nc))
        
    print(score)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Double-ended queue (deque) tracking snake body coordinates with set for O(1) collision checks.',
      timeComplexity: 'O(K)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv210: Grand Finale - Skyline Contour Silhouette (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv210',
    slug: 'skyline-contour-building-silhouette',
    title: 'The Metropolis Skyline Geometric Silhouette',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `A city's skyline is the outer contour of the silhouette formed by all the buildings in that city when viewed from a distance.
Given the locations and heights of N buildings where building i is [left_i, right_i, height_i], return the skyline formed by these buildings collectively.

The skyline should be represented as a list of key points [x, y] sorted by x.
A key point is the left endpoint of that horizontal line segment.
Print each key point as "x y" on a new line.`,
    inputFormat: 'First line: Integer N.\nNext N lines: Three space-separated integers left, right, and height.',
    outputFormat: 'Print key points line by line.',
    constraints: '1 <= N <= 10000\n0 <= left < right <= 2^31 - 1\n1 <= height <= 2^31 - 1',
    sampleCases: [
      { input: '5\n2 9 10\n3 7 15\n5 12 12\n15 20 10\n19 24 8', expectedOutput: '2 10\n3 15\n7 12\n12 0\n15 10\n20 8\n24 0', explanation: 'Standard classic skyline contour.' },
      { input: '2\n0 2 3\n2 5 3', expectedOutput: '0 3\n5 0', explanation: 'Merged contiguous buildings of same height.' },
    ],
    hiddenCases: [
      { input: '1\n1 5 10' },
      { input: '2\n1 5 10\n2 4 12' },
      { input: '3\n1 3 5\n2 4 6\n3 5 7' },
      { input: '4\n0 5 10\n5 10 10\n10 15 10\n15 20 10' },
      { input: '3\n1 10 5\n2 9 6\n3 8 7' },
      { input: '2\n1 3 5\n4 6 5' },
      { input: '4\n1 5 8\n2 6 7\n3 7 6\n4 8 5' },
      { input: '3\n2 4 7\n2 4 5\n2 4 6' },
    ],
    solutionCode: `
import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    events = []
    idx = 1
    for _ in range(n):
        l = int(data[idx])
        r = int(data[idx+1])
        h = int(data[idx+2])
        # Start event: (l, -h, r)
        events.append((l, -h, r))
        # End event: (r, 0, 0)
        events.append((r, 0, 0))
        idx += 3
        
    events.sort()
    
    # max-heap: (-height, right_boundary)
    live = [(0, float('inf'))]
    skyline = []
    
    for x, neg_h, r in events:
        if neg_h != 0:
            heapq.heappush(live, (neg_h, r))
            
        while live[0][1] <= x:
            heapq.heappop(live)
            
        curr_h = -live[0][0]
        if not skyline or skyline[-1][1] != curr_h:
            skyline.append((x, curr_h))
            
    for pt in skyline:
        print(f"{pt[0]} {pt[1]}")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sweep-line algorithm with max-heap priority queue tracking active building heights at each coordinate change.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv211: Grand Finale - Trapping Rain Water 2D Heap (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv211',
    slug: 'trapping-rain-water-2d-heap',
    title: 'The 3D Canyon Landscape Trapped Volume',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an N x M matrix of non-negative integers representing the height of each unit cell in a 2D elevation map, compute the total volume of water it can trap after raining.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated integers.',
    outputFormat: 'Print the total volume of trapped water.',
    constraints: '1 <= N, M <= 100\n0 <= Height <= 20000',
    sampleCases: [
      { input: '3 6\n1 4 3 1 3 2\n3 2 1 3 2 4\n2 3 3 2 3 1', expectedOutput: '4', explanation: 'Traps 4 total units of water in internal basin.' },
      { input: '3 3\n3 3 3\n3 1 3\n3 3 3', expectedOutput: '2', explanation: 'Center cell of height 1 surrounded by 3s traps 3 - 1 = 2 units.' },
    ],
    hiddenCases: [
      { input: '1 1\n5' },
      { input: '2 2\n1 2\n3 4' },
      { input: '3 3\n1 1 1\n1 1 1\n1 1 1' },
      { input: '4 4\n5 5 5 5\n5 1 1 5\n5 1 1 5\n5 5 5 5' },
      { input: '5 5\n9 9 9 9 9\n9 1 1 1 9\n9 1 5 1 9\n9 1 1 1 9\n9 9 9 9 9' },
      { input: '3 4\n3 3 3 3\n3 0 0 3\n3 3 3 3' },
      { input: '4 4\n12 13 1 12\n13 4 13 12\n13 8 10 12\n12 13 12 12' },
      { input: '3 5\n5 5 5 5 5\n5 2 1 2 5\n5 5 5 5 5' },
    ],
    solutionCode: `
import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    if n <= 2 or m <= 2:
        print(0)
        return
        
    grid = []
    idx = 2
    for _ in range(n):
        grid.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    visited = [[False] * m for _ in range(n)]
    pq = []
    
    for r in range(n):
        for c in (0, m - 1):
            heapq.heappush(pq, (grid[r][c], r, c))
            visited[r][c] = True
    for c in range(1, m - 1):
        for r in (0, n - 1):
            heapq.heappush(pq, (grid[r][c], r, c))
            visited[r][c] = True
            
    water = 0
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while pq:
        h, r, c = heapq.heappop(pq)
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and not visited[nr][nc]:
                visited[nr][nc] = True
                if grid[nr][nc] < h:
                    water += h - grid[nr][nc]
                heapq.heappush(pq, (max(grid[nr][nc], h), nr, nc))
                
    print(water)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Modified Dijkstra's algorithm from boundaries inward: maintain a min-heap boundary and accumulate trapped volume.",
      timeComplexity: 'O(N * M log(N * M))',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv212: Grand Finale - Alien Dictionary Topological Order (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv212',
    slug: 'alien-dictionary-topological-order',
    title: 'The Xenolinguistic Alien Alphabet Decoder',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `An alien civilization uses an unknown alphabet of lowercase English letters.
You are given a list of words from the alien language's dictionary, where the strings are sorted lexicographically by the rules of this new language.

Derive the order of letters in this language.
If multiple valid orders exist, return the lexicographically smallest order.
If no valid order exists (due to a contradiction or cyclic dependency), return INVALID.`,
    inputFormat: 'First line: Integer N (number of words).\nNext N lines: A single word on each line.',
    outputFormat: 'Print the alphabet order as a string, or INVALID.',
    constraints: '1 <= N <= 100\n1 <= len(word) <= 100',
    sampleCases: [
      { input: '5\nwrt\nwrf\ner\nett\nrftt', expectedOutput: 'wertf', explanation: 'Unique alien alphabet order: "wertf".' },
      { input: '2\nz\nx', expectedOutput: 'zx', explanation: 'z precedes x.' },
    ],
    hiddenCases: [
      { input: '2\nz\nz' },
      { input: '3\nz\nx\nz' },
      { input: '2\nabc\nab' },
      { input: '3\nbaa\nabcd\nabca' },
      { input: '1\nabc' },
      { input: '4\nca\ncb\nba\nbb' },
      { input: '3\nx\ny\nz' },
      { input: '2\napple\napp' },
    ],
    solutionCode: `
import sys
import heapq
from collections import defaultdict

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    words = lines[1:1+n]
    
    unique_chars = set(''.join(words))
    adj = defaultdict(set)
    in_degree = {c: 0 for c in unique_chars}
    
    for i in range(n - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        if len(w1) > len(w2) and w1.startswith(w2):
            print("INVALID") # Prefix violation
            return
        for j in range(min_len):
            if w1[j] != w2[j]:
                if w2[j] not in adj[w1[j]]:
                    adj[w1[j]].add(w2[j])
                    in_degree[w2[j]] += 1
                break
                
    pq = [c for c in unique_chars if in_degree[c] == 0]
    heapq.heapify(pq)
    
    res = []
    while pq:
        curr = heapq.heappop(pq)
        res.append(curr)
        for nxt in adj[curr]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0:
                heapq.heappush(pq, nxt)
                
    if len(res) == len(unique_chars):
        print(''.join(res))
    else:
        print("INVALID")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Construct directed graph of lexicographical constraints between adjacent words, then perform Kahn's topological sort.",
      timeComplexity: 'O(total_characters)',
      spaceComplexity: 'O(unique_characters + constraints)',
    },
  },

  // --------------------------------------------------------------------------
  // cv213: Grand Finale - Shortest Distance from All Buildings (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv213',
    slug: 'shortest-distance-from-all-buildings',
    title: 'The Optimal City Hall Civic Center Location',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You want to build a house on an empty land that reaches all buildings in the shortest total travel distance. You can only move up, down, left, and right.
You are given an N x M grid of values 0, 1, or 2, where:
- 0 represents an empty land that you can pass by freely.
- 1 represents a building that you cannot pass through.
- 2 represents an obstacle that you cannot pass through.

Return the minimum total travel distance to build the house. If it is not possible to build such a house, return -1.`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated integers (0, 1, or 2).',
    outputFormat: 'Print the minimum total travel distance or -1.',
    constraints: '1 <= N, M <= 50\nAt least one building (1) exists.',
    sampleCases: [
      { input: '3 5\n1 0 2 0 1\n0 0 0 0 0\n0 0 1 0 0', expectedOutput: '7', explanation: 'Location (1, 2) has distances 3 + 3 + 1 = 7 to the 3 buildings.' },
      { input: '1 2\n1 0', expectedOutput: '1', explanation: 'Distance 1.' },
    ],
    hiddenCases: [
      { input: '1 1\n1' },
      { input: '1 3\n1 0 1' },
      { input: '1 3\n1 2 1' },
      { input: '3 3\n1 0 0\n0 0 0\n0 0 1' },
      { input: '3 3\n1 2 0\n0 0 0\n0 2 1' },
      { input: '4 4\n1 0 0 1\n0 0 0 0\n0 0 0 0\n1 0 0 1' },
      { input: '2 2\n1 0\n0 1' },
      { input: '3 3\n1 1 1\n1 0 1\n1 1 1' },
    ],
    solutionCode: `
import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    grid = []
    idx = 2
    buildings = []
    
    for r in range(n):
        row = [int(x) for x in data[idx:idx+m]]
        grid.append(row)
        for c in range(m):
            if row[c] == 1:
                buildings.append((r, c))
        idx += m
        
    num_buildings = len(buildings)
    dist_sum = [[0] * m for _ in range(n)]
    reach_count = [[0] * m for _ in range(n)]
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    for br, bc in buildings:
        visited = [[False] * m for _ in range(n)]
        q = deque([(br, bc, 0)])
        visited[br][bc] = True
        
        while q:
            r, c, d = q.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < m and not visited[nr][nc]:
                    visited[nr][nc] = True
                    if grid[nr][nc] == 0:
                        dist_sum[nr][nc] += (d + 1)
                        reach_count[nr][nc] += 1
                        q.append((nr, nc, d + 1))
                        
    min_dist = float('inf')
    for r in range(n):
        for c in range(m):
            if grid[r][c] == 0 and reach_count[r][c] == num_buildings:
                min_dist = min(min_dist, dist_sum[r][c])
                
    print(min_dist if min_dist != float('inf') else -1)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'BFS from each building accumulating distance and reachability count into empty cells.',
      timeComplexity: 'O(buildings * N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv214: Grand Finale - Minimum Cost to Make Valid Grid Path (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv214',
    slug: 'minimum-cost-to-make-valid-grid-path',
    title: 'The Directional Signpost Reorientation Cost',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Given an N x M grid. Each cell has a sign pointing to the next cell you should visit:
- 1: points to the cell on the right.
- 2: points to the cell on the left.
- 3: points to the cell on the lower side.
- 4: points to the cell on the upper side.

You can modify the sign on a cell with a cost of 1.
Find the minimum cost to make at least one valid path from (0, 0) to (N - 1, M - 1).`,
    inputFormat: 'First line: Two integers N and M.\nNext N lines: M space-separated integers (1, 2, 3, or 4).',
    outputFormat: 'Print the minimum cost.',
    constraints: '1 <= N, M <= 100',
    sampleCases: [
      { input: '4 4\n1 1 1 1\n2 2 2 2\n1 1 1 1\n2 2 2 2', expectedOutput: '3', explanation: 'Change 3 signs to reach bottom-right.' },
      { input: '1 1\n1', expectedOutput: '0', explanation: 'Already at destination.' },
    ],
    hiddenCases: [
      { input: '1 2\n1 1' },
      { input: '1 2\n2 1' },
      { input: '2 2\n1 3\n2 4' },
      { input: '3 3\n1 1 3\n3 2 2\n1 1 4' },
      { input: '3 3\n1 2 3\n4 1 2\n3 4 1' },
      { input: '2 3\n1 1 3\n3 2 2' },
      { input: '4 1\n3\n3\n3\n1' },
      { input: '3 4\n1 1 1 3\n2 2 2 3\n1 1 1 1' },
    ],
    solutionCode: `
import sys
from collections import deque

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
        
    # Directions: 1=R, 2=L, 3=D, 4=U
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    dist = [[float('inf')] * m for _ in range(n)]
    dist[0][0] = 0
    # 0-1 BFS using double-ended queue
    q = deque([(0, 0)])
    
    while q:
        r, c = q.popleft()
        if r == n - 1 and c == m - 1:
            print(dist[r][c])
            return
            
        sign = grid[r][c] - 1
        for i, (dr, dc) in enumerate(dirs):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m:
                cost = 0 if i == sign else 1
                if dist[r][c] + cost < dist[nr][nc]:
                    dist[nr][nc] = dist[r][c] + cost
                    if cost == 0:
                        q.appendleft((nr, nc))
                    else:
                        q.append((nr, nc))
                        
    print(dist[n - 1][m - 1])

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: '0-1 Breadth-First Search using deque: edge weight is 0 if matching the cell sign, 1 otherwise.',
      timeComplexity: 'O(N * M)',
      spaceComplexity: 'O(N * M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv215: Grand Finale - Sliding Window Median Dual Heaps (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv215',
    slug: 'sliding-window-median-dual-heaps',
    title: 'The Continuous Stream Window Median',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are given an integer array nums and an integer K.
There is a sliding window of size K which is moving from the very left of the array to the very right.
You can only see the K numbers in the window. Each time the sliding window moves right by one position.

Return the median of each sliding window formatted to exactly 1 decimal place separated by spaces.`,
    inputFormat: 'First line: Two integers N and K.\nSecond line: N space-separated integers.',
    outputFormat: 'Print the space-separated medians.',
    constraints: '1 <= K <= N <= 10000\n-2^31 <= nums[i] <= 2^31 - 1',
    sampleCases: [
      { input: '8 3\n1 3 -1 -3 5 3 6 7', expectedOutput: '1.0 -1.0 -1.0 3.0 5.0 6.0', explanation: 'Window medians formatted to 1 decimal place.' },
      { input: '1 1\n100', expectedOutput: '100.0', explanation: 'Single element median.' },
    ],
    hiddenCases: [
      { input: '4 2\n1 2 3 4' },
      { input: '5 4\n1 2 3 4 5' },
      { input: '6 3\n5 2 3 1 4 6' },
      { input: '4 4\n1 1 1 1' },
      { input: '5 1\n5 4 3 2 1' },
      { input: '7 5\n10 20 30 40 50 60 70' },
      { input: '6 2\n-1 -2 -3 -4 -5 -6' },
      { input: '5 3\n1 4 2 8 5' },
    ],
    solutionCode: `
import sys
import bisect

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    window = sorted(nums[:k])
    medians = []
    
    def get_med():
        if k % 2 == 1:
            return float(window[k // 2])
        else:
            return (window[k // 2 - 1] + window[k // 2]) / 2.0
            
    medians.append(f"{get_med():.1f}")
    
    for i in range(k, n):
        # Remove nums[i - k]
        rem_idx = bisect.bisect_left(window, nums[i - k])
        window.pop(rem_idx)
        # Insert nums[i]
        bisect.insort(window, nums[i])
        medians.append(f"{get_med():.1f}")
        
    print(' '.join(medians))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Sliding window using bisect insort and binary search deletion in O(K) per step.',
      timeComplexity: 'O(N * K)',
      spaceComplexity: 'O(K)',
    },
  },

  // --------------------------------------------------------------------------
  // cv216: Grand Finale - Maximum Frequency Stack (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv216',
    slug: 'maximum-frequency-stack-pop',
    title: 'The Multi-Tier Frequency Priority Stack',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `Design a stack-like data structure to push elements to the stack and pop the most frequent element from the stack.
Implement the FreqStack:
- push(val): Pushes integer val onto the stack.
- pop(): Removes and returns the most frequent element in the stack.
If there is a tie for the most frequent element, the element closest to the top of the stack is removed and returned.

Given M operations (either "PUSH val" or "POP"), execute them and print the results of all POP operations on separate lines.`,
    inputFormat: 'First line: Integer M.\nNext M lines: Either "PUSH val" or "POP".',
    outputFormat: 'Print the popped value for each POP command.',
    constraints: '1 <= M <= 10000\n0 <= val <= 10^9',
    sampleCases: [
      { input: '8\nPUSH 5\nPUSH 7\nPUSH 5\nPUSH 7\nPUSH 4\nPUSH 5\nPOP\nPOP', expectedOutput: '5\n7', explanation: '5 has frequency 3, then 7 has frequency 2 closest to top.' },
      { input: '4\nPUSH 1\nPUSH 2\nPOP\nPOP', expectedOutput: '2\n1', explanation: 'LIFO order on frequency ties.' },
    ],
    hiddenCases: [
      { input: '2\nPUSH 42\nPOP' },
      { input: '6\nPUSH 1\nPUSH 1\nPUSH 1\nPOP\nPOP\nPOP' },
      { input: '6\nPUSH 1\nPUSH 2\nPUSH 1\nPUSH 2\nPOP\nPOP' },
      { input: '8\nPUSH 10\nPUSH 20\nPUSH 30\nPUSH 20\nPUSH 10\nPOP\nPOP\nPOP' },
      { input: '5\nPUSH 5\nPUSH 5\nPOP\nPUSH 5\nPOP' },
      { input: '7\nPUSH 3\nPUSH 2\nPUSH 1\nPUSH 1\nPOP\nPOP\nPOP' },
      { input: '6\nPUSH 100\nPUSH 200\nPUSH 300\nPOP\nPOP\nPOP' },
      { input: '6\nPUSH 7\nPUSH 7\nPUSH 8\nPOP\nPUSH 8\nPOP' },
    ],
    solutionCode: `
import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    m = int(data[0])
    
    freq = defaultdict(int)
    group = defaultdict(list)
    max_freq = 0
    
    idx = 1
    for _ in range(m):
        cmd = data[idx]
        if cmd == 'PUSH':
            val = int(data[idx+1])
            idx += 2
            f = freq[val] + 1
            freq[val] = f
            if f > max_freq:
                max_freq = f
            group[f].append(val)
        else: # POP
            idx += 1
            val = group[max_freq].pop()
            freq[val] -= 1
            if not group[max_freq]:
                max_freq -= 1
            print(val)

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Frequency stack data structure: map frequency f to a stack of elements that have reached frequency f.',
      timeComplexity: 'O(1) per push and pop operation',
      spaceComplexity: 'O(M)',
    },
  },

  // --------------------------------------------------------------------------
  // cv217: Grand Finale - Swim in Rising Water (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv217',
    slug: 'swim-in-rising-water-elevation',
    title: 'The Torrential Rising Water Traverse',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are given an N x N integer matrix grid where each cell represents the elevation at that point (r, c).
The rain starts to fall. At time t, the depth of the water everywhere is t. You can swim from a square to another 4-directionally adjacent square if and only if the elevation of both squares individually are at most t.
You can swim infinite distance in zero time.
Return the least time until you can reach the bottom right square (N - 1, N - 1) starting from the top left square (0, 0).`,
    inputFormat: 'First line: Integer N.\nNext N lines: N space-separated integers.',
    outputFormat: 'Print the minimum time.',
    constraints: '1 <= N <= 50\n0 <= grid[r][c] < N^2\nValues are a permutation of [0, N^2 - 1].',
    sampleCases: [
      { input: '2\n0 2\n1 3', expectedOutput: '3', explanation: 'At time 3, grid levels are accessible to reach (1, 1).' },
      { input: '5\n0 1 2 3 4\n24 23 22 21 5\n12 13 14 15 16\n11 17 18 19 20\n10 9 8 7 6', expectedOutput: '16', explanation: 'Follows spiral path at time 16.' },
    ],
    hiddenCases: [
      { input: '1\n0' },
      { input: '3\n0 1 2\n3 4 5\n6 7 8' },
      { input: '3\n8 7 6\n5 4 3\n2 1 0' },
      { input: '4\n0 1 2 3\n7 6 5 4\n8 9 10 11\n15 14 13 12' },
      { input: '2\n0 1\n2 3' },
      { input: '2\n3 2\n1 0' },
      { input: '3\n0 5 6\n1 4 7\n2 3 8' },
      { input: '3\n0 3 6\n1 4 7\n2 5 8' },
    ],
    solutionCode: `
import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    grid = []
    idx = 1
    for _ in range(n):
        grid.append([int(x) for x in data[idx:idx+n]])
        idx += n
        
    pq = [(grid[0][0], 0, 0)]
    visited = [[False] * n for _ in range(n)]
    visited[0][0] = True
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    ans = 0
    
    while pq:
        h, r, c = heapq.heappop(pq)
        ans = max(ans, h)
        if r == n - 1 and c == n - 1:
            print(ans)
            return
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                visited[nr][nc] = True
                heapq.heappush(pq, (grid[nr][nc], nr, nc))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: "Modified Dijkstra's algorithm: find a path from (0,0) to (N-1,N-1) that minimizes the maximum cell elevation along the path.",
      timeComplexity: 'O(N^2 log N)',
      spaceComplexity: 'O(N^2)',
    },
  },

  // --------------------------------------------------------------------------
  // cv218: Grand Finale - Tallest Billboard Support DP (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv218',
    slug: 'tallest-billboard-support-dp',
    title: 'The Great Billboard Equal Steel Pillars',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `You are installing a billboard and want it to have the largest height. The billboard will have two steel supports, one on each side. Each support must be an equal height.
You are given an array of rods which can be welded together (e.g. rods 1, 2, 3 can be welded to length 6).
You cannot break rods.
Return the largest possible height of your billboard installation. If you cannot support the billboard, return 0.`,
    inputFormat: 'First line: Integer N.\nSecond line: N space-separated integers representing rod lengths.',
    outputFormat: 'Print the maximum equal height.',
    constraints: '1 <= N <= 20\n1 <= Rod_i <= 1000\nsum(rods) <= 5000',
    sampleCases: [
      { input: '4\n1 2 3 6', expectedOutput: '6', explanation: 'We have two disjoint subsets with equal sum 6: [1, 2, 3] and [6].' },
      { input: '6\n1 2 3 4 5 6', expectedOutput: '10', explanation: '[2, 3, 5] and [4, 6] both sum to 10.' },
    ],
    hiddenCases: [
      { input: '1\n5' },
      { input: '2\n1 2' },
      { input: '2\n5 5' },
      { input: '3\n1 2 3' },
      { input: '5\n1 2 4 8 16' },
      { input: '4\n1 1 1 1' },
      { input: '5\n2 4 6 8 10' },
      { input: '6\n10 20 30 40 50 60' },
    ],
    solutionCode: `
import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    rods = [int(x) for x in data[1:1+n]]
    
    # dp[diff] = max height of the shorter rod
    dp = {0: 0}
    
    for r in rods:
        curr = dict(dp)
        for diff, shorter in curr.items():
            # Option 1: add to taller rod
            d1 = diff + r
            dp[d1] = max(dp.get(d1, 0), shorter)
            
            # Option 2: add to shorter rod
            d2 = abs(diff - r)
            s2 = shorter + min(diff, r)
            dp[d2] = max(dp.get(d2, 0), s2)
            
    print(dp.get(0, 0))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Difference-tracking Dynamic Programming: dp[diff] stores the maximum height of the shorter support when the difference between the two supports is diff.',
      timeComplexity: 'O(N * sum(rods))',
      spaceComplexity: 'O(sum(rods))',
    },
  },

  // --------------------------------------------------------------------------
  // cv219: Grand Finale - Cracking the Safe De Bruijn (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv219',
    slug: 'cracking-the-safe-de-bruijn',
    title: 'The Vault Lock De Bruijn Sequence Master',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `There is a safe protected by a password of N digits. Each digit can be one of the first K digits: 0, 1, ..., K - 1.
The safe unlocks if any contiguous substring of length N entered into the key vault matches the password.
Return any sequence of digits of minimal length that is guaranteed to open the safe (a De Bruijn sequence B(K, N)).`,
    inputFormat: 'Two integers N and K.',
    outputFormat: 'Print the minimal length digit string.',
    constraints: '1 <= N <= 4\n1 <= K <= 10\nK^N <= 4096',
    sampleCases: [
      { input: '1 2', expectedOutput: '01', explanation: '"01" contains all length 1 combinations of 2 digits.' },
      { input: '2 2', expectedOutput: '00110', explanation: '"00110" contains 00, 01, 11, 10.' },
    ],
    hiddenCases: [
      { input: '1 1' },
      { input: '2 1' },
      { input: '3 2' },
      { input: '4 2' },
      { input: '1 3' },
      { input: '2 3' },
      { input: '3 3' },
      { input: '2 4' },
    ],
    solutionCode: `
import sys

sys.setrecursionlimit(10000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    
    if n == 1:
        print(''.join(str(i) for i in range(k)))
        return
        
    visited = set()
    ans = []
    
    def dfs(node):
        for x in range(k):
            edge = node + str(x)
            if edge not in visited:
                visited.add(edge)
                dfs(edge[1:])
                ans.append(str(x))
                
    start_node = '0' * (n - 1)
    dfs(start_node)
    
    # Reverse post-order plus starting prefix
    print(start_node + ''.join(reversed(ans)))

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'Hierholzer Eulerian Circuit on a De Bruijn graph with K^(N-1) vertices and K out-degree per node.',
      timeComplexity: 'O(K^N)',
      spaceComplexity: 'O(K^N)',
    },
  },

  // --------------------------------------------------------------------------
  // cv220: Grand Finale - CodeVita Grand Championship Tally (HARD)
  // --------------------------------------------------------------------------
  {
    id: 'cv220',
    slug: 'codevita-grand-championship-tally',
    title: 'The TCS CodeVita Grand Finale Scoreboard',
    difficulty: 'HARD',
    topics: ['Grand Finale Challenges'],
    timeLimitMs: 1500,
    memoryLimitKb: 262144,
    statement: `In the TCS CodeVita Grand Finale, P participants compete over multiple challenging problems.
Each submission record has:
- Username (string)
- ProblemCode (string)
- Verdict ('AC' for Accepted, 'WA' for Wrong Answer)
- TimeMinutes (integer, time from start)

Contest rules:
1. A problem is solved if a participant receives 'AC'.
2. The penalty for a solved problem is TimeMinutes of the FIRST 'AC' + 20 * (number of rejected submissions BEFORE that first AC).
3. If a problem is never solved by the participant, rejected submissions do not contribute to penalty.
4. Total score is the number of distinct problems solved.
5. Leaderboard sorting:
   - Primary: Solved problems count DESCENDING.
   - Secondary: Total penalty ASCENDING.
   - Tertiary: Username ASCENDING (lexicographical).

Print the final rankings formatted as: Rank Username SolvedCount TotalPenalty.`,
    inputFormat: 'First line: Integer S (number of submissions).\nNext S lines: Username ProblemCode Verdict TimeMinutes.',
    outputFormat: 'Print ranked participant lines: Rank Username Solved Penalty.',
    constraints: '1 <= S <= 5000\n1 <= TimeMinutes <= 360',
    sampleCases: [
      { input: '4\nAlice P1 AC 30\nBob P1 WA 20\nBob P1 AC 40\nAlice P2 WA 50', expectedOutput: '1 Bob 1 60\n2 Alice 1 30', explanation: 'Wait: Alice has 1 AC at 30 min (penalty 30). Bob has 1 AC at 40 min + 20 penalty = 60. Alice has penalty 30 < 60, so Alice is rank 1.' },
      { input: '2\nCharlie P1 AC 10\nDavid P1 AC 10', expectedOutput: '1 Charlie 1 10\n2 David 1 10', explanation: 'Tied on solved and penalty, broken lexicographically by username.' },
    ],
    hiddenCases: [
      { input: '1\nAlice P1 AC 15' },
      { input: '3\nAlice P1 WA 10\nAlice P1 WA 20\nAlice P1 AC 30' },
      { input: '3\nBob P1 WA 10\nBob P1 WA 20\nBob P1 WA 30' },
      { input: '4\nDev P1 AC 20\nDev P2 AC 30\nRaj P1 AC 10\nRaj P2 WA 15' },
      { input: '5\nUserA P1 AC 10\nUserB P1 AC 10\nUserC P1 AC 10\nUserA P2 AC 20\nUserB P2 AC 25' },
      { input: '2\nZeta P1 AC 100\nAlpha P1 AC 100' },
      { input: '4\nA P1 AC 10\nB P1 AC 10\nC P1 AC 10\nD P1 AC 10' },
      { input: '6\nSam P1 WA 5\nSam P1 AC 10\nSam P2 WA 15\nSam P2 AC 20\nMax P1 AC 5\nMax P2 AC 25' },
    ],
    solutionCode: `
import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = int(data[0])
    
    # Track per-user, per-problem state
    # user -> problem -> {'solved': bool, 'wa_before': int, 'time': int}
    user_prob = defaultdict(lambda: defaultdict(lambda: {'solved': False, 'wa_before': 0, 'time': 0}))
    all_users = set()
    
    idx = 1
    for _ in range(s):
        user = data[idx]
        prob = data[idx+1]
        verdict = data[idx+2]
        t = int(data[idx+3])
        idx += 4
        
        all_users.add(user)
        entry = user_prob[user][prob]
        if entry['solved']:
            continue # Submissions after first AC are ignored
        if verdict == 'AC':
            entry['solved'] = True
            entry['time'] = t
        else:
            entry['wa_before'] += 1
            
    leaderboard = []
    for user in all_users:
        solved_count = 0
        total_penalty = 0
        for prob, info in user_prob[user].items():
            if info['solved']:
                solved_count += 1
                total_penalty += info['time'] + 20 * info['wa_before']
        leaderboard.append((solved_count, total_penalty, user))
        
    # Sort: solved DESC, penalty ASC, username ASC
    leaderboard.sort(key=lambda x: (-x[0], x[1], x[2]))
    
    for rank, (solved, penalty, user) in enumerate(leaderboard, 1):
        print(f"{rank} {user} {solved} {penalty}")

if __name__ == '__main__':
    solve()
`,
    editorial: {
      approach: 'CodeVita contest scoreboard simulation: track AC status and pre-AC penalty per problem, aggregate user totals, and apply 3-key tiebreak sorting.',
      timeComplexity: 'O(S + P log P)',
      spaceComplexity: 'O(S + P)',
    },
  },
];

console.log(`Writing Batch 10 (${problems.length} problems)...`);
problems.forEach((p) => {
  console.log(`Generating: ${p.id}`);
  createProblem(p);
});
console.log('✅ Batch 10 written successfully!');
