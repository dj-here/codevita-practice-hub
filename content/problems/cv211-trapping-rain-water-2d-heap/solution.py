import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    if n <= 2 or m <= 2:
        print(0)
        return
        
    grid = []
    idx = 2
    for _ in range(n):
        grid.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    visited = [[False] * m for _ in range(n)]
    pq = []
    
    for r in range(n):
        for c in (0, m - 1):
            heapq.heappush(pq, (grid[r][c], r, c))
            visited[r][c] = True
    for c in range(1, m - 1):
        for r in (0, n - 1):
            heapq.heappush(pq, (grid[r][c], r, c))
            visited[r][c] = True
            
    water = 0
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while pq:
        h, r, c = heapq.heappop(pq)
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and not visited[nr][nc]:
                visited[nr][nc] = True
                if grid[nr][nc] < h:
                    water += h - grid[nr][nc]
                heapq.heappush(pq, (max(grid[nr][nc], h), nr, nc))
                
    print(water)

if __name__ == '__main__':
    solve()
