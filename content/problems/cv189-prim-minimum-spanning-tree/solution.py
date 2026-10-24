import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    
    if v <= 1:
        print(0)
        return
        
    adj = [[] for _ in range(v)]
    idx = 2
    for _ in range(e):
        u = int(data[idx])
        nxt = int(data[idx+1])
        w = int(data[idx+2])
        adj[u].append((nxt, w))
        adj[nxt].append((u, w))
        idx += 3
        
    visited = [False] * v
    pq = [(0, 0)] # (weight, node)
    total_weight = 0
    nodes_visited = 0
    
    while pq and nodes_visited < v:
        w, u = heapq.heappop(pq)
        if visited[u]:
            continue
        visited[u] = True
        total_weight += w
        nodes_visited += 1
        
        for nxt, edge_w in adj[u]:
            if not visited[nxt]:
                heapq.heappush(pq, (edge_w, nxt))
                
    print(total_weight)

if __name__ == '__main__':
    solve()
