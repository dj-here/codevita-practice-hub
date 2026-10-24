import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    intervals = []
    for _ in range(n):
        s = int(data[idx])
        e = int(data[idx+1])
        intervals.append((s, e))
        idx += 2
        
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    removals = 0
    last_end = float('-inf')
    
    for s, e in intervals:
        if s >= last_end:
            last_end = e
        else:
            removals += 1
            
    print(removals)

if __name__ == '__main__':
    solve()
