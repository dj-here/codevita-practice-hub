import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    v = int(data[0])
    e = int(data[1])
    
    if e != v - 1:
        print("NO")
        return
        
    parent = list(range(v))
    def find(i):
        path = []
        while parent[i] != i:
            path.append(i)
            i = parent[i]
        for node in path:
            parent[node] = i
        return i
        
    idx = 2
    for _ in range(e):
        u = int(data[idx])
        w = int(data[idx+1])
        idx += 2
        
        root_u = find(u)
        root_w = find(w)
        if root_u == root_w:
            print("NO") # Cycle found
            return
        parent[root_u] = root_w
        
    print("YES")

if __name__ == '__main__':
    solve()
