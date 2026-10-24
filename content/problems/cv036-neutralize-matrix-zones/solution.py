import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    R = int(data[0])
    C = int(data[1])
    idx = 2
    matrix = []
    for _ in range(R):
        matrix.append([int(x) for x in data[idx:idx+C]])
        idx += C
        
    zero_rows = set()
    zero_cols = set()
    
    for r in range(R):
        for c in range(C):
            if matrix[r][c] == 0:
                zero_rows.add(r)
                zero_cols.add(c)
                
    for r in range(R):
        for c in range(C):
            if r in zero_rows or c in zero_cols:
                matrix[r][c] = 0
                
    for row in matrix:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
