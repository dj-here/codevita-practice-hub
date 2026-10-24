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
