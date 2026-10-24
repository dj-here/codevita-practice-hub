import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    coins = [int(x) for x in data[2:2+n]]
    
    if target == 0:
        print(0)
        return
        
    INF = float('inf')
    dp = [INF] * (target + 1)
    dp[0] = 0
    
    for c in coins:
        for i in range(c, target + 1):
            if dp[i - c] + 1 < dp[i]:
                dp[i] = dp[i - c] + 1
                
    ans = dp[target]
    print(ans if ans != INF else -1)

if __name__ == '__main__':
    solve()
