import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    intervals = []
    idx = 1
    for _ in range(n):
        s = int(data[idx])
        e = int(data[idx+1])
        intervals.append((s, e))
        idx += 2
        
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    non_overlap_count = 0
    last_end = float('-inf')
    
    for s, e in intervals:
        if s >= last_end:
            non_overlap_count += 1
            last_end = e
            
    print(n - non_overlap_count)

if __name__ == '__main__':
    solve()
