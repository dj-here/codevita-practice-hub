import sys

MOD = 1000000007

def solve():
    lines = sys.stdin.read().split()
    if len(lines) < 2:
        return
    s, t = lines[0], lines[1]
    
    n, m = len(s), len(t)
    if m > n:
        print(0)
        return
        
    dp = [0] * (m + 1)
    dp[0] = 1
    
    for c_s in s:
        for j in range(m, 0, -1):
            if c_s == t[j - 1]:
                dp[j] = (dp[j] + dp[j - 1]) % MOD
                
    print(dp[m])

if __name__ == '__main__':
    solve()
