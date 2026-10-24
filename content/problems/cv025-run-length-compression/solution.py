import sys

def solve():
    data = sys.stdin.read().split()
    if not data:
        return
    s = data[0]
    n = len(s)
    res = []
    i = 0
    while i < n:
        char = s[i]
        count = 0
        while i < n and s[i] == char:
            count += 1
            i += 1
        res.append(f"{char}{count}")
    print(''.join(res))

if __name__ == '__main__':
    solve()
