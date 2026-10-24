import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    if n < 3:
        print(0)
        return
        
    ans = 0
    i = 1
    while i < n - 1:
        # Check if i is a peak
        if arr[i - 1] < arr[i] > arr[i + 1]:
            left = i - 1
            while left > 0 and arr[left - 1] < arr[left]:
                left -= 1
            right = i + 1
            while right < n - 1 and arr[right] > arr[right + 1]:
                right += 1
            ans = max(ans, right - left + 1)
            i = right
        else:
            i += 1
            
    print(ans)

if __name__ == '__main__':
    solve()
