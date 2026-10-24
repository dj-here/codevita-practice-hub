import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    k = int(data[2])
    
    grid = []
    idx = 3
    for _ in range(n):
        row = [int(x) for x in data[idx:idx+m]]
        grid.append(row)
        idx += m
        
    for _ in range(k):
        nxt = [[0] * m for _ in range(n)]
        for r in range(n):
            for c in range(m):
                live_neighbors = 0
                for dr in (-1, 0, 1):
                    for dc in (-1, 0, 1):
                        if dr == 0 and dc == 0:
                            continue
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < n and 0 <= nc < m:
                            live_neighbors += grid[nr][nc]
                if grid[r][c] == 1:
                    if live_neighbors == 2 or live_neighbors == 3:
                        nxt[r][c] = 1
                else:
                    if live_neighbors == 3:
                        nxt[r][c] = 1
        grid = nxt
        
    for row in grid:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
