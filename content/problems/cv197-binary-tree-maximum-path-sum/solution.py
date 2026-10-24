import sys

sys.setrecursionlimit(50000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    vals = [0] + [int(x) for x in data[1:1+v]]
    
    if v == 1:
        print(vals[1])
        return
        
    adj = [[] for _ in range(v + 1)]
    idx = 1 + v
    for _ in range(v - 1):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        adj[w].append(u)
        idx += 2
        
    max_global = float('-inf')
    
    def dfs(node, parent):
        nonlocal max_global
        max_branch_1, max_branch_2 = 0, 0
        
        for neighbor in adj[node]:
            if neighbor != parent:
                gain = dfs(neighbor, node)
                if gain > max_branch_1:
                    max_branch_2 = max_branch_1
                    max_branch_1 = gain
                elif gain > max_branch_2:
                    max_branch_2 = gain
                    
        # Path passing through node turning at node
        local_max = vals[node] + max_branch_1 + max_branch_2
        if local_max > max_global:
            max_global = local_max
            
        # Gain contributed upward
        return max(0, vals[node] + max_branch_1)
        
    dfs(1, 0)
    print(max_global)

if __name__ == '__main__':
    solve()
