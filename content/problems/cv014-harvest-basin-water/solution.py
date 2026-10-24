import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    height = [int(x) for x in data[1:n+1]]
    if n <= 2:
        print(0)
        return
        
    left = 0
    right = n - 1
    left_max = 0
    right_max = 0
    total = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                total += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                total += right_max - height[right]
            right -= 1
            
    print(total)

if __name__ == '__main__':
    solve()
