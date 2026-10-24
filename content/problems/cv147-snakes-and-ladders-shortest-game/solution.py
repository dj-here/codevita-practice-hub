import sys
from collections import deque

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    
    board = []
    idx = 1
    for _ in range(n):
        board.append([int(x) for x in data[idx:idx+n]])
        idx += n
        
    def get_coords(square):
        row = n - 1 - (square - 1) // n
        col = (square - 1) % n
        if (n - 1 - row) % 2 == 1:
            col = n - 1 - col
        return row, col
        
    target = n * n
    dist = [-1] * (target + 1)
    dist[1] = 0
    q = deque([1])
    
    while q:
        curr = q.popleft()
        if curr == target:
            print(dist[target])
            return
        for roll in range(1, 7):
            nxt = curr + roll
            if nxt > target:
                break
            r, c = get_coords(nxt)
            dest = board[r][c] if board[r][c] != -1 else nxt
            if dist[dest] == -1:
                dist[dest] = dist[curr] + 1
                q.append(dest)
                
    print(dist[target])

if __name__ == '__main__':
    solve()
