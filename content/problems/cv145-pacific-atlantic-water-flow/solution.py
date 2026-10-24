import sys

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
        
    pacific = [[False] * m for _ in range(n)]
    atlantic = [[False] * m for _ in range(n)]
    
    def bfs(starts, reachable):
        stack = list(starts)
        for r, c in starts:
            reachable[r][c] = True
        while stack:
            r, c = stack.pop()
            for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < m and not reachable[nr][nc]:
                    if grid[nr][nc] >= grid[r][c]:
                        reachable[nr][nc] = True
                        stack.append((nr, nc))
                        
    pac_starts = [(r, 0) for r in range(n)] + [(0, c) for c in range(m)]
    atl_starts = [(r, m - 1) for r in range(n)] + [(n - 1, c) for c in range(m)]
    
    bfs(set(pac_starts), pacific)
    bfs(set(atl_starts), atlantic)
    
    count = 0
    for r in range(n):
        for c in range(m):
            if pacific[r][c] and atlantic[r][c]:
                count += 1
                
    print(count)

if __name__ == '__main__':
    solve()
