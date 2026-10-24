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
    in_degree = [0] * v
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        in_degree[w] += 1
        idx += 2
        
    pq = [i for i in range(v) if in_degree[i] == 0]
    heapq.heapify(pq)
    
    order = []
    while pq:
        curr = heapq.heappop(pq)
        order.append(curr)
        for nxt in adj[curr]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0:
                heapq.heappush(pq, nxt)
                
    if len(order) == v:
        print(' '.join(map(str, order)))
    else:
        print("IMPOSSIBLE")

if __name__ == '__main__':
    solve()
