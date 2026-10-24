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
