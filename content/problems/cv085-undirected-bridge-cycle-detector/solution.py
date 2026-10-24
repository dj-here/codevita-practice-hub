import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    idx = 2
    
    parent = list(range(v))
    def find(i):
        path = []
        while parent[i] != i:
            path.append(i)
            i = parent[i]
        for node in path:
            parent[node] = i
        return i
        
    has_cycle = False
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        idx += 2
        
        root_u = find(u)
        root_w = find(w)
        if root_u == root_w:
            has_cycle = True
        else:
            parent[root_u] = root_w
            
    print("YES" if has_cycle else "NO")

if __name__ == '__main__':
    solve()
