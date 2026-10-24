import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    start_r = int(data[1])
    start_c = int(data[2])
    
    if n == 1:
        print("YES")
        return
    if n <= 4:
        print("NO")
        return
        
    # Warnsdorff's heuristic for knight's tour
    moves = [(-2,-1), (-2,1), (-1,-2), (-1,2), (1,-2), (1,2), (2,-1), (2,1)]
    visited = [[False] * n for _ in range(n)]
    
    def count_onward_moves(r, c):
        count = 0
        for dr, dc in moves:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                count += 1
        return count
        
    curr_r, curr_c = start_r, start_c
    visited[curr_r][curr_c] = True
    
    for step in range(1, n * n):
        candidates = []
        for dr, dc in moves:
            nr, nc = curr_r + dr, curr_c + dc
            if 0 <= nr < n and 0 <= nc < n and not visited[nr][nc]:
                deg = count_onward_moves(nr, nc)
                candidates.append((deg, nr, nc))
                
        if not candidates:
            print("NO")
            return
            
        candidates.sort(key=lambda x: x[0])
        _, next_r, next_c = candidates[0]
        visited[next_r][next_c] = True
        curr_r, curr_c = next_r, next_c
        
    print("YES")

if __name__ == '__main__':
    solve()
