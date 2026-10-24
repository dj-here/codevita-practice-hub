import sys
from collections import defaultdict

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    adj = defaultdict(list)
    idx = 1
    for _ in range(n):
        u = data[idx]
        v = data[idx+1]
        adj[u].append(v)
        idx += 2
        
    for u in adj:
        adj[u].sort(reverse=True)
        
    route = []
    
    # Hierholzer's algorithm
    def dfs(curr):
        while adj[curr]:
            nxt = adj[curr].pop()
            dfs(nxt)
        route.append(curr)
        
    dfs('JFK')
    print(' '.join(reversed(route)))

if __name__ == '__main__':
    solve()
