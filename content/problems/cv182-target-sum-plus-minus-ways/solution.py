import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    total = sum(nums)
    if (total + target) % 2 != 0 or total < abs(target):
        print(0)
        return
        
    p = (total + target) // 2
    dp = [0] * (p + 1)
    dp[0] = 1
    
    for x in nums:
        for j in range(p, x - 1, -1):
            dp[j] += dp[j - x]
            
    print(dp[p])

if __name__ == '__main__':
    solve()
