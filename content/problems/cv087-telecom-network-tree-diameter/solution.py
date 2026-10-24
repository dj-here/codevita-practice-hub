import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    if v <= 1:
        print(0)
        return
        
    adj = [[] for _ in range(v + 1)]
    idx = 1
    for _ in range(v - 1):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        adj[w].append(u)
        idx += 2
        
    def bfs_farthest(start):
        dist = [-1] * (v + 1)
        dist[start] = 0
        q = deque([start])
        farthest_node = start
        max_dist = 0
        
        while q:
            curr = q.popleft()
            curr_dist = dist[curr]
            if curr_dist > max_dist:
                max_dist = curr_dist
                farthest_node = curr
            for neighbor in adj[curr]:
                if dist[neighbor] == -1:
                    dist[neighbor] = curr_dist + 1
                    q.append(neighbor)
                    
        return farthest_node, max_dist
        
    # First BFS from arbitrary node 1 to find one end of diameter
    node_a, _ = bfs_farthest(1)
    # Second BFS from node_a to find true diameter
    _, diameter = bfs_farthest(node_a)
    
    print(diameter)

if __name__ == '__main__':
    solve()
