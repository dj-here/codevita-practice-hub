import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    
    total = 0
    d = 1
    while d * d <= n:
        if n % d == 0:
            total += d
            if d * d != n:
                total += n // d
        d += 1
        
    print(total)

if __name__ == '__main__':
    solve()
