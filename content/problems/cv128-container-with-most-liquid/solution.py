import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    h = [int(x) for x in data[1:1+n]]
    
    left, right = 0, n - 1
    max_area = 0
    
    while left < right:
        area = min(h[left], h[right]) * (right - left)
        if area > max_area:
            max_area = area
        if h[left] < h[right]:
            left += 1
        else:
            right -= 1
            
    print(max_area)

if __name__ == '__main__':
    solve()
