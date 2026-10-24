import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    target = int(data[1])
    nums = [int(x) for x in data[2:2+n]]
    
    low, high = 0, n - 1
    ans = -1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            ans = mid
            break
        # Left half is sorted
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
                
    print(ans)

if __name__ == '__main__':
    solve()
