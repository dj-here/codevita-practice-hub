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
        
    dp = [[float('inf')] * (m + 1) for _ in range(n + 1)]
    dp[n][m - 1] = 1
    dp[n - 1][m] = 1
    
    for r in range(n - 1, -1, -1):
        for c in range(m - 1, -1, -1):
            needed = min(dp[r + 1][c], dp[r][c + 1]) - grid[r][c]
            dp[r][c] = max(1, needed)
            
    print(dp[0][0])

if __name__ == '__main__':
    solve()
