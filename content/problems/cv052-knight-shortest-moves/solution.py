import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    sx, sy, tx, ty = int(data[1]), int(data[2]), int(data[3]), int(data[4])
    
    if sx == tx and sy == ty:
        print(0)
        return
        
    moves = [(-2, -1), (-2, 1), (-1, -2), (-1, 2), (1, -2), (1, 2), (2, -1), (2, 1)]
    visited = [[False] * n for _ in range(n)]
    visited[sx][sy] = True
    queue = deque([(sx, sy, 0)])
    
    while queue:
        x, y, dist = queue.popleft()
        if x == tx and y == ty:
            print(dist)
            return
            
        for dx, dy in moves:
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < n and not visited[nx][ny]:
                visited[nx][ny] = True
                queue.append((nx, ny, dist + 1))
                
    print(-1)

if __name__ == '__main__':
    solve()
