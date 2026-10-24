import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    
    mat = [[0] * n for _ in range(n)]
    top, bottom = 0, n - 1
    left, right = 0, n - 1
    num = 1
    
    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            mat[top][c] = num
            num += 1
        top += 1
        for r in range(top, bottom + 1):
            mat[r][right] = num
            num += 1
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):
                mat[bottom][c] = num
                num += 1
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):
                mat[r][left] = num
                num += 1
            left += 1
            
    for row in mat:
        print(' '.join(map(str, row)))

if __name__ == '__main__':
    solve()
