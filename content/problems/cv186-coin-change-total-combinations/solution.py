import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    amount = int(data[1])
    coins = [int(x) for x in data[2:2+n]]
    
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for c in coins:
        for j in range(c, amount + 1):
            dp[j] += dp[j - c]
            
    print(dp[amount])

if __name__ == '__main__':
    solve()
