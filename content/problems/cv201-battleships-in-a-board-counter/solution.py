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
        board.append(data[idx:idx+m])
        idx += m
        
    count = 0
    for r in range(n):
        for c in range(m):
            if board[r][c] == 'X':
                # Check if it's the head of a battleship (top and left must not be X)
                if (r == 0 or board[r - 1][c] != 'X') and (c == 0 or board[r][c - 1] != 'X'):
                    count += 1
                    
    print(count)

if __name__ == '__main__':
    solve()
