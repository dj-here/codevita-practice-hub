import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    arr = [int(x) for x in data[2:2+n]]
    
    deq = deque()  # stores indices of useful elements in current window
    result = []
    
    for i in range(n):
        # Remove elements out of current window [i - k + 1, i]
        while deq and deq[0] < i - k + 1:
            deq.popleft()
            
        # Maintain monotonic decreasing order
        while deq and arr[deq[-1]] <= arr[i]:
            deq.pop()
            
        deq.append(i)
        
        # When window is full, append front
        if i >= k - 1:
            result.append(str(arr[deq[0]]))
            
    print(' '.join(result))

if __name__ == '__main__':
    solve()
