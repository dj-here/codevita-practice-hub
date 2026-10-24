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
