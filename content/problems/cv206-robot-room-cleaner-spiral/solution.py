import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    sr = int(data[2])
    sc = int(data[3])
    
    grid = []
    idx = 4
    for _ in range(n):
        grid.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    visited = set()
    q = deque([(sr, sc)])
    visited.add((sr, sc))
    
    while q:
        r, c = q.popleft()
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and grid[nr][nc] == 1 and (nr, nc) not in visited:
                visited.add((nr, nc))
                q.append((nr, nc))
                
    print(len(visited))

if __name__ == '__main__':
    solve()
