import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    board = []
    idx = 2
    for _ in range(n):
        row = data[idx:idx+m]
        board.append(row)
        idx += m
        
    # Mark border connected O cells
    stack = []
    for r in range(n):
        for c in (0, m - 1):
            if board[r][c] == 'O':
                board[r][c] = 'S'
                stack.append((r, c))
    for c in range(m):
        for r in (0, n - 1):
            if board[r][c] == 'O':
                board[r][c] = 'S'
                stack.append((r, c))
                
    while stack:
        r, c = stack.pop()
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and board[nr][nc] == 'O':
                board[nr][nc] = 'S'
                stack.append((nr, nc))
                
    for r in range(n):
        for c in range(m):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'S':
                board[r][c] = 'O'
                
    for row in board:
        print(' '.join(row))

if __name__ == '__main__':
    solve()
