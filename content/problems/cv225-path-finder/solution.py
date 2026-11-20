import sys
import heapq

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    idx = 0
    N = int(tokens[idx]); idx += 1
    M = int(tokens[idx]); idx += 1
    
    grid = []
    for _ in range(N):
        row = [int(tokens[idx + c]) for c in range(M)]
        idx += M
        grid.append(row)
        
    sr = int(tokens[idx]) - 1; idx += 1
    sc = int(tokens[idx]) - 1; idx += 1
    dr = int(tokens[idx]) - 1; idx += 1
    dc = int(tokens[idx]) - 1; idx += 1
    
    K = int(tokens[idx]); idx += 1
    blocked_set = set()
    for _ in range(K):
        br = int(tokens[idx]) - 1; idx += 1
        bc = int(tokens[idx]) - 1; idx += 1
        blocked_set.add((br, bc))
        
    dirs = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    
    pq = [(0, sr, sc)]
    dist = {}
    dist[(sr, sc)] = 0
    
    while pq:
        d, r, c = heapq.heappop(pq)
        if (r, c) == (dr, dc):
            print(d)
            return
            
        if d > dist.get((r, c), float('inf')):
            continue
            
        unblocked = []
        for d_r, d_c in dirs:
            nr, nc = r + d_r, c + d_c
            if 0 <= nr < N and 0 <= nc < M and (nr, nc) not in blocked_set:
                unblocked.append((nr, nc))
                
        if not unblocked:
            continue
            
        max_val = max(grid[nr][nc] for nr, nc in unblocked)
        curr_val = grid[r][c]
        target_to_beat = max(max_val, curr_val)
        
        for nr, nc in unblocked:
            v = grid[nr][nc]
            count_max = sum(1 for r2, c2 in unblocked if grid[r2][c2] == max_val)
            
            # If (nr, nc) is already the UNIQUE maximum among neighbors and > curr_val
            if v == max_val and count_max == 1 and v > curr_val:
                cost = 0
            else:
                cost = (target_to_beat + 1) - v
                
            new_d = d + cost
            if new_d < dist.get((nr, nc), float('inf')):
                dist[(nr, nc)] = new_d
                heapq.heappush(pq, (new_d, nr, nc))
                
    print(-1)

if __name__ == '__main__':
    solve()
