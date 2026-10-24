import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    e = int(data[1])
    k = int(data[2])
    
    adj = [[] for _ in range(n + 1)]
    idx = 3
    for _ in range(e):
        u = int(data[idx])
        v = int(data[idx+1])
        w = int(data[idx+2])
        adj[u].append((v, w))
        idx += 3
        
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    pq = [(0, k)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for nxt, weight in adj[u]:
            if dist[u] + weight < dist[nxt]:
                dist[nxt] = dist[u] + weight
                heapq.heappush(pq, (dist[nxt], nxt))
                
    max_time = max(dist[1:n+1])
    print(max_time if max_time != float('inf') else -1)

if __name__ == '__main__':
    solve()
