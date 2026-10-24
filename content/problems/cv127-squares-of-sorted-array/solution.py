import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    nums = [int(x) for x in data[1:1+n]]
    
    result = [0] * n
    left, right = 0, n - 1
    pos = n - 1
    
    while left <= right:
        sq_left = nums[left] * nums[left]
        sq_right = nums[right] * nums[right]
        if sq_left > sq_right:
            result[pos] = sq_left
            left += 1
        else:
            result[pos] = sq_right
            right -= 1
        pos -= 1
        
    print(' '.join(map(str, result)))

if __name__ == '__main__':
    solve()
