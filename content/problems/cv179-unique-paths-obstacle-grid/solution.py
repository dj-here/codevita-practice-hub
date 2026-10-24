import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    dp = [0] * m
    idx = 2
    
    first_val = int(data[idx])
    if first_val == 0:
        dp[0] = 1
        
    for r in range(n):
        for c in range(m):
            val = int(data[idx])
            idx += 1
            if val == 1:
                dp[c] = 0
            elif c > 0:
                dp[c] += dp[c - 1]
                
    print(dp[m - 1])

if __name__ == '__main__':
    solve()
