import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    board = []
    idx = 2
    for _ in range(n):
        board.append(data[idx:idx+m])
        idx += m
        
    cr = int(data[idx])
    cc = int(data[idx+1])
    
    if board[cr][cc] == 'M':
        board[cr][cc] = 'X'
    else:
        dirs = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
        q = deque([(cr, cc)])
        
        while q:
            r, c = q.popleft()
            if board[r][c] != 'E':
                continue
                
            mines = 0
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < m and board[nr][nc] == 'M':
                    mines += 1
                    
            if mines > 0:
                board[r][c] = str(mines)
            else:
                board[r][c] = 'B'
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < m and board[nr][nc] == 'E':
                        q.append((nr, nc))
                        
    for row in board:
        print(' '.join(row))

if __name__ == '__main__':
    solve()
