import sys
import heapq

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    idx = 2
    grid = []
    for _ in range(R):
        grid.append([int(x) for x in data[idx:idx+C]])
        idx += C
        
    dist = [[float('inf')] * C for _ in range(R)]
    dist[0][0] = 0
    pq = [(0, 0, 0)]  # (effort, r, c)
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    
    while pq:
        eff, r, c = heapq.heappop(pq)
        if r == R - 1 and c == C - 1:
            print(eff)
            return
            
        if eff > dist[r][c]:
            continue
            
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C:
                next_eff = max(eff, abs(grid[nr][nc] - grid[r][c]))
                if next_eff < dist[nr][nc]:
                    dist[nr][nc] = next_eff
                    heapq.heappush(pq, (next_eff, nr, nc))
                    
    print(0)

if __name__ == '__main__':
    solve()
