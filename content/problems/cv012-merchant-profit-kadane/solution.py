import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    arr = [int(x) for x in data[1:n+1]]
    
    max_so_far = arr[0]
    curr_max = arr[0]
    
    for i in range(1, n):
        curr_max = max(arr[i], curr_max + arr[i])
        max_so_far = max(max_so_far, curr_max)
        
    print(max_so_far)

if __name__ == '__main__':
    solve()
