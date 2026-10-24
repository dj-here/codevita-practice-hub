import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    idx = 2
    
    if v == 1:
        print(0)
        return
        
    edges = []
    for _ in range(e):
        u = int(data[idx])
        w_node = int(data[idx+1])
        weight = int(data[idx+2])
        edges.append((weight, u, w_node))
        idx += 3
        
    edges.sort()
    
    parent = list(range(v))
    def find(i):
        path = []
        while parent[i] != i:
            path.append(i)
            i = parent[i]
        for node in path:
            parent[node] = i
        return i
        
    total_cost = 0
    edges_count = 0
    
    for weight, u, w_node in edges:
        root_u = find(u)
        root_w = find(w_node)
        if root_u != root_w:
            parent[root_u] = root_w
            total_cost += weight
            edges_count += 1
            if edges_count == v - 1:
                break
                
    if edges_count == v - 1:
        print(total_cost)
    else:
        print(-1)

if __name__ == '__main__':
    solve()
