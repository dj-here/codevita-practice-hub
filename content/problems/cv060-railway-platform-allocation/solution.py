import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = sorted([int(x) for x in data[1:1+n]])
    dep = sorted([int(x) for x in data[1+n:1+2*n]])
    
    platforms = 0
    max_platforms = 0
    i = 0
    j = 0
    
    while i < n and j < n:
        if arr[i] < dep[j]:
            platforms += 1
            max_platforms = max(max_platforms, platforms)
            i += 1
        else:
            platforms -= 1
            j += 1
            
    print(max_platforms)

if __name__ == '__main__':
    solve()
