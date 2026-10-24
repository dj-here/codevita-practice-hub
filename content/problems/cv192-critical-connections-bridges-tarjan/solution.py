import sys

# Increase recursion limit
sys.setrecursionlimit(50000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    
    adj = [[] for _ in range(v)]
    idx = 2
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        adj[w].append(u)
        idx += 2
        
    tin = [-1] * v
    low = [-1] * v
    timer = 0
    bridges = 0
    
    def dfs(node, parent):
        nonlocal timer, bridges
        tin[node] = low[node] = timer
        timer += 1
        
        for neighbor in adj[node]:
            if neighbor == parent:
                continue
            if tin[neighbor] != -1:
                low[node] = min(low[node], tin[neighbor])
            else:
                dfs(neighbor, node)
                low[node] = min(low[node], low[neighbor])
                if low[neighbor] > tin[node]:
                    bridges += 1
                    
    for i in range(v):
        if tin[i] == -1:
            dfs(i, -1)
            
    print(bridges)

if __name__ == '__main__':
    solve()
