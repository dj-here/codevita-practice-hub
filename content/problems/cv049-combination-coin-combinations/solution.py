import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    coins = [int(x) for x in data[2:2+n]]
    
    dp = [0] * (target + 1)
    dp[0] = 1
    for coin in coins:
        for x in range(coin, target + 1):
            dp[x] += dp[x - coin]
            
    print(dp[target])

if __name__ == '__main__':
    solve()
