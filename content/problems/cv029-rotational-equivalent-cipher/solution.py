import sys

def solve():
    data = sys.stdin.read().split()
    if len(data) < 2:
        return
    s1, s2 = data[0], data[1]
    if len(s1) != len(s2):
        print("NO")
        return
    print("YES" if s2 in (s1 + s1) else "NO")

if __name__ == '__main__':
    solve()
