import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    dp = [0] * (m + 1)
    max_side = 0
    idx = 2
    
    for r in range(n):
        next_dp = [0] * (m + 1)
        for c in range(1, m + 1):
            val = int(data[idx])
            idx += 1
            if val == 1:
                next_dp[c] = min(dp[c], dp[c - 1], next_dp[c - 1]) + 1
                if next_dp[c] > max_side:
                    max_side = next_dp[c]
        dp = next_dp
        
    print(max_side * max_side)

if __name__ == '__main__':
    solve()
