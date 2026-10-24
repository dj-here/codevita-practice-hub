import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    prices = [int(x) for x in data[1:1+n]]
    
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        max_val = -1
        for j in range(1, i + 1):
            val = prices[j - 1] + dp[i - j]
            if val > max_val:
                max_val = val
        dp[i] = max_val
        
    print(dp[n])

if __name__ == '__main__':
    solve()
