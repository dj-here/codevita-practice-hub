import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    m = int(data[1])
    
    mat = []
    idx = 2
    for _ in range(n):
        mat.append([int(x) for x in data[idx:idx+m]])
        idx += m
        
    # Consecutive ones to the left
    left_ones = [[0] * m for _ in range(n)]
    for r in range(n):
        count = 0
        for c in range(m):
            if mat[r][c] == 1:
                count += 1
            else:
                count = 0
            left_ones[r][c] = count
            
    total = 0
    for r in range(n):
        for c in range(m):
            if mat[r][c] == 1:
                min_width = left_ones[r][c]
                for k in range(r, -1, -1):
                    min_width = min(min_width, left_ones[k][c])
                    if min_width == 0:
                        break
                    total += min_width
                    
    print(total)

if __name__ == '__main__':
    solve()
