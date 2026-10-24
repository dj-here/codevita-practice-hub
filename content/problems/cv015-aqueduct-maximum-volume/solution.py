import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    h = [int(x) for x in data[1:n+1]]
    
    left = 0
    right = n - 1
    max_area = 0
    
    while left < right:
        width = right - left
        area = min(h[left], h[right]) * width
        if area > max_area:
            max_area = area
        if h[left] < h[right]:
            left += 1
        else:
            right -= 1
            
    print(max_area)

if __name__ == '__main__':
    solve()
