import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    idx = 2
    grid = []
    for _ in range(R):
        grid.append([int(x) for x in data[idx:idx+C]])
        idx += C
    sr = int(data[idx])
    sc = int(data[idx+1])
    new_color = int(data[idx+2])
    
    orig_color = grid[sr][sc]
    if orig_color != new_color:
        queue = deque([(sr, sc)])
        grid[sr][sc] = new_color
        dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        while queue:
            r, c = queue.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == orig_color:
                    grid[nr][nc] = new_color
                    queue.append((nr, nc))
                    
    for row in grid:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
