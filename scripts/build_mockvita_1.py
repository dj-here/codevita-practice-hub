import os
import json
import bisect
import heapq
from collections import deque, defaultdict

REPO_ROOT = r'C:\Users\Deepak joshi\Downloads\codevita-practice-hub'
PROBLEMS_DIR = os.path.join(REPO_ROOT, 'content', 'problems')

# ----------------- SOLVERS -----------------

def solve_tom_and_jerry(input_text):
    tokens = input_text.split()
    if not tokens: return ''
    it = iter(tokens)
    T = int(next(it))
    out = []
    for _ in range(T):
        N = int(next(it))
        M = int(next(it))
        adj = defaultdict(list)
        for _ in range(M):
            u = int(next(it))
            v = int(next(it))
            adj[u].append(v)
            adj[v].append(u)
        out_degree = {}
        for j in range(N):
            for t in range(N):
                out_degree[(0, j, t)] = len(adj[j])
                tom_moves = [v for v in adj[t] if v != 0]
                out_degree[(1, j, t)] = len(tom_moves)
        color = {}
        q = deque()
        for t in range(N):
            for turn in (0, 1):
                color[(turn, 0, t)] = 1
                q.append(((turn, 0, t), 1))
        for j in range(1, N):
            for turn in (0, 1):
                color[(turn, j, j)] = 2
                q.append(((turn, j, j), 2))
        while q:
            (turn, j, t), win = q.popleft()
            if turn == 0:
                prev_turn = 1
                prev_states = [(prev_turn, j, pt) for pt in adj[t] if pt != 0]
            else:
                prev_turn = 0
                prev_states = [(prev_turn, pj, t) for pj in adj[j]]
            for prev in prev_states:
                if prev in color: continue
                pturn = prev[0]
                if (pturn == 0 and win == 1) or (pturn == 1 and win == 2):
                    color[prev] = win
                    q.append((prev, win))
                else:
                    out_degree[prev] -= 1
                    if out_degree[prev] == 0:
                        color[prev] = 2 if pturn == 0 else 1
                        q.append((prev, color[prev]))
        res = color.get((0, 1, 2), 0)
        out.append('JERRY' if res == 1 else ('TOM' if res == 2 else 'DRAW'))
    return '\n'.join(out)


def solve_grid_value(input_text):
    tokens = input_text.split()
    if not tokens: return ''
    it = iter(tokens)
    T = int(next(it))
    out = []
    for _ in range(T):
        N = int(next(it))
        M = int(next(it))
        countA = int(next(it))
        countB = int(next(it))
        if N < M:
            N, M = M, N
        memo = {}
        def dfs(pos, a, b, prev_row):
            if pos == N * M or (a == 0 and b == 0):
                return 0
            state = (pos, a, b, prev_row)
            if state in memo:
                return memo[state]
            c = pos % M
            best = dfs(pos + 1, a, b, prev_row[1:] + (0,))
            up = prev_row[0]
            left = prev_row[-1] if c > 0 else 0
            if a > 0:
                gain = 80
                if up == 1: gain += -40
                elif up == 2: gain += -10
                if left == 1: gain += -40
                elif left == 2: gain += -10
                best = max(best, gain + dfs(pos + 1, a - 1, b, prev_row[1:] + (1,)))
            if b > 0:
                gain = 50
                if up == 1: gain += -10
                elif up == 2: gain += 20
                if left == 1: gain += -10
                elif left == 2: gain += 20
                best = max(best, gain + dfs(pos + 1, a, b - 1, prev_row[1:] + (2,)))
            memo[state] = best
            return best
        out.append(str(dfs(0, countA, countB, tuple([0] * M))))
    return '\n'.join(out)


def solve_target_array(input_text):
    tokens = input_text.split()
    if not tokens: return ''
    it = iter(tokens)
    T = int(next(it))
    out = []
    for _ in range(T):
        N = int(next(it))
        target = [int(next(it)) for _ in range(N)]
        if N == 1:
            out.append('1' if target[0] == 1 else '0')
            continue
        total = sum(target)
        heap = [-x for x in target]
        heapq.heapify(heap)
        possible = True
        while True:
            largest = -heapq.heappop(heap)
            rest = total - largest
            if largest == 1 or rest == 1:
                break
            if rest <= 0 or largest <= rest:
                possible = False
                break
            new_val = largest % rest
            if new_val == 0:
                possible = False
                break
            total = rest + new_val
            heapq.heappush(heap, -new_val)
        out.append('1' if possible else '0')
    return '\n'.join(out)


def solve_towers(input_text):
    tokens = input_text.split()
    if not tokens: return ''
    it = iter(tokens)
    T = int(next(it))
    out = []
    for _ in range(T):
        N = int(next(it))
        tops = []
        for _ in range(N):
            x = int(next(it))
            idx = bisect.bisect_right(tops, x)
            if idx < len(tops):
                tops[idx] = x
            else:
                tops.append(x)
        out.append(str(len(tops)))
    return '\n'.join(out)


def solve_surajkund_mela_rides(input_text):
    tokens = input_text.split()
    if not tokens: return ''
    it = iter(tokens)
    T = int(next(it))
    out = []
    for _ in range(T):
        N = int(next(it))
        K = int(next(it))
        rides = []
        all_times = {0}
        for _ in range(N):
            s = int(next(it))
            e = int(next(it))
            rides.append((s, e))
            all_times.add(s)
            all_times.add(e)
            
        rides.sort(key=lambda x: (x[1], x[0]))
        coords = sorted(all_times)
        time_to_idx = {t: i for i, t in enumerate(coords)}
        M = len(coords)
        
        tree = [0] * (4 * M)
        def update(node, l, r, idx, val):
            if l == r:
                tree[node] += val
                return
            mid = (l + r) // 2
            if idx <= mid:
                update(2 * node, l, mid, idx, val)
            else:
                update(2 * node + 1, mid + 1, r, idx, val)
            tree[node] = tree[2 * node] + tree[2 * node + 1]
            
        def find_rightmost(node, l, r, ql, qr):
            if l > qr or r < ql or tree[node] == 0:
                return -1
            if l == r:
                return l
            mid = (l + r) // 2
            res = find_rightmost(2 * node + 1, mid + 1, r, ql, qr)
            if res != -1:
                return res
            return find_rightmost(2 * node, l, mid, ql, qr)
            
        update(1, 0, M - 1, time_to_idx[0], K)
        ans = 0
        for s, e in rides:
            s_idx = time_to_idx[s]
            e_idx = time_to_idx[e]
            free_idx = find_rightmost(1, 0, M - 1, 0, s_idx)
            if free_idx != -1:
                ans += 1
                update(1, 0, M - 1, free_idx, -1)
                update(1, 0, M - 1, e_idx, 1)
        out.append(str(ans))
    return '\n'.join(out)


class Dinic:
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.edges = []
    def add_edge(self, u, v, cap):
        self.adj[u].append(len(self.edges))
        self.edges.append([v, cap, 0])
        self.adj[v].append(len(self.edges))
        self.edges.append([u, 0, 0])
    def bfs(self, s, t, level):
        for i in range(self.n): level[i] = -1
        level[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for edge_idx in self.adj[u]:
                v, cap, flow = self.edges[edge_idx]
                if cap - flow > 0 and level[v] == -1:
                    level[v] = level[u] + 1
                    q.append(v)
        return level[t] != -1
    def dfs(self, u, t, pushed, level, ptr):
        if pushed == 0 or u == t: return pushed
        for cid in range(ptr[u], len(self.adj[u])):
            ptr[u] = cid
            edge_idx = self.adj[u][cid]
            v, cap, flow = self.edges[edge_idx]
            tr = cap - flow
            if level[u] + 1 != level[v] or tr == 0: continue
            push = self.dfs(v, t, min(pushed, tr), level, ptr)
            if push == 0: continue
            self.edges[edge_idx][2] += push
            self.edges[edge_idx ^ 1][2] -= push
            return push
        return 0
    def max_flow(self, s, t):
        flow = 0
        level = [-1] * self.n
        while self.bfs(s, t, level):
            ptr = [0] * self.n
            while True:
                pushed = self.dfs(s, t, float('inf'), level, ptr)
                if pushed == 0: break
                flow += pushed
        return flow

def solve_lucky_group(input_text):
    tokens = input_text.split()
    if not tokens: return ''
    it = iter(tokens)
    T = int(next(it))
    out = []
    for _ in range(T):
        N = int(next(it))
        M = int(next(it))
        grid = []
        for _ in range(N):
            row = [int(next(it)) for _ in range(M)]
            grid.append(row)
        TOTAL_NODES = 2 * N * M + 2
        S = 0
        T_SINK = TOTAL_NODES - 1
        dinic = Dinic(TOTAL_NODES)
        for r in range(N):
            for c in range(M):
                idx = r * M + c
                u_in = idx * 2 + 1
                u_out = idx * 2 + 2
                dinic.add_edge(u_in, u_out, 1)
                val = grid[r][c]
                if val == 0:
                    dinic.add_edge(S, u_in, 1)
                elif val == 3:
                    dinic.add_edge(u_out, T_SINK, 1)
                for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < N and 0 <= nc < M:
                        if grid[nr][nc] == val + 1:
                            v_in = (nr * M + nc) * 2 + 1
                            dinic.add_edge(u_out, v_in, 1)
        out.append(str(dinic.max_flow(S, T_SINK)))
    return '\n'.join(out)


# ----------------- PROBLEM DATA DEFINITIONS -----------------

problems = [
    {
        "id": "cv227",
        "slug": "cv227-tom-and-jerry",
        "title": "Tom and Jerry",
        "difficulty": "HARD",
        "topics": ["CodeVita Season 14 MockVita 1", "Graphs & Trees", "Game Theory"],
        "timeLimitMs": 1000,
        "memoryLimitKb": 262144,
        "statement": (
            "Tom and Jerry are playing a game. In this game, they are given an undirected graph of N vertices "
            "labelled from 0 to N - 1 and M edges. They take alternate turns starting with Jerry.\\n\\n"
            "At the beginning, Jerry is at node 1, Tom is at node 2 and there is a hole at node 0. In each turn, "
            "a player can move to any other node that has a direct edge with the node in which they are currently present, "
            "with the condition that Tom cannot move to node 0.\\n\\n"
            "The game can end in three ways:\\n"
            "1) If ever Tom occupies the same node as Jerry, Tom wins.\\n"
            "2) If ever Jerry reaches the hole (node 0), Jerry wins.\\n"
            "3) If any position is repeated, the game is a draw.\\n\\n"
            "Your task is to find who wins the game or if there is a draw between the two, assuming both players play optimally."
        ),
        "inputFormat": (
            "The first line contains T, the number of test cases.\\n"
            "For each test case:\\n"
            "The first line contains two integers N and M, denoting the number of vertices and edges.\\n"
            "The next M lines each contain two integers u and v, denoting an undirected edge between nodes u and v."
        ),
        "outputFormat": "For each testcase, print TOM if Tom wins, JERRY if Jerry wins, or DRAW if the game is a draw.",
        "constraints": "1 <= T <= 10\\n3 <= N <= 100\\n2 <= M <= 200\\n0 <= u, v < N, u != v",
        "solver": solve_tom_and_jerry,
        "sampleCases": [
            {
                "input": "1\n5 5\n0 3\n1 3\n2 3\n1 4\n2 4",
                "explanation": "In the first step Jerry (at node 1) has two options, node 4 and node 3. Tom (at node 2) also has two options, node 4 and node 3, so whichever node Jerry chooses, Tom will always catch him."
            },
            {
                "input": "1\n6 6\n1 5\n5 3\n5 4\n3 2\n4 2\n3 0",
                "explanation": "In the first step Jerry (at node 1) has only one option, node 5. Tom (at node 2) can go to node 3 or node 4 and plays so that Jerry can never safely reach node 0. Jerry and Tom keep moving back and forth, positions repeat, and the game is a draw."
            }
        ],
        "hiddenInputs": [
            # Case 1: Jerry reaches hole on step 1
            "1\n3 2\n1 0\n2 1",
            # Case 2: Tom catches Jerry directly on Tom's first turn
            "1\n3 2\n1 2\n2 0",
            # Case 3: Disconnected components / no path to hole
            "1\n4 2\n1 3\n2 3",
            # Case 4: Jerry can safely bypass Tom via alternate branch to hole
            "1\n6 6\n1 3\n3 0\n1 4\n4 0\n2 5\n5 2",
            # Case 5: Star graph centered at 3
            "1\n5 4\n0 3\n1 3\n2 3\n4 3",
            # Case 6: Multiple test cases combined
            "2\n5 5\n0 3\n1 3\n2 3\n1 4\n2 4\n6 6\n1 5\n5 3\n5 4\n3 2\n4 2\n3 0",
            # Case 7: Cycle graph with hole unreachable by Tom
            "1\n7 7\n0 3\n3 4\n4 1\n1 5\n5 6\n6 2\n2 4",
            # Case 8: Long corridor where Jerry can outrun Tom to node 0
            "1\n8 8\n1 3\n3 4\n4 0\n2 5\n5 6\n6 7\n7 4\n1 2"
        ],
        "solutionCode": '''import sys
from collections import deque, defaultdict

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    it = iter(input_data)
    try:
        T = int(next(it))
    except StopIteration:
        return
        
    for _ in range(T):
        N = int(next(it))
        M = int(next(it))
        adj = defaultdict(list)
        for _ in range(M):
            u = int(next(it))
            v = int(next(it))
            adj[u].append(v)
            adj[v].append(u)
            
        out_degree = {}
        for j in range(N):
            for t in range(N):
                out_degree[(0, j, t)] = len(adj[j])
                tom_moves = [v for v in adj[t] if v != 0]
                out_degree[(1, j, t)] = len(tom_moves)
                
        color = {}
        q = deque()
        
        # Base terminal cases:
        for t in range(N):
            for turn in (0, 1):
                color[(turn, 0, t)] = 1  # JERRY wins
                q.append(((turn, 0, t), 1))
                
        for j in range(1, N):
            for turn in (0, 1):
                color[(turn, j, j)] = 2  # TOM wins
                q.append(((turn, j, j), 2))
                
        while q:
            (turn, j, t), win = q.popleft()
            if turn == 0:
                prev_turn = 1
                prev_states = [(prev_turn, j, pt) for pt in adj[t] if pt != 0]
            else:
                prev_turn = 0
                prev_states = [(prev_turn, pj, t) for pj in adj[j]]
                
            for prev in prev_states:
                if prev in color:
                    continue
                pturn = prev[0]
                if (pturn == 0 and win == 1) or (pturn == 1 and win == 2):
                    color[prev] = win
                    q.append((prev, win))
                else:
                    out_degree[prev] -= 1
                    if out_degree[prev] == 0:
                        color[prev] = 2 if pturn == 0 else 1
                        q.append((prev, color[prev]))
                        
        res = color.get((0, 1, 2), 0)
        if res == 1:
            print("JERRY")
        elif res == 2:
            print("TOM")
        else:
            print("DRAW")

if __name__ == "__main__":
    solve()
''',
        "editorial": '''# Tom and Jerry - Editorial

## Problem Summary
Jerry starts at vertex 1, Tom starts at vertex 2, and a hole is located at vertex 0.
Jerry moves first, and players alternate moves along undirected graph edges.
Tom cannot enter vertex 0.
- Jerry wins if he enters vertex 0.
- Tom wins if he reaches the same vertex as Jerry.
- If a position repeats, the game is a `DRAW`.

## Approach: Retrograde Analysis on State Graphs
This problem is an instance of combinatorial game theory on graphs (similar to Cat and Mouse).
We model each game state as a tuple:
`(turn, jerry, tom)`
where:
- `turn = 0` (Jerry's move)
- `turn = 1` (Tom's move)
- `jerry` is Jerry's current vertex ($0 \\le jerry < N$)
- `tom` is Tom's current vertex ($0 \\le tom < N$, $tom \\ne 0$)

### State Colors / Winners
- `1` = `JERRY`
- `2` = `TOM`
- `0` = `DRAW` (unresolved / cycle)

### Retrograde BFS Algorithm
1. Initialize degrees for each state:
   - For Jerry's turn: out-degree equals number of neighbors of `jerry`.
   - For Tom's turn: out-degree equals number of neighbors of `tom` excluding vertex 0.
2. Queue terminal states:
   - `(turn, 0, tom)` is a win for Jerry (`1`).
   - `(turn, j, j)` with $j \\ge 1$ is a win for Tom (`2`).
3. Propagate backwards:
   - For a state `prev`, if the current player whose turn it is can move to a state where they win, `prev` is immediately marked as winning for that player and enqueued.
   - Otherwise, decrement `out_degree[prev]`. If all valid moves from `prev` lead to the opponent's victory (`out_degree[prev] == 0`), then `prev` is marked as a win for the opponent.
4. Any states that remain uncolored when the BFS queue is empty are drawn positions.

## Complexity
- **Time Complexity:** $O(N \\cdot M)$ states and edge transitions. With $N \\le 100$, execution takes $< 0.1$ seconds.
- **Space Complexity:** $O(N^2)$ to store state tables and BFS queue.
'''
    },

    {
        "id": "cv228",
        "slug": "cv228-grid-value",
        "title": "Grid Value",
        "difficulty": "MEDIUM",
        "topics": ["CodeVita Season 14 MockVita 1", "Dynamic Programming", "Matrices & Grids"],
        "timeLimitMs": 1000,
        "memoryLimitKb": 262144,
        "statement": (
            "You are given a grid of size N*M. There are two types of people: type 'A' and type 'B'. "
            "You are also given the maximum number of people of each type: countA is the number of 'A' type persons "
            "and countB is the number of 'B' type persons.\\n\\n"
            "The satisfaction of a person in the grid is determined as follows:\\n"
            "• The initial satisfaction of a person of type A is 80. It decreases by 20 for each neighbor living in adjacent cells.\\n"
            "• The initial satisfaction of a person of type B is 50. It increases by 10 for each neighbor living in adjacent cells.\\n\\n"
            "Your task is to determine the maximum possible total grid satisfaction.\\n\\n"
            "Note:\\n"
            "• You may choose exactly how many people you want to be present in the grid (at most countA of type A and at most countB of type B).\\n"
            "• A person can live in only one cell, and no more than one person can live in a cell.\\n"
            "• Two cells are said to be neighbors if the cells are adjacent and share a boundary."
        ),
        "inputFormat": (
            "The first line contains T, the number of test cases.\\n"
            "Each test case is one line with four integers: N M countA countB."
        ),
        "outputFormat": "For each test case print the maximum possible grid satisfaction.",
        "constraints": "1 <= T <= 10\\n1 <= N, M <= 6\\n0 <= countA, countB <= min(N*M, 6)",
        "solver": solve_grid_value,
        "sampleCases": [
            {
                "input": "1\n3 1 0 1",
                "explanation": "Here we can have only one person of type B. Since this person will have no neighbors, the satisfaction of this person will not change and we get the maximum grid value of 50."
            },
            {
                "input": "1\n2 2 1 2",
                "explanation": "Placing 1 person of type A and 2 persons of type B such that A has 1 B neighbor (80-20=60), and the two B persons share boundaries yields 60 + 70 + 60 = 190 maximum satisfaction."
            }
        ],
        "hiddenInputs": [
            # Case 1: 0 countA and 0 countB
            "1\n2 2 0 0",
            # Case 2: Only Type A persons isolated
            "1\n3 3 2 0",
            # Case 3: Only Type B persons clustered
            "1\n2 2 0 4",
            # Case 4: 1x1 grid with both available
            "1\n1 1 1 1",
            # Case 5: 3x2 grid with mix of A and B
            "1\n3 2 2 3",
            # Case 6: Full 2x3 grid
            "1\n2 3 3 3",
            # Case 7: Multiple test cases
            "2\n1 2 1 1\n3 1 1 1",
            # Case 8: Maximum dimensions 4x3
            "1\n4 3 4 4"
        ],
        "solutionCode": '''import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    it = iter(input_data)
    try:
        T = int(next(it))
    except StopIteration:
        return
        
    for _ in range(T):
        N = int(next(it))
        M = int(next(it))
        countA = int(next(it))
        countB = int(next(it))
        
        # Grid satisfaction is invariant under transposition; orient M <= N
        if N < M:
            N, M = M, N
            
        memo = {}
        def dfs(pos, a, b, prev_row):
            if pos == N * M or (a == 0 and b == 0):
                return 0
            state = (pos, a, b, prev_row)
            if state in memo:
                return memo[state]
                
            c = pos % M
            
            # Option 0: Leave cell empty
            best = dfs(pos + 1, a, b, prev_row[1:] + (0,))
            
            up = prev_row[0]
            left = prev_row[-1] if c > 0 else 0
            
            # Option 1: Place Type A (base 80, -20 per neighbor)
            if a > 0:
                gain = 80
                if up == 1: gain += -40
                elif up == 2: gain += -10
                if left == 1: gain += -40
                elif left == 2: gain += -10
                best = max(best, gain + dfs(pos + 1, a - 1, b, prev_row[1:] + (1,)))
                
            # Option 2: Place Type B (base 50, +10 per neighbor)
            if b > 0:
                gain = 50
                if up == 1: gain += -10
                elif up == 2: gain += 20
                if left == 1: gain += -10
                elif left == 2: gain += 20
                best = max(best, gain + dfs(pos + 1, a, b - 1, prev_row[1:] + (2,)))
                
            memo[state] = best
            return best
            
        init_row = tuple([0] * M)
        print(dfs(0, countA, countB, init_row))

if __name__ == "__main__":
    solve()
''',
        "editorial": '''# Grid Value - Editorial

## Problem Summary
Given an $N \\times M$ grid, place at most $countA$ people of Type A and $countB$ people of Type B:
- Type A initial satisfaction: 80, decreases by 20 for every adjacent neighbor.
- Type B initial satisfaction: 50, increases by 10 for every adjacent neighbor.
Maximize total satisfaction across all placed residents.

## Key Observations
When two neighbors are adjacent:
- A adjacent to A: each loses 20, total delta = $-40$.
- A adjacent to B: A loses 20, B gains 10, total delta = $-10$.
- B adjacent to B: each gains 10, total delta = $+20$.

Since $N, M \\le 6$ and $countA, countB \\le 6$, this is an optimal placement problem solvable by Profile Dynamic Programming / Memoized DFS.

## Dynamic Programming State
We fill cells in row-major order:
`dfs(pos, a_left, b_left, prev_row)`
- `pos`: current cell index $0 \\le pos < N \\times M$.
- `a_left`, `b_left`: remaining people available to place.
- `prev_row`: a tuple of length $M$ containing the occupants of the previous $M$ processed cells.

At each step `pos`, the cell above is `prev_row[0]`, and the cell to the left (if not on column 0) is `prev_row[-1]`. We consider three transitions:
1. Leave empty
2. Place Type A (if $a_{left} > 0$)
3. Place Type B (if $b_{left} > 0$)

## Complexity
- **Time Complexity:** At most $O(N \\cdot M \\cdot \\text{countA} \\cdot \\text{countB} \\cdot 3^M)$ states. With $M \\le 6$, this runs in $< 0.2$ seconds.
- **Space Complexity:** $O(\\text{number of states})$ for memoization table.
'''
    },

    {
        "id": "cv229",
        "slug": "cv229-create-target-array",
        "title": "Create Target Array",
        "difficulty": "HARD",
        "topics": ["CodeVita Season 14 MockVita 1", "Greedy & Heuristics", "Data Structures"],
        "timeLimitMs": 1000,
        "memoryLimitKb": 262144,
        "statement": (
            "You are given an array of integers. Starting with an array of 'N' elements consisting of all 1's, "
            "you need to create the given array. To do so, you can update any index of the current array with "
            "the sum of all elements present in the array.\\n\\n"
            "For example: consider the starting array [1, 1, 1]. You can update any index of this array with 3 "
            "(the sum of all elements of the current array).\\n\\n"
            "You can perform the above operation any number of times. Your task is to check if it is possible "
            "to get the target array from the starting array of all 1's or not."
        ),
        "inputFormat": (
            "The first line contains T, the number of test cases.\\n"
            "For each test case:\\n"
            "The first line contains N, the size of the array.\\n"
            "The second line contains N space-separated integers, representing the target array."
        ),
        "outputFormat": "For each test case print 1 if the target array can be created, otherwise print 0.",
        "constraints": "1 <= T <= 10\\n1 <= N <= 10^4\\n1 <= X <= 10^9 (X = each element of the target array)",
        "solver": solve_target_array,
        "sampleCases": [
            {
                "input": "2\n2\n2 3\n3\n1 3 6",
                "explanation": "First test case: starting array [1, 1], sum = 2. Putting the sum on index 0 gives [2, 1]. The sum is now 3; putting it on index 1 gives [2, 3], matching target. Second test case: cannot create [1, 3, 6] from [1, 1, 1]."
            },
            {
                "input": "2\n4\n4 1 1 7\n1\n2",
                "explanation": "First test case can be reduced backwards to [1, 1, 1, 1]. Second test case has N=1 with element 2, which cannot be formed from [1]."
            }
        ],
        "hiddenInputs": [
            # Case 1: N = 1, already 1
            "1\n1\n1",
            # Case 2: Already all 1's of size 3
            "1\n3\n1 1 1",
            # Case 3: Consecutive Fibonacci-like sums
            "1\n3\n9 3 5",
            # Case 4: Power of two single reduction
            "1\n2\n1 1000000000",
            # Case 5: Impossible parity / division failure
            "1\n3\n1 1 10",
            # Case 6: Larger valid target array
            "1\n5\n1 1 1 5 9",
            # Case 7: Target where rest equals 1
            "1\n2\n1 2",
            # Case 8: Multi-test case stress
            "3\n2\n3 5\n3\n8 5 3\n4\n1 1 1 2"
        ],
        "solutionCode": '''import sys
import heapq

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    it = iter(input_data)
    try:
        T = int(next(it))
    except StopIteration:
        return
        
    for _ in range(T):
        N = int(next(it))
        target = [int(next(it)) for _ in range(N)]
        
        if N == 1:
            print(1 if target[0] == 1 else 0)
            continue
            
        total = sum(target)
        heap = [-x for x in target]
        heapq.heapify(heap)
        
        possible = True
        while True:
            largest = -heapq.heappop(heap)
            rest = total - largest
            
            if largest == 1 or rest == 1:
                break
            if rest <= 0 or largest <= rest:
                possible = False
                break
                
            new_val = largest % rest
            if new_val == 0:
                possible = False
                break
                
            total = rest + new_val
            heapq.heappush(heap, -new_val)
            
        print(1 if possible else 0)

if __name__ == "__main__":
    solve()
''',
        "editorial": '''# Create Target Array - Editorial

## Problem Summary
Starting from an array of $N$ ones $[1, 1, \\dots, 1]$, at each step we can replace any single element with the current array sum. Determine whether a given target array can be reached.

## Working Backwards (Euclidean Reduction)
Forward simulation has branching factor $N$, making it intractable.
However, working backwards from the target array is strictly deterministic!

At the final state, the largest number in the array must have been the most recently placed sum.
Let:
- $\\text{largest} = \\max(\\text{target})$
- $\\text{rest} = \\sum(\\text{target}) - \\text{largest}$

Before that operation, the value was:
$$\\text{prev} = \\text{largest} - \\text{rest}$$

If $\\text{largest} > \\text{rest}$, the value must have undergone multiple additions if $\\text{rest} > 1$:
$$\\text{new\\_val} = \\text{largest} \\pmod{\\text{rest}}$$

### Special Edge Cases
1. $N = 1$: Valid if and only if target is $[1]$.
2. $\\text{largest} == 1$ or $\\text{rest} == 1$: Reached base state successfully $\\to 1$.
3. $\\text{rest} \\le 0$ or $\\text{largest} \\le \\text{rest}$: Reduction impossible $\\to 0$.
4. $\\text{new\\_val} == 0$: Impossible (elements must remain $\\ge 1$) $\\to 0$.

## Complexity
- **Time Complexity:** $O(N + k \\log N)$ where $k \\le \\log(\\max X)$ by Euclidean modulo reduction. Runs in $< 0.05$ seconds.
- **Space Complexity:** $O(N)$ for the max-heap.
'''
    },

    {
        "id": "cv230",
        "slug": "cv230-towers",
        "title": "Towers",
        "difficulty": "MEDIUM",
        "topics": ["CodeVita Season 14 MockVita 1", "Greedy & Heuristics", "Searching & Sorting"],
        "timeLimitMs": 1000,
        "memoryLimitKb": 262144,
        "statement": (
            "You are given 'N' cubes in an array 'ARR' in a certain order, and your task is to build towers using them.\\n\\n"
            "Whenever two cubes are on top of each other, the upper cube must be smaller than the lower cube.\\n\\n"
            "You must process the cubes in the given order. You can always either place the cube on top of an "
            "existing tower or begin a new tower. What is the minimum possible number of towers?\\n\\n"
            "For example: given N = 3, ARR[] = 3, 2, 1. The answer will be one because you can stack one over two over 3."
        ),
        "inputFormat": (
            "The first line contains T, the number of test cases.\\n"
            "For each test case:\\n"
            "The first line contains N, the number of cubes.\\n"
            "The second line contains N space-separated integers, the array ARR."
        ),
        "outputFormat": "For each test case print the minimum number of towers.",
        "constraints": "1 <= T <= 10\\n1 <= N <= 2 * 10^5\\n1 <= ARR[i] <= 10^9",
        "solver": solve_towers,
        "sampleCases": [
            {
                "input": "2\n3\n3 2 1\n3\n1 2 3",
                "explanation": "First test case: cubes 3, 2, 1 can all be stacked into a single tower because each cube is strictly smaller than the one below it. Second test case: cubes 1, 2, 3 are in ascending order, so each requires a new tower, giving 3 towers."
            },
            {
                "input": "2\n5\n7 9 8 7 6\n6\n5 4 5 4 6 5",
                "explanation": "In the first test case, the cubes can be placed into 2 towers: [9, 8, 7, 6] and [7]. In the second test case, 3 towers are formed."
            }
        ],
        "hiddenInputs": [
            # Case 1: Single cube
            "1\n1\n42",
            # Case 2: All identical cubes (each must be on its own tower)
            "1\n5\n5 5 5 5 5",
            # Case 3: Strictly decreasing sequence
            "1\n6\n10 8 6 4 2 1",
            # Case 4: Strictly increasing sequence
            "1\n6\n1 2 3 4 5 6",
            # Case 5: Alternating high and low values
            "1\n8\n10 1 9 2 8 3 7 4",
            # Case 6: Duplicate values intermixed
            "1\n7\n3 8 2 1 5 5 2",
            # Case 7: Multiple test cases with varying shapes
            "2\n4\n4 3 2 1\n4\n1 3 2 4",
            # Case 8: Large array with random values
            "1\n10\n15 20 12 18 10 25 14 30 11 9"
        ],
        "solutionCode": '''import sys
import bisect

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    it = iter(input_data)
    try:
        T = int(next(it))
    except StopIteration:
        return
        
    for _ in range(T):
        N = int(next(it))
        tops = []
        for _ in range(N):
            x = int(next(it))
            idx = bisect.bisect_right(tops, x)
            if idx < len(tops):
                tops[idx] = x
            else:
                tops.append(x)
        print(len(tops))

if __name__ == "__main__":
    solve()
''',
        "editorial": '''# Towers - Editorial

## Problem Summary
Given $N$ cubes in sequential order, place each cube on top of an existing tower or start a new tower.
Condition: An upper cube must be strictly smaller than the lower cube.
Minimize the total number of towers.

## Greedy Strategy & Patience Sorting
To minimize towers, when placing cube $x$, we should place it on top of an existing tower whose current top cube is strictly greater than $x$, and as small as possible (tightest fit).
- If no such tower top exists, $x$ must start a new tower.
- If one or more tower tops are $> x$, pick the smallest one and update its top to $x$.

Since the list of tower tops is always maintained in non-decreasing order:
- We can use binary search (`bisect_right`) to find the first top cube $> x$ in $O(\\log k)$ time.
- If found at index `idx`, replace `tops[idx] = x`.
- Otherwise, append $x$ to `tops`.

## Complexity
- **Time Complexity:** $O(N \\log N)$ per test case.
- **Space Complexity:** $O(N)$ to store tower tops.
'''
    },

    {
        "id": "cv231",
        "slug": "cv231-surajkund-mela-rides",
        "title": "Surajkund Mela Rides",
        "difficulty": "HARD",
        "topics": ["CodeVita Season 14 MockVita 1", "Greedy & Heuristics", "Interval Scheduling"],
        "timeLimitMs": 1500,
        "memoryLimitKb": 262144,
        "statement": (
            "India's one of the most prominent and much-awaited Surajkund Mela in Haryana has started. "
            "Ninja and his 'K' friends are going to this carnival. This carnival has 'N' amusement rides lined up, "
            "and each ride's starting and finishing time is given on the visiting card: [startTime, endTime].\\n\\n"
            "What is the maximum total number of rides the friends can take if they act optimally?\\n\\n"
            "A person can attend at most one ride at a time, and becomes free immediately at t = endTime, "
            "meaning they can attend another ride that starts at or after endTime."
        ),
        "inputFormat": (
            "The first line contains T, the number of test cases.\\n"
            "For each test case:\\n"
            "The first line contains two integers N and K.\\n"
            "The next N lines each contain two integers, startTime and endTime of a ride."
        ),
        "outputFormat": "For each testcase, print the maximum number of rides the friends can take.",
        "constraints": "1 <= T <= 10\\n1 <= K <= N <= 10^5\\n0 <= startTime <= endTime <= 10^9",
        "solver": solve_surajkund_mela_rides,
        "sampleCases": [
            {
                "input": "1\n3 2\n2 5\n2 3\n1 2",
                "explanation": "N = 3 and K = 2, and the [startTime, endTime] of the 3 rides are [1,2], [2,3], [2,5]. The 2 friends can attend all 3 rides: Friend 1 attends ride [1,2] at t = 1; Friend 2 attends ride [2,3] at t = 2; Friend 1 is free at t = 2 and now attends ride [2,5] at t = 2."
            },
            {
                "input": "1\n4 2\n2 12\n0 3\n1 2\n2 4",
                "explanation": "N = 4 and K = 2, and the rides are [2,12], [0,3], [1,2], [2,4]. The 2 friends can attend 3 rides: Friend 1 attends ride [0,3] at t = 0; Friend 2 attends ride [1,2] at t = 1; Friend 2 is free at t = 2 and now attends ride [2,4] at t = 2."
            }
        ],
        "hiddenInputs": [
            # Case 1: K >= N (can attend all)
            "1\n3 3\n1 4\n2 5\n3 6",
            # Case 2: K = 1 (classic single interval scheduling)
            "1\n4 1\n1 3\n2 5\n3 9\n6 8",
            # Case 3: Completely non-overlapping intervals
            "1\n4 2\n0 1\n1 2\n2 3\n3 4",
            # Case 4: Completely overlapping intervals
            "1\n5 2\n1 10\n1 10\n1 10\n1 10\n1 10",
            # Case 5: Zero-duration rides
            "1\n4 1\n1 1\n1 2\n2 2\n2 3",
            # Case 6: Multiple test cases
            "2\n3 1\n1 2\n2 3\n3 4\n3 2\n1 5\n2 3\n3 4",
            # Case 7: High contention with 3 friends
            "1\n7 3\n1 4\n2 6\n3 5\n4 7\n5 8\n6 9\n7 10",
            # Case 8: Extended timeline with 2 friends
            "1\n8 2\n1 3\n2 5\n4 7\n6 9\n8 10\n9 11\n11 14\n12 15"
        ],
        "solutionCode": '''import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    it = iter(input_data)
    try:
        T = int(next(it))
    except StopIteration:
        return
        
    for _ in range(T):
        N = int(next(it))
        K = int(next(it))
        rides = []
        all_times = {0}
        for _ in range(N):
            s = int(next(it))
            e = int(next(it))
            rides.append((s, e))
            all_times.add(s)
            all_times.add(e)
            
        rides.sort(key=lambda x: (x[1], x[0]))
        coords = sorted(all_times)
        time_to_idx = {t: i for i, t in enumerate(coords)}
        M = len(coords)
        
        tree = [0] * (4 * M)
        def update(node, l, r, idx, val):
            if l == r:
                tree[node] += val
                return
            mid = (l + r) // 2
            if idx <= mid:
                update(2 * node, l, mid, idx, val)
            else:
                update(2 * node + 1, mid + 1, r, idx, val)
            tree[node] = tree[2 * node] + tree[2 * node + 1]
            
        def find_rightmost(node, l, r, ql, qr):
            if l > qr or r < ql or tree[node] == 0:
                return -1
            if l == r:
                return l
            mid = (l + r) // 2
            res = find_rightmost(2 * node + 1, mid + 1, r, ql, qr)
            if res != -1:
                return res
            return find_rightmost(2 * node, l, mid, ql, qr)
            
        # Initially K friends available at time 0
        update(1, 0, M - 1, time_to_idx[0], K)
        
        ans = 0
        for s, e in rides:
            s_idx = time_to_idx[s]
            e_idx = time_to_idx[e]
            free_idx = find_rightmost(1, 0, M - 1, 0, s_idx)
            if free_idx != -1:
                ans += 1
                update(1, 0, M - 1, free_idx, -1)
                update(1, 0, M - 1, e_idx, 1)
                
        print(ans)

if __name__ == "__main__":
    solve()
''',
        "editorial": '''# Surajkund Mela Rides - Editorial

## Problem Summary
Given $N$ rides with intervals $[startTime, endTime]$ and $K$ friends, find the maximum total number of rides the friends can collectively take.

## Greedy Strategy (Movie Festival II)
1. Sort all rides by their end time ascending: $(endTime, startTime)$.
2. For each ride $(s, e)$, we want to assign it to a friend who is currently free at some time $t \\le s$.
3. To leave the maximum room for other rides, we greedily pick the friend whose free time $t$ is **as close as possible to $s$** (i.e. the maximum $t \\le s$).

## Fast Implementation via Segment Tree
Since $K$ and $N$ can be up to $10^5$, maintaining a dynamic list with linear scans is too slow.
Instead:
- Coordinate compress all distinct times $\\{0\\} \\cup \\{s_i\\} \\cup \\{e_i\\}$ into at most $2N + 1$ indices.
- Build a Segment Tree over coordinates where each leaf stores the count of friends free at that coordinate.
- Query `find_rightmost(0, s_idx)` to find the largest coordinate $\\le s\\_idx$ with count $> 0$.
- Decrement count at that position and increment count at $e\\_idx$.

## Complexity
- **Time Complexity:** $O(N \\log N)$ for sorting and segment tree operations.
- **Space Complexity:** $O(N)$ for coordinate compression and segment tree.
'''
    },

    {
        "id": "cv232",
        "slug": "cv232-lucky-group",
        "title": "Lucky Group",
        "difficulty": "HARD",
        "topics": ["CodeVita Season 14 MockVita 1", "Graph Algorithms", "Max Flow & Network Matching"],
        "timeLimitMs": 1500,
        "memoryLimitKb": 262144,
        "statement": (
            "Ninja considers himself a master in solving sudoku. To test his problem-solving skills, one day his friend "
            "asked him to solve a problem based on a grid. The problem is as follows:\\n\\n"
            "There is a grid of 'N' rows and 'M' columns consisting of four digits 0, 1, 2 and 3. We call a four-cell group a "
            "'lucky group' if and only if:\\n"
            "1. The numbers on these cells form a permutation of the set {0, 1, 2, 3}.\\n"
            "2. The cell marked 1 is directly reachable from the cell marked 0.\\n"
            "3. The cell marked 2 is directly reachable from the cell marked 1.\\n"
            "4. The cell marked 3 is directly reachable from the cell marked 2.\\n\\n"
            "A cell is said to be directly reachable from another cell if they share one side.\\n"
            "Given the constraint that each cell can be part of at most 1 'lucky group', your task is to find the maximum "
            "number of 'lucky groups'."
        ),
        "inputFormat": (
            "The first line contains T, the number of test cases.\\n"
            "For each test case:\\n"
            "The first line contains two integers N and M.\\n"
            "The next N lines each contain M space-separated integers, the grid."
        ),
        "outputFormat": "For each testcase, print the maximum number of lucky groups.",
        "constraints": "1 <= T <= 5\\n1 <= N, M <= 20\\n0 <= cell[i][j] <= 3",
        "solver": solve_lucky_group,
        "sampleCases": [
            {
                "input": "2\n2 2\n0 1\n3 2\n2 4\n0 1 2 2\n0 2 3 3",
                "explanation": "In the first test case, cells (0,0) -> (0,1) -> (1,1) -> (1,0) form one lucky group. In the second test case, cells (0,0) -> (0,1) -> (0,2) -> (1,2) form one lucky group."
            },
            {
                "input": "2\n3 4\n0 1 0 1\n3 2 3 2\n3 0 1 3\n5 2\n0 1\n1 1\n2 3\n1 1\n0 0",
                "explanation": "In the first test case, two completely disjoint paths 0-1-2-3 can be formed. In the second test case, at most one lucky group can be selected."
            }
        ],
        "hiddenInputs": [
            # Case 1: 1x4 horizontal path
            "1\n1 4\n0 1 2 3",
            # Case 2: 4x1 vertical path
            "1\n4 1\n0\n1\n2\n3",
            # Case 3: Missing digit 3 (no lucky group possible)
            "1\n2 2\n0 1\n1 2",
            # Case 4: Multiple potential paths competing for same cell
            "1\n3 3\n0 1 0\n1 2 1\n0 3 0",
            # Case 5: 4x4 checkerboard style
            "1\n4 4\n0 1 2 3\n1 2 3 0\n2 3 0 1\n3 0 1 2",
            # Case 6: Disconnected 0s and 3s
            "1\n3 3\n0 0 0\n2 2 2\n3 3 3",
            # Case 7: 2 test cases with zigzag paths
            "2\n2 5\n0 1 2 3 0\n3 2 1 0 3\n3 3\n0 1 2\n3 2 1\n0 3 2",
            # Case 8: Full 5x5 grid with multiple disjoint lucky groups
            "1\n5 5\n0 1 2 3 0\n1 0 3 2 1\n2 3 0 1 2\n3 2 1 0 3\n0 1 2 3 0"
        ],
        "solutionCode": '''import sys
from collections import deque

class Dinic:
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.edges = []
        
    def add_edge(self, u, v, cap):
        self.adj[u].append(len(self.edges))
        self.edges.append([v, cap, 0])
        self.adj[v].append(len(self.edges))
        self.edges.append([u, 0, 0])
        
    def bfs(self, s, t, level):
        for i in range(self.n): level[i] = -1
        level[s] = 0
        q = deque([s])
        while q:
            u = q.popleft()
            for edge_idx in self.adj[u]:
                v, cap, flow = self.edges[edge_idx]
                if cap - flow > 0 and level[v] == -1:
                    level[v] = level[u] + 1
                    q.append(v)
        return level[t] != -1
        
    def dfs(self, u, t, pushed, level, ptr):
        if pushed == 0 or u == t:
            return pushed
        for cid in range(ptr[u], len(self.adj[u])):
            ptr[u] = cid
            edge_idx = self.adj[u][cid]
            v, cap, flow = self.edges[edge_idx]
            tr = cap - flow
            if level[u] + 1 != level[v] or tr == 0:
                continue
            push = self.dfs(v, t, min(pushed, tr), level, ptr)
            if push == 0:
                continue
            self.edges[edge_idx][2] += push
            self.edges[edge_idx ^ 1][2] -= push
            return push
        return 0
        
    def max_flow(self, s, t):
        flow = 0
        level = [-1] * self.n
        while self.bfs(s, t, level):
            ptr = [0] * self.n
            while True:
                pushed = self.dfs(s, t, float('inf'), level, ptr)
                if pushed == 0:
                    break
                flow += pushed
        return flow

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    it = iter(input_data)
    try:
        T = int(next(it))
    except StopIteration:
        return
        
    for _ in range(T):
        N = int(next(it))
        M = int(next(it))
        grid = []
        for _ in range(N):
            row = [int(next(it)) for _ in range(M)]
            grid.append(row)
            
        TOTAL_NODES = 2 * N * M + 2
        S = 0
        T_SINK = TOTAL_NODES - 1
        dinic = Dinic(TOTAL_NODES)
        
        for r in range(N):
            for c in range(M):
                idx = r * M + c
                u_in = idx * 2 + 1
                u_out = idx * 2 + 2
                dinic.add_edge(u_in, u_out, 1)
                
                val = grid[r][c]
                if val == 0:
                    dinic.add_edge(S, u_in, 1)
                elif val == 3:
                    dinic.add_edge(u_out, T_SINK, 1)
                    
                for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < N and 0 <= nc < M:
                        if grid[nr][nc] == val + 1:
                            v_in = (nr * M + nc) * 2 + 1
                            dinic.add_edge(u_out, v_in, 1)
                            
        print(dinic.max_flow(S, T_SINK))

if __name__ == "__main__":
    solve()
''',
        "editorial": '''# Lucky Group - Editorial

## Problem Summary
Given an $N \\times M$ grid with values in $\\{0, 1, 2, 3\\}$, find the maximum number of cell-disjoint paths of the form $0 \\to 1 \\to 2 \\to 3$ between orthogonally adjacent cells.

## Graph Modeling: Maximum Flow with Vertex Capacities
Every lucky group is a 4-vertex directed path $0 \\to 1 \\to 2 \\to 3$.
Because each cell can participate in at most one lucky group, each vertex has capacity 1.

We construct a flow network:
1. **Vertex Splitting:** For every cell $u = (r, c)$, split it into two nodes $u_{in}$ and $u_{out}$ connected by a directed edge $u_{in} \\to u_{out}$ with capacity 1.
2. **Source and Sink:**
   - Source $S \\to u_{in}$ for all cells where $grid[r][c] = 0$ with capacity 1.
   - $u_{out} \\to T$ (Sink) for all cells where $grid[r][c] = 3$ with capacity 1.
3. **Layer Transitions:**
   - For any adjacent cells $u$ and $v$ where $grid[v] = grid[u] + 1$, add directed edge $u_{out} \\to v_{in}$ with capacity 1.

The maximum number of cell-disjoint lucky groups is exactly the maximum flow from $S$ to $T$.

## Complexity
- **Time Complexity:** Using Dinic's Algorithm on a unit network with $V \\le 2 \\times 400 + 2 = 802$ and $E \\le 2400$, the flow runs in $O(E \\sqrt{V}) \\approx 2400 \\times 28 < 7 \\times 10^4$ operations, terminating in $< 0.05$ seconds.
- **Space Complexity:** $O(V + E)$ for the adjacency lists.
'''
    }
]

# ----------------- MAIN GENERATOR -----------------

def main():
    for p in problems:
        p_dir = os.path.join(PROBLEMS_DIR, p['slug'])
        os.makedirs(p_dir, exist_ok=True)
        print(f"Generating problem {p['id']} ({p['slug']})...")
        
        # 1. Generate sample cases
        sample_cases = []
        for sc in p['sampleCases']:
            out = p['solver'](sc['input'])
            sample_cases.append({
                "input": sc['input'],
                "expectedOutput": out,
                "explanation": sc['explanation']
            })
            
        # 2. Generate hidden cases
        hidden_cases = []
        for hi in p['hiddenInputs']:
            out = p['solver'](hi)
            hidden_cases.append({
                "input": hi,
                "expectedOutput": out
            })
            
        # 3. Create problem.json
        p_json = {
            "id": p['id'],
            "slug": p['slug'],
            "title": p['title'],
            "difficulty": p['difficulty'],
            "topics": p['topics'],
            "timeLimitMs": p['timeLimitMs'],
            "memoryLimitKb": p['memoryLimitKb'],
            "statement": p['statement'],
            "inputFormat": p['inputFormat'],
            "outputFormat": p['outputFormat'],
            "constraints": p['constraints'],
            "sampleCases": sample_cases,
            "hiddenCases": hidden_cases
        }
        
        with open(os.path.join(p_dir, 'problem.json'), 'w', encoding='utf-8') as f:
            json.dump(p_json, f, indent=2)
            
        # 4. Create solution.py
        with open(os.path.join(p_dir, 'solution.py'), 'w', encoding='utf-8') as f:
            f.write(p['solutionCode'])
            
        # 5. Create editorial.md
        with open(os.path.join(p_dir, 'editorial.md'), 'w', encoding='utf-8') as f:
            f.write(p['editorial'])
            
    print("All 6 problems generated successfully!")

if __name__ == '__main__':
    main()
