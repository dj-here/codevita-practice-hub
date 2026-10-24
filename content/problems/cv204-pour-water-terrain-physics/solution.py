import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    v = int(data[1])
    k = int(data[2])
    h = [int(x) for x in data[3:3+n]]
    
    for _ in range(v):
        best = k
        # Try left
        for i in range(k - 1, -1, -1):
            if h[i] > h[i + 1]:
                break
            if h[i] < h[best]:
                best = i
        if best != k:
            h[best] += 1
            continue
            
        # Try right
        for i in range(k + 1, n):
            if h[i] > h[i - 1]:
                break
            if h[i] < h[best]:
                best = i
        h[best] += 1
        
    print(' '.join(map(str, h)))

if __name__ == '__main__':
    solve()
