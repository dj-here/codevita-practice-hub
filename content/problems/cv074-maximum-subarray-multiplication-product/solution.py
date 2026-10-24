import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    max_so_far = nums[0]
    min_so_far = nums[0]
    result = nums[0]
    
    for i in range(1, n):
        curr = nums[i]
        candidates = (curr, max_so_far * curr, min_so_far * curr)
        max_so_far = max(candidates)
        min_so_far = min(candidates)
        result = max(result, max_so_far)
        
    print(result)

if __name__ == '__main__':
    solve()
