import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    triangle = []
    idx = 1
    for r in range(1, n + 1):
        triangle.append([int(x) for x in data[idx:idx+r]])
        idx += r
        
    dp = triangle[-1][:]
    for r in range(n - 2, -1, -1):
        for c in range(r + 1):
            dp[c] = triangle[r][c] + min(dp[c], dp[c + 1])
            
    print(dp[0])

if __name__ == '__main__':
    solve()
