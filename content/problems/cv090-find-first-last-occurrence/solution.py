import sys
import bisect

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    first = bisect.bisect_left(nums, target)
    if first == n or nums[first] != target:
        print("-1 -1")
        return
        
    last = bisect.bisect_right(nums, target) - 1
    print(f"{first} {last}")

if __name__ == '__main__':
    solve()
