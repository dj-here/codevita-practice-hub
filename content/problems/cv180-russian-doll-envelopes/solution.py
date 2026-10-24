import sys
import bisect

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    envelopes = []
    idx = 1
    for _ in range(n):
        w = int(data[idx])
        h = int(data[idx+1])
        envelopes.append((w, h))
        idx += 2
        
    # Sort: ascending width, descending height (prevents same-width nesting)
    envelopes.sort(key=lambda x: (x[0], -x[1]))
    
    # LIS on heights
    tails = []
    for _, h in envelopes:
        pos = bisect.bisect_left(tails, h)
        if pos == len(tails):
            tails.append(h)
        else:
            tails[pos] = h
            
    print(len(tails))

if __name__ == '__main__':
    solve()
