import sys

sys.setrecursionlimit(10000)

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    k = int(data[1])
    
    if n == 1:
        print(''.join(str(i) for i in range(k)))
        return
        
    visited = set()
    ans = []
    
    def dfs(node):
        for x in range(k):
            edge = node + str(x)
            if edge not in visited:
                visited.add(edge)
                dfs(edge[1:])
                ans.append(str(x))
                
    start_node = '0' * (n - 1)
    dfs(start_node)
    
    # Reverse post-order plus starting prefix
    print(start_node + ''.join(reversed(ans)))

if __name__ == '__main__':
    solve()
