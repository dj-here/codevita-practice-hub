import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    idx = 2
    adj = [[] for _ in range(v + 1)]
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        adj[u].append(w)
        adj[w].append(u)
        idx += 2
        
    visited = [False] * (v + 1)
    components = 0
    
    for i in range(1, v + 1):
        if not visited[i]:
            components += 1
            visited[i] = True
            stack = [i]
            while stack:
                node = stack.pop()
                for neighbor in adj[node]:
                    if not visited[neighbor]:
                        visited[neighbor] = True
                        stack.append(neighbor)
                        
    print(components)

if __name__ == '__main__':
    solve()
