import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    target = int(data[0])
    n = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    
    left = 0
    curr_sum = 0
    min_len = float('inf')
    
    for right in range(n):
        curr_sum += arr[right]
        while curr_sum >= target:
            min_len = min(min_len, right - left + 1)
            curr_sum -= arr[left]
            left += 1
            
    print(min_len if min_len != float('inf') else 0)

if __name__ == '__main__':
    solve()
