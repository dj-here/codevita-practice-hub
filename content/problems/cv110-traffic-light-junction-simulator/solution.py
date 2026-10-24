import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    g_ns = int(data[0])
    g_ew = int(data[1])
    n = int(data[2])
    cycle = g_ns + g_ew
    
    events = []
    idx = 3
    for car_id in range(n):
        t = int(data[idx])
        lane = data[idx+1]
        events.append((t, lane, car_id))
        idx += 2
        
    q_ns = deque()
    q_ew = deque()
    dep = [0] * n
    
    current_time = 0
    event_idx = 0
    served = 0
    
    while served < n:
        # Enqueue arrivals up to current_time
        while event_idx < n and events[event_idx][0] <= current_time:
            t, lane, cid = events[event_idx]
            if lane == 'NS':
                q_ns.append(cid)
            else:
                q_ew.append(cid)
            event_idx += 1
            
        phase = current_time % cycle
        ns_green = phase < g_ns
        
        # Try serving a car
        car_served = False
        if ns_green and q_ns:
            cid = q_ns.popleft()
            dep[cid] = current_time
            served += 1
            car_served = True
        elif not ns_green and q_ew:
            cid = q_ew.popleft()
            dep[cid] = current_time
            served += 1
            car_served = True
            
        # Fast forward if idle
        if not car_served and not q_ns and not q_ew:
            if event_idx < n:
                current_time = events[event_idx][0]
                continue
                
        current_time += 1
        
    for ans in dep:
        print(ans)

if __name__ == '__main__':
    solve()
