import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    c = int(data[1])
    values = [int(x) for x in data[2:2+n]]
    weights = [int(x) for x in data[2+n:2+2*n]]
    
    dp = [0] * (c + 1)
    for v, w in zip(values, weights):
        for j in range(c, w - 1, -1):
            if dp[j - w] + v > dp[j]:
                dp[j] = dp[j - w] + v
                
    print(dp[c])

if __name__ == '__main__':
    solve()
