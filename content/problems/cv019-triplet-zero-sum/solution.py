import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = sorted([int(x) for x in data[1:n+1]])
    
    count = 0
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        left = i + 1
        right = n - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s == 0:
                count += 1
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
            elif s < 0:
                left += 1
            else:
                right -= 1
                
    print(count)

if __name__ == '__main__':
    solve()
