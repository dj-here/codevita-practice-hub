import sys

# Increase recursion depth for deep graphs
sys.setrecursionlimit(20000)

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
        w = int(data[idx+1])
        adj[u].append(w)
        idx += 2
        
    s = int(data[idx])
    
    visited = [False] * v
    count = 0
    
    stack = [s]
    visited[s] = True
    while stack:
        node = stack.pop()
        count += 1
        for nxt in adj[node]:
            if not visited[nxt]:
                visited[nxt] = True
                stack.append(nxt)
                
    print(count)

if __name__ == '__main__':
    solve()
