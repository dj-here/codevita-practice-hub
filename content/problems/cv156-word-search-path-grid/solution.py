import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    grid = []
    idx = 2
    for _ in range(n):
        grid.append(data[idx:idx+m])
        idx += m
    word = data[idx]
    
    def dfs(r, c, k):
        if k == len(word):
            return True
        if r < 0 or r >= n or c < 0 or c >= m or grid[r][c] != word[k]:
            return False
            
        temp = grid[r][c]
        grid[r][c] = '#'
        
        found = (dfs(r + 1, c, k + 1) or
                 dfs(r - 1, c, k + 1) or
                 dfs(r, c + 1, k + 1) or
                 dfs(r, c - 1, k + 1))
                 
        grid[r][c] = temp
        return found
        
    for r in range(n):
        for c in range(m):
            if dfs(r, c, 0):
                print("YES")
                return
                
    print("NO")

if __name__ == '__main__':
    solve()
