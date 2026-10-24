import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    diagonals = defaultdict(list)
    idx = 2
    for r in range(n):
        for c in range(m):
            diagonals[r + c].append(data[idx])
            idx += 1
            
    res = []
    for d in range(n + m - 1):
        items = diagonals[d]
        if d % 2 == 0:
            res.extend(reversed(items))
        else:
            res.extend(items)
            
    print(' '.join(res))

if __name__ == '__main__':
    solve()
