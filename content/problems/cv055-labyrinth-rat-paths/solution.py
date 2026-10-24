import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    maze = []
    for _ in range(n):
        maze.append([int(x) for x in data[idx:idx+n]])
        idx += n
        
    if maze[0][0] == 0 or maze[n - 1][n - 1] == 0:
        print(0)
        return
        
    visited = [[False] * n for _ in range(n)]
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    count = 0
    
    def dfs(r, c):
        nonlocal count
        if r == n - 1 and c == n - 1:
            count += 1
            return
            
        visited[r][c] = True
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc] and maze[nr][nc] == 1:
                dfs(nr, nc)
        visited[r][c] = False

    dfs(0, 0)
    print(count)

if __name__ == '__main__':
    solve()
