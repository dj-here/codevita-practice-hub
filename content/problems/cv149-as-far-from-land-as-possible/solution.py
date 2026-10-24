import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    q = deque()
    dist = [[-1] * n for _ in range(n)]
    idx = 1
    
    for r in range(n):
        for c in range(n):
            val = int(data[idx])
            idx += 1
            if val == 1:
                dist[r][c] = 0
                q.append((r, c))
                
    if len(q) == 0 or len(q) == n * n:
        print(-1)
        return
        
    max_dist = -1
    while q:
        r, c = q.popleft()
        d = dist[r][c]
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and dist[nr][nc] == -1:
                dist[nr][nc] = d + 1
                max_dist = max(max_dist, d + 1)
                q.append((nr, nc))
                
    print(max_dist)

if __name__ == '__main__':
    solve()
