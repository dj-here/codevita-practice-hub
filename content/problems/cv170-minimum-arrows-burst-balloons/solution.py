import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    points = []
    idx = 1
    for _ in range(n):
        s = int(data[idx])
        e = int(data[idx+1])
        points.append((s, e))
        idx += 2
        
    points.sort(key=lambda x: x[1])
    
    arrows = 1
    last_pos = points[0][1]
    
    for s, e in points[1:]:
        if s > last_pos:
            arrows += 1
            last_pos = e
            
    print(arrows)

if __name__ == '__main__':
    solve()
