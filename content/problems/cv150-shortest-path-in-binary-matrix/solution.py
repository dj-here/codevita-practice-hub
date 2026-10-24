import sys
from collections import deque

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
        
    if grid[0][0] != 0 or grid[n - 1][n - 1] != 0:
        print(-1)
        return
        
    if n == 1:
        print(1)
        return
        
    q = deque([(0, 0, 1)])
    grid[0][0] = 1 # Mark visited
    
    dirs = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    
    while q:
        r, c, d = q.popleft()
        if r == n - 1 and c == n - 1:
            print(d)
            return
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                grid[nr][nc] = 1
                q.append((nr, nc, d + 1))
                
    print(-1)

if __name__ == '__main__':
    solve()
