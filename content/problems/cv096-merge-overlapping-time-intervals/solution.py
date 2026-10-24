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
        
    intervals.sort()
    
    merged = []
    for s, e in intervals:
        if not merged or s > merged[-1][1]:
            merged.append([s, e])
        else:
            merged[-1][1] = max(merged[-1][1], e)
            
    for s, e in merged:
        print(f"{s} {e}")

if __name__ == '__main__':
    solve()
