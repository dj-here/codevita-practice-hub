import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    l = int(data[0])
    r = int(data[1])
    
    # Common prefix of binary representations of L and R
    shift = 0
    while l < r:
        l >>= 1
        r >>= 1
        shift += 1
        
    print(l << shift)

if __name__ == '__main__':
    solve()
