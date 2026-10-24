import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    count = 0
    d = 1
    while d * d <= n:
        if n % d == 0:
            count += 1
            if d * d != n:
                count += 1
        d += 1
    print(count)

if __name__ == '__main__':
    solve()
