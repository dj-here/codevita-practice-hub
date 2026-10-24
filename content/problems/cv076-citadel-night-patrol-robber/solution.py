import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    if n == 1:
        print(nums[0])
        return
        
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
    
    for i in range(2, n):
        curr = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = curr
        
    print(prev1)

if __name__ == '__main__':
    solve()
