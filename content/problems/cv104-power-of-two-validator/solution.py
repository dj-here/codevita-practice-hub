import sys

def solve():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    if n > 0 and (n & (n - 1)) == 0:
        print("YES")
    else:
        print("NO")

if __name__ == '__main__':
    solve()
