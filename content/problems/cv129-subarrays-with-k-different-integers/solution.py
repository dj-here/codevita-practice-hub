import sys
from collections import defaultdict

def at_most_k(nums, k):
    if k <= 0:
        return 0
    count = defaultdict(int)
    left = 0
    res = 0
    distinct = 0
    for right, val in enumerate(nums):
        if count[val] == 0:
            distinct += 1
        count[val] += 1
        
        while distinct > k:
            count[nums[left]] -= 1
            if count[nums[left]] == 0:
                distinct -= 1
            left += 1
        res += (right - left + 1)
    return res

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    ans = at_most_k(nums, k) - at_most_k(nums, k - 1)
    print(ans)

if __name__ == '__main__':
    solve()
