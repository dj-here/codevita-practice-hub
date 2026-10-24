import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    if n <= 1:
        print(0)
        return
    if arr[0] == 0:
        print(-1)
        return
        
    jumps = 0
    curr_end = 0
    farthest = 0
    
    for i in range(n - 1):
        farthest = max(farthest, i + arr[i])
        if i == curr_end:
            jumps += 1
            curr_end = farthest
            if curr_end >= n - 1:
                break
        if i >= farthest:
            print(-1)
            return
            
    print(jumps if curr_end >= n - 1 else -1)

if __name__ == '__main__':
    solve()
