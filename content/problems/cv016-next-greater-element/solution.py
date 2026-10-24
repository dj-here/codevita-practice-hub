import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    
    result = [-1] * n
    stack = []  # stores indices
    
    for i in range(n):
        while stack and arr[i] > arr[stack[-1]]:
            idx = stack.pop()
            result[idx] = arr[i]
        stack.append(i)
        
    print(' '.join(map(str, result)))

if __name__ == '__main__':
    solve()
