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
        
    top, bottom = 0, R - 1
    left, right = 0, C - 1
    result = []
    
    while top <= bottom and left <= right:
        # Traverse right
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1
        
        # Traverse down
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1
        
        # Traverse left
        if top <= bottom:
            for c in range(right, left - 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
            
        # Traverse up
        if left <= right:
            for r in range(bottom, top - 1, -1):
                result.append(matrix[r][left])
            left += 1
            
    print(' '.join(map(str, result)))

if __name__ == '__main__':
    solve()
