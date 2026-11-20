import sys
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
