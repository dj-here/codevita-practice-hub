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
    buildings = []
    
    for r in range(n):
        row = [int(x) for x in data[idx:idx+m]]
        grid.append(row)
        for c in range(m):
            if row[c] == 1:
                buildings.append((r, c))
        idx += m
        
    num_buildings = len(buildings)
    dist_sum = [[0] * m for _ in range(n)]
    reach_count = [[0] * m for _ in range(n)]
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    for br, bc in buildings:
        visited = [[False] * m for _ in range(n)]
        q = deque([(br, bc, 0)])
        visited[br][bc] = True
        
        while q:
            r, c, d = q.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < m and not visited[nr][nc]:
                    visited[nr][nc] = True
                    if grid[nr][nc] == 0:
                        dist_sum[nr][nc] += (d + 1)
                        reach_count[nr][nc] += 1
                        q.append((nr, nc, d + 1))
                        
    min_dist = float('inf')
    for r in range(n):
        for c in range(m):
            if grid[r][c] == 0 and reach_count[r][c] == num_buildings:
                min_dist = min(min_dist, dist_sum[r][c])
                
    print(min_dist if min_dist != float('inf') else -1)

if __name__ == '__main__':
    solve()
