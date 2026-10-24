import sys
import heapq

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
        
    pq = [(grid[0][0], 0, 0)]
    visited = [[False] * n for _ in range(n)]
    visited[0][0] = True
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    ans = 0
    
    while pq:
        h, r, c = heapq.heappop(pq)
        ans = max(ans, h)
        if r == n - 1 and c == n - 1:
            print(ans)
            return
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                visited[nr][nc] = True
                heapq.heappush(pq, (grid[nr][nc], nr, nc))

if __name__ == '__main__':
    solve()
