import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    parent = list(range(n + 1))
    def find(i):
        path = []
        while parent[i] != i:
            path.append(i)
            i = parent[i]
        for node in path:
            parent[node] = i
        return i
        
    idx = 1
    redundant = None
    for _ in range(n):
        u = int(data[idx])
        v = int(data[idx+1])
        idx += 2
        
        root_u = find(u)
        root_v = find(v)
        if root_u == root_v:
            redundant = (u, v)
        else:
            parent[root_u] = root_v
            
    print(f"{redundant[0]} {redundant[1]}")

if __name__ == '__main__':
    solve()
