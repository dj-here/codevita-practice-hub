import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    matrix = []
    for _ in range(n):
        matrix.append([int(x) for x in data[idx:idx+n]])
        idx += n
        
    # Rotate 90 deg clockwise: Transpose then reverse each row
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
            
    for i in range(n):
        matrix[i].reverse()
        
    for row in matrix:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
