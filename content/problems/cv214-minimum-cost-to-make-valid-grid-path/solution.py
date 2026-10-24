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
    for _ in range(n):
        grid.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    # Directions: 1=R, 2=L, 3=D, 4=U
    dirs = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    dist = [[float('inf')] * m for _ in range(n)]
    dist[0][0] = 0
    # 0-1 BFS using double-ended queue
    q = deque([(0, 0)])
    
    while q:
        r, c = q.popleft()
        if r == n - 1 and c == m - 1:
            print(dist[r][c])
            return
            
        sign = grid[r][c] - 1
        for i, (dr, dc) in enumerate(dirs):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m:
                cost = 0 if i == sign else 1
                if dist[r][c] + cost < dist[nr][nc]:
                    dist[nr][nc] = dist[r][c] + cost
                    if cost == 0:
                        q.appendleft((nr, nc))
                    else:
                        q.append((nr, nc))
                        
    print(dist[n - 1][m - 1])

if __name__ == '__main__':
    solve()
