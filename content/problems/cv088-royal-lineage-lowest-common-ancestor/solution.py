import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    if v == 1:
        print(1)
        return
        
    parent = [0] * (v + 1)
    depth = [0] * (v + 1)
    adj = [[] for _ in range(v + 1)]
    
    idx = 1
    for _ in range(v - 1):
        p = int(data[idx])
        c = int(data[idx+1])
        parent[c] = p
        adj[p].append(c)
        idx += 2
        
    u = int(data[idx])
    w = int(data[idx+1])
    
    # Compute depth using BFS/DFS
    stack = [1]
    depth[1] = 0
    while stack:
        curr = stack.pop()
        for child in adj[curr]:
            depth[child] = depth[curr] + 1
            stack.append(child)
            
    # Ascend to same depth
    while depth[u] > depth[w]:
        u = parent[u]
    while depth[w] > depth[u]:
        w = parent[w]
        
    # Ascend together
    while u != w:
        u = parent[u]
        w = parent[w]
        
    print(u)

if __name__ == '__main__':
    solve()
