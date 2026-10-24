import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    grid = [list(data[2 + i]) for i in range(R)]
    
    islands = 0
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    for r in range(R):
        for c in range(C):
            if grid[r][c] == '1':
                islands += 1
                grid[r][c] = '0'
                queue = deque([(r, c)])
                while queue:
                    curr_r, curr_c = queue.popleft()
                    for dr, dc in dirs:
                        nr, nc = curr_r + dr, curr_c + dc
                        if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            queue.append((nr, nc))
                            
    print(islands)

if __name__ == '__main__':
    solve()
