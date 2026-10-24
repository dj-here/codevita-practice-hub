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
    q = deque()
    fresh = 0
    
    for r in range(n):
        row = [int(x) for x in data[idx:idx+m]]
        grid.append(row)
        for c in range(m):
            if row[c] == 2:
                q.append((r, c, 0))
            elif row[c] == 1:
                fresh += 1
        idx += m
        
    if fresh == 0:
        print(0)
        return
        
    minutes = 0
    while q:
        r, c, d = q.popleft()
        minutes = max(minutes, d)
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                q.append((nr, nc, d + 1))
                
    if fresh == 0:
        print(minutes)
    else:
        print(-1)

if __name__ == '__main__':
    solve()
