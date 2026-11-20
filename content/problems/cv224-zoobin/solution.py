import sys
from collections import deque

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    E = int(tokens[0])
    idx = 1
    
    cur_edges = []
    for _ in range(E):
        u = int(tokens[idx]); idx += 1
        v = int(tokens[idx]); idx += 1
        cur_edges.append((u, v))
        
    exp_edges = []
    for _ in range(E):
        u = int(tokens[idx]); idx += 1
        v = int(tokens[idx]); idx += 1
        exp_edges.append((u, v))
        
    nodes = set()
    for u, v in cur_edges + exp_edges:
        nodes.add(u)
        nodes.add(v)
    node_list = sorted(list(nodes))
    node_to_idx = {node_list[i]: i for i in range(len(node_list))}
    N = len(node_list)
    
    adj = {i: [] for i in range(N)}
    for u, v in cur_edges:
        ui, vi = node_to_idx[u], node_to_idx[v]
        adj[ui].append(vi)
        adj[vi].append(ui)
        
    target_edges = set()
    for u, v in exp_edges:
        ui, vi = node_to_idx[u], node_to_idx[v]
        target_edges.add((min(ui, vi), max(ui, vi)))
        
    cycles = []
    visited = [False] * N
    
    for start in range(N):
        def dfs(curr, parent, path):
            for nxt in adj[curr]:
                if nxt == parent:
                    continue
                if nxt == start and len(path) >= 3:
                    c = list(path)
                    min_idx = c.index(min(c))
                    c = c[min_idx:] + c[:min_idx]
                    if c[1] > c[-1]:
                        c = [c[0]] + c[:0:-1]
                    if c not in cycles:
                        cycles.append(c)
                elif not visited[nxt] and nxt > start:
                    visited[nxt] = True
                    dfs(nxt, curr, path + [nxt])
                    visited[nxt] = False
        visited[start] = True
        dfs(start, -1, [start])
        visited[start] = False

    initial_p = tuple(range(N))
    
    def get_edges(p):
        edges = set()
        for u in range(N):
            for v in adj[u]:
                if u < v:
                    a1, a2 = p[u], p[v]
                    edges.add((min(a1, a2), max(a1, a2)))
        return edges

    if get_edges(initial_p) == target_edges:
        print(0)
        return

    queue = deque([(initial_p, 0)])
    seen = {initial_p}
    
    while queue:
        p, d = queue.popleft()
        
        for cyc in cycles:
            k = len(cyc)
            # Forward rotation
            p_next1 = list(p)
            for i in range(k):
                p_next1[cyc[(i + 1) % k]] = p[cyc[i]]
            t1 = tuple(p_next1)
            if get_edges(t1) == target_edges:
                print(d + 1)
                return
            if t1 not in seen:
                seen.add(t1)
                queue.append((t1, d + 1))
                
            # Reverse rotation
            p_next2 = list(p)
            for i in range(k):
                p_next2[cyc[(i - 1 + k) % k]] = p[cyc[i]]
            t2 = tuple(p_next2)
            if get_edges(t2) == target_edges:
                print(d + 1)
                return
            if t2 not in seen:
                seen.add(t2)
                queue.append((t2, d + 1))
                
    print(-1)

if __name__ == '__main__':
    solve()
