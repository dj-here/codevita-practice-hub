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
        board.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    crush = [[False] * m for _ in range(n)]
    
    # Check horizontal
    for r in range(n):
        for c in range(m - 2):
            val = abs(board[r][c])
            if val != 0 and abs(board[r][c+1]) == val and abs(board[r][c+2]) == val:
                crush[r][c] = crush[r][c+1] = crush[r][c+2] = True
                
    # Check vertical
    for c in range(m):
        for r in range(n - 2):
            val = abs(board[r][c])
            if val != 0 and abs(board[r+1][c]) == val and abs(board[r+2][c]) == val:
                crush[r][c] = crush[r+1][c] = crush[r+2][c] = True
                
    # Crush to 0
    for r in range(n):
        for c in range(m):
            if crush[r][c]:
                board[r][c] = 0
                
    # Gravity drop
    for c in range(m):
        write_r = n - 1
        for r in range(n - 1, -1, -1):
            if board[r][c] != 0:
                board[write_r][c] = board[r][c]
                write_r -= 1
        for r in range(write_r, -1, -1):
            board[r][c] = 0
            
    for row in board:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
