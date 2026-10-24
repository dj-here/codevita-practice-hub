import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    n = int(data[0])
    idx = 1
    total = 0
    for r in range(n):
        row = [int(x) for x in data[idx:idx+n]]
        idx += n
        total += row[r]  # primary
        if r != n - 1 - r:
            total += row[n - 1 - r]  # secondary
    print(total)

if __name__ == '__main__':
    solve()
