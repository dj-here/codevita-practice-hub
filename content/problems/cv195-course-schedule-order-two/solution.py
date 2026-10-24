import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    e = int(data[1])
    
    adj = [[] for _ in range(n)]
    in_degree = [0] * n
    idx = 2
    for _ in range(e):
        a = int(data[idx])
        b = int(data[idx+1])
        adj[b].append(a)
        in_degree[a] += 1
        idx += 2
        
    pq = [i for i in range(n) if in_degree[i] == 0]
    heapq.heapify(pq)
    
    order = []
    while pq:
        curr = heapq.heappop(pq)
        order.append(curr)
        for nxt in adj[curr]:
            in_degree[nxt] -= 1
            if in_degree[nxt] == 0:
                heapq.heappush(pq, nxt)
                
    if len(order) == n:
        print(' '.join(map(str, order)))
    else:
        print("IMPOSSIBLE")

if __name__ == '__main__':
    solve()
