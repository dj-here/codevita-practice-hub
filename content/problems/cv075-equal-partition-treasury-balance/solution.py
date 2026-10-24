import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    total = sum(nums)
    if total % 2 != 0:
        print("NO")
        return
        
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for x in nums:
        for j in range(target, x - 1, -1):
            if dp[j - x]:
                dp[j] = True
                
    print("YES" if dp[target] else "NO")

if __name__ == '__main__':
    solve()
