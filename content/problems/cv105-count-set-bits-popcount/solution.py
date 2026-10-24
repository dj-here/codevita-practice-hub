import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    count = 0
    while n > 0:
        n &= (n - 1)
        count += 1
    print(count)

if __name__ == '__main__':
    solve()
