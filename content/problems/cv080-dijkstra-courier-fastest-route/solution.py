import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    idx = 2
    adj = [[] for _ in range(v)]
    for _ in range(e):
        u = int(data[idx])
        nxt = int(data[idx+1])
        w = int(data[idx+2])
        adj[u].append((nxt, w))
        adj[nxt].append((u, w))
        idx += 3
        
    s = int(data[idx])
    d = int(data[idx+1])
    
    if s == d:
        print(0)
        return
        
    dist = [float('inf')] * v
    dist[s] = 0
    pq = [(0, s)]
    
    while pq:
        d_curr, u = heapq.heappop(pq)
        if d_curr > dist[u]:
            continue
        if u == d:
            print(d_curr)
            return
            
        for nxt, weight in adj[u]:
            if dist[u] + weight < dist[nxt]:
                dist[nxt] = dist[u] + weight
                heapq.heappush(pq, (dist[nxt], nxt))
                
    ans = dist[d]
    print(ans if ans != float('inf') else -1)

if __name__ == '__main__':
    solve()
