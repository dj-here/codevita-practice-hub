import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    p = [int(x) for x in data[1:1+n]]
    
    m = n - 1
    if m <= 1:
        print(0)
        return
        
    dp = [[0] * m for _ in range(m)]
    
    for length in range(2, m + 1):
        for i in range(m - length + 1):
            j = i + length - 1
            min_cost = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k+1][j] + p[i] * p[k+1] * p[j+1]
                if cost < min_cost:
                    min_cost = cost
            dp[i][j] = min_cost
            
    print(dp[0][m-1])

if __name__ == '__main__':
    solve()
