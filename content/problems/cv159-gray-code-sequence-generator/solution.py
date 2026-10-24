import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    
    # Formula for i-th gray code: i ^ (i >> 1)
    total = 1 << n
    res = [i ^ (i >> 1) for i in range(total)]
    print(' '.join(map(str, res)))

if __name__ == '__main__':
    solve()
