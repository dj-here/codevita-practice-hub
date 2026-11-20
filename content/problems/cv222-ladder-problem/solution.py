import sys
from collections import deque

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    M = int(tokens[0])
    N = int(tokens[1])
    
    grid = []
    idx = 2
    for _ in range(M):
        row_str = ""
        while len(row_str) < N and idx < len(tokens):
            row_str += tokens[idx]
            idx += 1
        grid.append(row_str[:N])
        
    source_cells = []
    dest_cells = []
    for r in range(M):
        for c in range(N):
            ch = grid[r][c]
            if ch == 'I':
                source_cells.append((r, c))
            elif ch == 'L':
                dest_cells.append((r, c))
                
    if not source_cells or not dest_cells:
        print("Impossible")
        return
        
    L = len(source_cells)
    source_cells.sort()
    dest_cells.sort()
    
    # Orientation of start and target
    if len(source_cells) > 1 and source_cells[0][0] == source_cells[1][0]:
        init_ori = 'H'
        init_r = source_cells[0][0]
        init_c = source_cells[0][1]
    else:
        init_ori = 'V'
        init_r = source_cells[0][0]
        init_c = source_cells[0][1]
        
    if len(dest_cells) > 1 and dest_cells[0][0] == dest_cells[1][0]:
        target_ori = 'H'
        target_r = dest_cells[0][0]
        target_c = dest_cells[0][1]
    else:
        target_ori = 'V'
        target_r = dest_cells[0][0]
        target_c = dest_cells[0][1]
        
    def is_blocked(r, c):
        return grid[r][c] == 'B'
        
    def valid_H(r, c):
        if not (0 <= r < M and 0 <= c <= N - L):
            return False
        for k in range(L):
            if is_blocked(r, c + k):
                return False
        return True
        
    def valid_V(r, c):
        if not (0 <= r <= M - L and 0 <= c < N):
            return False
        for k in range(L):
            if is_blocked(r + k, c):
                return False
        return True
        
    def valid_square(sr, sc):
        if not (0 <= sr <= M - L and 0 <= sc <= N - L):
            return False
        for i in range(L):
            for j in range(L):
                if is_blocked(sr + i, sc + j):
                    return False
        return True

    queue = deque([(init_ori, init_r, init_c, 0)])
    visited = {(init_ori, init_r, init_c)}
    
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while queue:
        ori, r, c, d = queue.popleft()
        if ori == target_ori and r == target_r and c == target_c:
            print(d)
            return
            
        # 1. Move 1 cell in 4 directions
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if ori == 'H':
                if valid_H(nr, nc):
                    state = ('H', nr, nc)
                    if state not in visited:
                        visited.add(state)
                        queue.append(('H', nr, nc, d + 1))
            else:
                if valid_V(nr, nc):
                    state = ('V', nr, nc)
                    if state not in visited:
                        visited.add(state)
                        queue.append(('V', nr, nc, d + 1))
                        
        # 2. 90-degree rotations within an empty L x L bounding box
        if ori == 'H':
            for dr in range(L):
                sr = r - dr
                sc = c
                if valid_square(sr, sc):
                    for dc in range(L):
                        state = ('V', sr, sc + dc)
                        if state not in visited:
                            visited.add(state)
                            queue.append(('V', sr, sc + dc, d + 1))
        else:
            for dc in range(L):
                sr = r
                sc = c - dc
                if valid_square(sr, sc):
                    for dr in range(L):
                        state = ('H', sr + dr, sc)
                        if state not in visited:
                            visited.add(state)
                            queue.append(('H', sr + dr, sc, d + 1))
                            
    print("Impossible")

if __name__ == '__main__':
    solve()
