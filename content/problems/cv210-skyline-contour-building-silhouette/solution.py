import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    events = []
    idx = 1
    for _ in range(n):
        l = int(data[idx])
        r = int(data[idx+1])
        h = int(data[idx+2])
        # Start event: (l, -h, r)
        events.append((l, -h, r))
        # End event: (r, 0, 0)
        events.append((r, 0, 0))
        idx += 3
        
    events.sort()
    
    # max-heap: (-height, right_boundary)
    live = [(0, float('inf'))]
    skyline = []
    
    for x, neg_h, r in events:
        if neg_h != 0:
            heapq.heappush(live, (neg_h, r))
            
        while live[0][1] <= x:
            heapq.heappop(live)
            
        curr_h = -live[0][0]
        if not skyline or skyline[-1][1] != curr_h:
            skyline.append((x, curr_h))
            
    for pt in skyline:
        print(f"{pt[0]} {pt[1]}")

if __name__ == '__main__':
    solve()
