import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    board = [list(data[2 + i]) for i in range(R)]
    word = data[2 + R]
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    visited = [[False] * C for _ in range(R)]
    
    def dfs(r, c, k):
        if k == len(word):
            return True
        if r < 0 or r >= R or c < 0 or c >= C:
            return False
        if visited[r][c] or board[r][c] != word[k]:
            return False
            
        visited[r][c] = True
        for dr, dc in dirs:
            if dfs(r + dr, c + dc, k + 1):
                return True
        visited[r][c] = False
        return False

    for r in range(R):
        for c in range(C):
            if dfs(r, c, 0):
                print("YES")
                return
    print("NO")

if __name__ == '__main__':
    solve()
