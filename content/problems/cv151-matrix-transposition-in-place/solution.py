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
        grid.append(data[idx:idx+m])
        idx += m
        
    for c in range(m):
        col = [grid[r][c] for r in range(n)]
        print(' '.join(col))

if __name__ == '__main__':
    solve()
