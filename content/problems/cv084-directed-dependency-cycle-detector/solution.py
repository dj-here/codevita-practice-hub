import sys

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
        
    # State: 0 = unvisited, 1 = visiting, 2 = visited
    state = [0] * v
    
    def has_cycle():
        for start in range(v):
            if state[start] != 0:
                continue
            stack = [(start, 0)]
            while stack:
                node, edge_idx = stack.pop()
                if edge_idx == 0:
                    state[node] = 1
                
                advanced = False
                for i in range(edge_idx, len(adj[node])):
                    neighbor = adj[node][i]
                    if state[neighbor] == 1:
                        return True
                    if state[neighbor] == 0:
                        stack.append((node, i + 1))
                        stack.append((neighbor, 0))
                        advanced = True
                        break
                        
                if not advanced:
                    state[node] = 2
        return False
        
    print("YES" if has_cycle() else "NO")

if __name__ == '__main__':
    solve()
