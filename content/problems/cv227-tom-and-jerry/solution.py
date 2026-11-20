import sys
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
