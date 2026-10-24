import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    edges = []
    idx = 2
    for _ in range(e):
        u = int(data[idx])
        nxt = int(data[idx+1])
        w = int(data[idx+2])
        edges.append((u, nxt, w))
        idx += 3
        
    dist = [float('inf')] * v
    dist[0] = 0
    
    # Relax V - 1 times
    for _ in range(v - 1):
        for u, nxt, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[nxt]:
                dist[nxt] = dist[u] + w
                
    # Check for V-th relaxation
    has_negative_cycle = False
    for u, nxt, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[nxt]:
            has_negative_cycle = True
            break
            
    print("YES" if has_negative_cycle else "NO")

if __name__ == '__main__':
    solve()
