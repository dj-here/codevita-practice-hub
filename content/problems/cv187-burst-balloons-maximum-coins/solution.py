import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [1] + [int(x) for x in data[1:1+n]] + [1]
    
    m = len(nums)
    dp = [[0] * m for _ in range(m)]
    
    for length in range(2, m):
        for left in range(m - length):
            right = left + length
            max_coins = 0
            for i in range(left + 1, right):
                coins = nums[left] * nums[i] * nums[right] + dp[left][i] + dp[i][right]
                if coins > max_coins:
                    max_coins = coins
            dp[left][right] = max_coins
            
    print(dp[0][m - 1])

if __name__ == '__main__':
    solve()
